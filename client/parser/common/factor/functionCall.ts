import type { Command } from "../../../constants/commands.ts";
import type { IdentifierLexeme } from "../../../lexer/lexeme.ts";
import { CompilerError } from "../../../tools/error.ts";
import basicBody from "../../basic/body.ts";
import makeFunctionCall, { type FunctionCall } from "../../definitions/expressions/functionCall.ts";
import type { VariableValue } from "../../definitions/expressions/variableValue.ts";
import type { Lexemes } from "../../definitions/lexemes.ts";
import type { Routine } from "../../definitions/routine.ts";
import { getSubroutineType, type Subroutine } from "../../definitions/routines/subroutine.ts";
import makeVariable from "../../definitions/variable.ts";
import parseArguments, { typeCheckArgument } from "../arguments.ts";

const parseFunctionCall = (
  lexeme: IdentifierLexeme,
  lexemes: Lexemes,
  routine: Routine,
  command: Command | Subroutine
): FunctionCall => {
  // infer type
  if (command.__ === "Subroutine" && !command.typeIsCertain) {
    command.typeIsCertain = true;
    command.variables.unshift(makeVariable("!result", command));
  }

  const commandType = command.__ === "Command" ? command.type : getSubroutineType(command);
  if (commandType === "procedure") {
    throw new CompilerError("{lex} is a procedure, not a function.", lexemes.get(-1));
  }

  const functionCall = makeFunctionCall(lexeme, command);
  parseArguments(lexeme, lexemes, routine, functionCall);

  if (functionCall.command.__ === "Subroutine" && functionCall.command !== routine) {
    if (routine.language === "BASIC" && functionCall.command.statements.length === 0) {
      const previousLexemeIndex = lexemes.index;
      basicBody(lexemes, functionCall.command);
      lexemes.index = previousLexemeIndex;
    }
  }

  return functionCall;
};

export default parseFunctionCall;

export const parseMethodFunctionCall = (
  lexeme: IdentifierLexeme,
  lexemes: Lexemes,
  routine: Routine,
  method: Command,
  variableValue: VariableValue
): FunctionCall => {
  try {
    typeCheckArgument(routine.language, method, variableValue, method.parameters[0]);
  } catch {
    throw new CompilerError(
      `Method "${method.names[routine.language]}" is not defined for type "${
        variableValue.variable.type
      }".`,
      lexeme
    );
  }

  const functionCall = makeFunctionCall(lexeme, method);
  functionCall.arguments.push(variableValue);
  parseArguments(lexeme, lexemes, routine, functionCall);

  return functionCall;
};
