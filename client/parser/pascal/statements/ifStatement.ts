import type { KeywordLexeme } from "../../../lexer/lexeme.ts";
import { CompilerError } from "../../../tools/error.ts";
import parseExpression from "../../common/expression.ts";
import typeCheck from "../../common/typeCheck.ts";
import type { Lexemes } from "../../definitions/lexemes.ts";
import type { Program } from "../../definitions/routines/program.ts";
import type { Subroutine } from "../../definitions/routines/subroutine.ts";
import makeIfStatement, { type IfStatement } from "../../definitions/statements/ifStatement.ts";
import parseStatement from "../statement.ts";
import parseBlock from "./block.ts";

const parseIfStatement = (
  ifLexeme: KeywordLexeme,
  lexemes: Lexemes,
  routine: Program | Subroutine
): IfStatement => {
  // expecting a boolean expression
  if (!lexemes.get()) {
    throw new CompilerError('"IF" must be followed by a boolean expression.', ifLexeme);
  }
  let condition = parseExpression(lexemes, routine);
  condition = typeCheck(routine.language, condition, "boolean");

  // now we can create the statement
  const ifStatement = makeIfStatement(ifLexeme, condition);

  // expecting "then"
  if (!lexemes.get() || lexemes.get()?.content?.toLowerCase() !== "then") {
    throw new CompilerError('"IF ..." must be followed by "THEN".', condition.lexeme);
  }
  lexemes.next();

  // expecting a command or a block of commands
  const firstSubLexeme = lexemes.get();
  if (!firstSubLexeme) {
    throw new CompilerError('No commands found after "IF ... THEN".', lexemes.get(-1));
  }
  if (firstSubLexeme.content?.toLowerCase() === "begin") {
    lexemes.next();
    ifStatement.ifStatements.push(...parseBlock(lexemes, routine, "begin"));
  } else {
    ifStatement.ifStatements.push(parseStatement(firstSubLexeme, lexemes, routine));
  }

  // happy with an "else" here (but it's optional)
  if (lexemes.get() && lexemes.get()?.content?.toLowerCase() === "else") {
    // expecting a command or a block of commands
    lexemes.next();
    const firstSubLexeme = lexemes.get();
    if (!firstSubLexeme) {
      throw new CompilerError('No commands found after "ELSE".', lexemes.get(-1));
    }
    if (firstSubLexeme.content?.toLowerCase() === "begin") {
      lexemes.next();
      ifStatement.elseStatements.push(...parseBlock(lexemes, routine, "begin"));
    } else {
      ifStatement.elseStatements.push(parseStatement(firstSubLexeme, lexemes, routine));
    }
  }

  // now we have everything we need
  return ifStatement;
};

export default parseIfStatement;
