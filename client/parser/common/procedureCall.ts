import type { Command } from "../../constants/commands.ts";
import type { IdentifierLexeme } from "../../lexer/lexeme.ts";
import { CompilerError } from "../../tools/error.ts";
import basicBody from "../basic/body.ts";
import type { Lexemes } from "../definitions/lexemes.ts";
import type { Routine } from "../definitions/routine.ts";
import { getSubroutineType, type Subroutine } from "../definitions/routines/subroutine.ts";
import makeProcedureCall, { type ProcedureCall } from "../definitions/statements/procedureCall.ts";
import parseArguments from "./arguments.ts";

const parseProcedureCall = (
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
  if (command.__ === "Subroutine") {
    command.typeIsCertain = true;
  }

  const procedureCall = makeProcedureCall(lexeme, command);
  parseArguments(lexeme, lexemes, routine, procedureCall);
  if (procedureCall.command.__ === "Subroutine" && procedureCall.command !== routine) {
    if (routine.language === "BASIC" && procedureCall.command.statements.length === 0) {
      const previousLexemeIndex = lexemes.index;
      basicBody(lexemes, procedureCall.command);
      lexemes.index = previousLexemeIndex;
    }
  }

  return procedureCall;
};

export default parseProcedureCall;
