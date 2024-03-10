import { type KeywordLexeme } from "../../../lexer/lexeme.ts";
import { CompilerError } from "../../../tools/error.ts";
import parseExpression from "../../common/expression.ts";
import typeCheck from "../../common/typeCheck.ts";
import type { Lexemes } from "../../definitions/lexemes.ts";
import type { Program } from "../../definitions/routines/program.ts";
import type { Subroutine } from "../../definitions/routines/subroutine.ts";
import makeWhileStatement, {
  type WhileStatement,
} from "../../definitions/statements/whileStatement.ts";
import parseStatement from "../statement.ts";
import parseBlock from "./block.ts";

const parseWhileStatement = (
  whileLexeme: KeywordLexeme,
  lexemes: Lexemes,
  routine: Program | Subroutine
): WhileStatement => {
  // expecting a boolean expression
  if (!lexemes.get()) {
    throw new CompilerError('"WHILE" must be followed by a boolean expression.', whileLexeme);
  }
  let condition = parseExpression(lexemes, routine);
  condition = typeCheck(routine.language, condition, "boolean");

  // now we can create the statement
  const whileStatement = makeWhileStatement(whileLexeme, condition);

  // expecting "DO"
  if (!lexemes.get()) {
    throw new CompilerError('"WHILE ..." must be followed by "DO".', condition.lexeme);
  }
  if (lexemes.get()?.content !== "do") {
    throw new CompilerError('"WHILE ..." must be followed by "DO".', lexemes.get());
  }
  lexemes.next();

  // expecting a block of code
  const firstSubLexeme = lexemes.get();
  if (!firstSubLexeme) {
    throw new CompilerError(
      'No commands found after "WHILE" loop initialisation.',
      lexemes.get(-1)
    );
  }
  if (lexemes.get()?.content?.toLowerCase() === "begin") {
    lexemes.next();
    whileStatement.statements.push(...parseBlock(lexemes, routine, "begin"));
  } else {
    whileStatement.statements.push(parseStatement(firstSubLexeme, lexemes, routine));
  }

  // now we have everything we need to generate the pcode
  return whileStatement;
};

export default parseWhileStatement;
