import { type KeywordLexeme } from "../../../lexer/lexeme.ts";
import { CompilerError } from "../../../tools/error.ts";
import parseExpression from "../../common/expression.ts";
import typeCheck from "../../common/typeCheck.ts";
import type { Lexemes } from "../../definitions/lexemes.ts";
import type { Program } from "../../definitions/routines/program.ts";
import { type Subroutine } from "../../definitions/routines/subroutine.ts";
import type { Statement } from "../../definitions/statement.ts";
import makeRepeatStatement, {
  type RepeatStatement,
} from "../../definitions/statements/repeatStatement.ts";
import parseStatement from "../statement.ts";
import parseBlock from "./block.ts";

const parseRepeatStatement = (
  lexeme: KeywordLexeme,
  lexemes: Lexemes,
  routine: Program | Subroutine
): RepeatStatement => {
  let repeatStatements: Statement[];

  // expecting a statement on the same line or a block of statements on a new line
  const firstInnerLexeme = lexemes.get();
  if (!firstInnerLexeme) {
    throw new CompilerError('No statements found after "REPEAT".', lexeme);
  }
  if (firstInnerLexeme.type === "newline") {
    while (lexemes.get()?.type === "newline") {
      lexemes.next();
    }
    repeatStatements = parseBlock(lexemes, routine, "REPEAT");
  } else {
    repeatStatements = [parseStatement(firstInnerLexeme, lexemes, routine)];
  }

  // expecting a boolean expression
  if (!lexemes.get()) {
    throw new CompilerError('"UNTIL" must be followed by a boolean expression.', lexemes.get(-1));
  }
  let condition = parseExpression(lexemes, routine);
  condition = typeCheck(routine.language, condition, "boolean");

  // now we have everything we need
  const repeatStatement = makeRepeatStatement(lexeme, condition);
  repeatStatement.statements.push(...repeatStatements);
  return repeatStatement;
};

export default parseRepeatStatement;
