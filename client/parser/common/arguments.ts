import type { IdentifierLexeme } from "../../lexer/lexeme.ts";
import { CompilerError } from "../../tools/error.ts";
import type { Language } from "../../constants/languages.ts";
import type { Expression } from "../definitions/expression.ts";
import type { FunctionCall } from "../definitions/expressions/functionCall.ts";
import type { Lexemes } from "../definitions/lexemes.ts";
import type { Routine } from "../definitions/routine.ts";
import { Subroutine, getParameters } from "../definitions/routines/subroutine.ts";
import type { ProcedureCall } from "../definitions/statements/procedureCall.ts";
import { isArray } from "../definitions/variable.ts";
import parseExpression from "./expression.ts";
import typeCheck from "./typeCheck.ts";
import { Command } from "../../constants/commands.ts";
import { Variable } from "../definitions/variable.ts";
import { Parameter } from "../../constants/commands.ts";
import makeNamedArgument from "../definitions/expressions/namedArgument.ts";
import makeStringValue from "../definitions/expressions/stringValue.ts";
import { stringLexeme } from "../../lexer/lexeme.ts";
import { token } from "../../tokenizer/token.ts";

const parseArguments = (
  lexeme: IdentifierLexeme,
  lexemes: Lexemes,
  routine: Routine,
  commandCall: ProcedureCall | FunctionCall
): void => {
  const allParameters =
    commandCall.command.__ === "Command"
      ? commandCall.command.parameters
      : getParameters(commandCall.command);
  const isMethod =
    commandCall.command.__ === "Command" &&
    commandCall.command.names[routine.language]?.startsWith(".");
  const parameters = isMethod ? allParameters.slice(1) : allParameters;

  // with parameters
  if (parameters.length > 0) {
    // check for opening bracket
    if (!lexemes.get() || lexemes.get()?.content !== "(") {
      throw new CompilerError("Opening bracket missing after command {lex}.", lexeme);
    }

    // move past the opening bracket
    lexemes.next();

    // parse the arguments
    parseArgumentList(lexemes, routine, commandCall);
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

export default parseArguments;

const parseArgumentList = (
  lexemes: Lexemes,
  routine: Routine,
  commandCall: ProcedureCall | FunctionCall
): void => {
  const commandName =
    commandCall.command.__ === "Command"
      ? commandCall.command.names[routine.language]
      : commandCall.command.name;

  // handle the arguments
  const parameters =
    commandCall.command.__ === "Command"
      ? commandCall.command.parameters
      : getParameters(commandCall.command);
  
  if (routine.language === "Python" && commandName === "input") {
    // Python "input" command is a special case (until I generalise variadic functions)
    // single string argument is allowed (but not required)
    if (lexemes.get()?.content !== ")") {
      const parameter = parameters[0];
      const argument = parseExpression(lexemes, routine);
      typeCheckArgument(routine.language, commandCall.command, argument, parameter);
      commandCall.arguments.push(argument);
    }
    // allow 0 arguments
    if (commandCall.arguments.length === 0) {
      const lexeme = stringLexeme(token("string", "''", 0, 0), "Python");
      commandCall.arguments.push(makeStringValue(lexeme));
    }
  } else if (routine.language === "Python" && commandName === "print") {
    // Python "print" command is a special case (until I generalise variadic functions)
    // any number of string arguments is allowed (including zero)
    const parameter = parameters[0];
    while (lexemes.get()?.content !== ")") {
      const lexeme = lexemes.get()!;
      if (lexeme.type === "identifier" && lexemes.get(1)?.content === "=") {
        if (lexeme.content !== "end") {
          throw new CompilerError(`Unknown named argument ${lexeme.content}.`, lexeme);
        }
        lexemes.next();
        lexemes.next();
        const argument = parseExpression(lexemes, routine);
        typeCheckArgument(routine.language, commandCall.command, argument, parameter);
        const namedArgument = makeNamedArgument(lexeme, argument);
        commandCall.arguments.push(namedArgument);
      } else {
        const argument = parseExpression(lexemes, routine);
        typeCheckArgument(routine.language, commandCall.command, argument, parameter);
        commandCall.arguments.push(argument);
        if (lexemes.get()?.content === ",") {
          lexemes.next();
        }
      }
    }
    // allow 0 arguments
    if (commandCall.arguments.length === 0) {
      const lexeme = stringLexeme(token("string", "''", 0, 0), "Python");
      commandCall.arguments.push(makeStringValue(lexeme));
    }
  } else {
    // everything else is normal
    while (commandCall.arguments.length < parameters.length && lexemes.get()?.content !== ")") {
      const parameter = parameters[commandCall.arguments.length];
      let argument = parseExpression(lexemes, routine);
      argument = typeCheckArgument(routine.language, commandCall.command, argument, parameter);
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

export const typeCheckArgument = (
  language: Language,
  command: Command | Subroutine,
  argument: Expression,
  parameter: Parameter | Variable
): Expression => {
  if (command.__ === "Command") {
    switch (command.names[language]?.toLowerCase()) {
      case "address":
        // variable passed (by reference) to built-in address function can be of any type
        // so no type check is needed
        return argument;

      case "length":
      case ".length":
        // length command allows string or array arguments
        if (argument.expressionType === "variable" && isArray(argument.variable)) {
          return argument;
        }
        return typeCheck(language, argument, parameter);

      default:
        // standard type check by default
        return typeCheck(language, argument, parameter);
    }
  } else {
    return typeCheck(language, argument, parameter);
  }
};
