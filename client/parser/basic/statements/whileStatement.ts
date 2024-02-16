import { type KeywordLexeme } from "../../../lexer/lexeme.ts";
import { CompilerError } from "../../../tools/error.ts";
import parseExpression from "../../common/expression.ts";
import typeCheck from "../../common/typeCheck.ts";
import type { Lexemes } from "../../definitions/lexemes.ts";
import type { Program } from "../../definitions/routines/program.ts";
import { type Subroutine } from "../../definitions/routines/subroutine.ts";
import makeWhileStatement, {
  type WhileStatement,
} from "../../definitions/statements/whileStatement.ts";
import parseStatement from "../statement.ts";
import parseBlock from "./block.ts";

const parseWhileStatement = (
  lexeme: KeywordLexeme,
  lexemes: Lexemes,
  routine: Program | Subroutine
): WhileStatement => {
  // expecting a boolean expression
  if (!lexemes.get()) {
    throw new CompilerError('"WHILE" must be followed by a boolean expression.', lexemes.get(-1));
  }
  let condition = parseExpression(lexemes, routine);
  condition = typeCheck(routine.language, condition, "boolean");

  // create the statement
  const whileStatement = makeWhileStatement(lexeme, condition);

  // expecting a statement on the same line or a block of statements on a new line
  const firstInnerLexeme = lexemes.get();
  if (!firstInnerLexeme) {
    throw new CompilerError('No commands found after "WHILE ... DO".', lexemes.get(-1));
  }
  if (firstInnerLexeme.type === "newline") {
    while (lexemes.get()?.type === "newline") {
      lexemes.next();
    }
    whileStatement.statements.push(...parseBlock(lexemes, routine, "WHILE"));
  } else {
    whileStatement.statements.push(parseStatement(firstInnerLexeme, lexemes, routine));
  }

  // now we have everything we need to generate the pcode
  return whileStatement;
};

export default parseWhileStatement;
