import type { Command } from "../constants/commands.ts";
import type { IdentifierLexeme } from "../lexer/lexeme.ts";
import { CompilerError } from "../tools/error.ts";
import basicBody from "./basic/body.ts";
import {
  functionCall as _functionCall,
  type FunctionCall,
  type VariableValue,
} from "./definitions/expression.ts";
import type Lexemes from "./definitions/lexemes.ts";
import { procedureCall as _procedureCall, type ProcedureCall } from "./definitions/statement.ts";
import type { Routine, Subroutine } from "./definitions/routine.ts";
import { isArray, variable } from "./definitions/variable.ts";
import { expression, typeCheck } from "./expression.ts";
import { getSubroutineType } from "./definitions/routine.ts";
import { getParameters } from "./definitions/routine.ts";

export const procedureCall = (
  lexeme: IdentifierLexeme,
  lexemes: Lexemes,
  routine: Routine,
  command: Command | Subroutine
): ProcedureCall => {
  // check it's not a function
  const commandType = command.__ === "Command" ? command.type : getSubroutineType(command);
  if (commandType === "function") {
    throw new CompilerError("{lex} is a function, not a procedure.", lexeme);
  }

  // for Python, establish that it's definitely not a function
  // (so subsequent attempts to call it as such will throw an error)
  if (command.__ === "subroutine") {
    command.typeIsCertain = true;
  }

  const procedureCall = _procedureCall(lexeme, command);
  brackets(lexeme, lexemes, routine, procedureCall);
  if (procedureCall.command.__ === "subroutine" && procedureCall.command !== routine) {
    if (routine.language === "BASIC" && procedureCall.command.statements.length === 0) {
      const previousLexemeIndex = lexemes.index;
      basicBody(lexemes, procedureCall.command);
      lexemes.index = previousLexemeIndex;
    }
  }

  return procedureCall;
};

export const functionCall = (
  lexeme: IdentifierLexeme,
  lexemes: Lexemes,
  routine: Routine,
  command: Command | Subroutine
): FunctionCall => {
  // infer type
  if (command.__ === "subroutine" && !command.typeIsCertain) {
    command.typeIsCertain = true;
    command.variables.unshift(variable("!result", command));
  }

  const commandType = command.__ === "Command" ? command.type : getSubroutineType(command);
  if (commandType === "procedure") {
    throw new CompilerError("{lex} is a procedure, not a function.", lexemes.get(-1));
  }

  const functionCall = _functionCall(lexeme, command);
  brackets(lexeme, lexemes, routine, functionCall);

  if (functionCall.command.__ === "subroutine" && functionCall.command !== routine) {
    if (routine.language === "BASIC" && functionCall.command.statements.length === 0) {
      const previousLexemeIndex = lexemes.index;
      basicBody(lexemes, functionCall.command);
      lexemes.index = previousLexemeIndex;
    }
  }

  return functionCall;
};

export const methodFunctionCall = (
  lexeme: IdentifierLexeme,
  lexemes: Lexemes,
  routine: Routine,
  method: Command,
  variableValue: VariableValue
): FunctionCall => {
  if (method.parameters[0].type !== variableValue.variable.type) {
    throw new CompilerError(
      `Method "${method.names[routine.language]}" is not defined for type "${
        variableValue.variable.type
      }".`,
      lexeme
    );
  }

  const functionCall = _functionCall(lexeme, method);
  functionCall.arguments.push(variableValue);
  brackets(lexeme, lexemes, routine, functionCall);

  return functionCall;
};

const brackets = (
  lexeme: IdentifierLexeme,
  lexemes: Lexemes,
  routine: Routine,
  commandCall: ProcedureCall | FunctionCall
): void => {
  const allParameters = commandCall.command.__ === "Command"
    ? commandCall.command.parameters
    : getParameters(commandCall.command);
  const isMethod =
    commandCall.command.__ === "Command" &&
    commandCall.command.names[routine.language]?.startsWith(".");
  const parameters = isMethod
    ? allParameters.slice(1)
    : allParameters;

  // with parameters
  if (parameters.length > 0) {
    // check for opening bracket
    if (!lexemes.get() || lexemes.get()?.content !== "(") {
      throw new CompilerError("Opening bracket missing after command {lex}.", lexeme);
    }

    // move past the opening bracket
    lexemes.next();

    // parse the arguments
    _arguments(lexemes, routine, commandCall);
  }

  // without parameters
  else {
    // command with no parameters in BASIC or Pascal (brackets not allowed)
    if (routine.language === "BASIC" || routine.language === "Pascal") {
      if (lexemes.get() && lexemes.get()?.content === "(") {
        throw new CompilerError("Command {lex} takes no arguments.", lexemes.get(-1));
      }
    }

    // command with no parameters in other languages (brackets obligatory)
    else {
      const openBracket = lexemes.get();
      const closeBracket = lexemes.get(1);
      // check for opening bracket
      if (!openBracket || openBracket.content !== "(") {
        throw new CompilerError("Opening bracket missing after command {lex}.", lexemes.get(-1));
      }

      // check for immediate closing bracket (no arguments)
      if (!closeBracket || closeBracket.type === "newline" || closeBracket.content === ";") {
        throw new CompilerError("Closing bracket missing after command {lex}.", lexemes.get(-1));
      }
      if (closeBracket.content !== ")") {
        throw new CompilerError("Command {lex} takes no arguments.", lexemes.get(-1));
      }

      // move past the brackets
      lexemes.next();
      lexemes.next();
    }
  }
};

const _arguments = (
  lexemes: Lexemes,
  routine: Routine,
  commandCall: ProcedureCall | FunctionCall
): void => {
  const commandName =
    commandCall.command.__ === "Command"
      ? commandCall.command.names[routine.language]
      : commandCall.command.name;

  // handle the arguments
  const parameters = commandCall.command.__ === "Command"
    ? commandCall.command.parameters
    : getParameters(commandCall.command);
  while (
    commandCall.arguments.length < parameters.length &&
    lexemes.get()?.content !== ")"
  ) {
    const parameter = parameters[commandCall.arguments.length];
    let argument = expression(lexemes, routine);
    if (commandCall.command.__ === "Command") {
      switch (commandCall.command.names[routine.language]?.toLowerCase()) {
        case "address":
          // variable passed (by reference) to built-in address function can be of any type
          // so no type check is needed
          break;

        case "length":
          // length command allows string or array arguments
          if (!(argument.expressionType === "variable") || !isArray(argument.variable)) {
            argument = typeCheck(routine.language, argument, parameter);
          }
          break;

        default:
          // standard type check by default
          argument = typeCheck(routine.language, argument, parameter);
          break;
      }
    } else {
      argument = typeCheck(routine.language, argument, parameter);
    }
    commandCall.arguments.push(argument);
    if (commandCall.arguments.length < parameters.length) {
      if (!lexemes.get()) {
        throw new CompilerError("Comma needed after parameter.", argument.lexeme);
      }
      if (lexemes.get()?.content === ")") {
        throw new CompilerError(
          `Not enough arguments given for command "${commandName}".`,
          commandCall.lexeme
        );
      }
      if (lexemes.get()?.content !== ",") {
        throw new CompilerError("Comma needed after parameter.", argument.lexeme);
      }
      lexemes.next();
    }
  }

  // final error checking
  if (commandCall.arguments.length < parameters.length) {
    throw new CompilerError("Too few arguments given for command {lex}.", commandCall.lexeme);
  }
  if (lexemes.get()?.content === ",") {
    throw new CompilerError("Too many arguments given for command {lex}.", commandCall.lexeme);
  }
  if (lexemes.get()?.content !== ")") {
    throw new CompilerError("Closing bracket missing after command {lex}.", commandCall.lexeme);
  }

  // move past the closing bracket
  lexemes.next();
};
