import { type KeywordLexeme } from "../../../lexer/lexeme.ts";
import { CompilerError } from "../../../tools/error.ts";
import { variableValue as _variableValue } from "../../definitions/expression.ts";
import type Lexemes from "../../definitions/lexemes.ts";
import { type Routine } from "../../definitions/routine.ts";
import {
  whileStatement as _whileStatement,
  type WhileStatement,
} from "../../definitions/statement.ts";
import { variable as _variable } from "../../definitions/variable.ts";
import { expression, typeCheck } from "../../expression.ts";
import parseBlock from "./block.ts";

export default (whileLexeme: KeywordLexeme, lexemes: Lexemes, routine: Routine): WhileStatement => {
  // expecting a boolean expression
  if (!lexemes.get()) {
    throw new CompilerError('"while" must be followed by a Boolean expression.', whileLexeme);
  }
  let condition = expression(lexemes, routine);
  condition = typeCheck(routine.language, condition, "boolean");

  // expecting a colon
  if (!lexemes.get()) {
    throw new CompilerError('"while <expression>" must be followed by a colon.', lexemes.get(-1));
  }
  if (lexemes.get()?.content !== ":") {
    throw new CompilerError('"while <expression>" must be followed by a colon.', lexemes.get());
  }
  lexemes.next();

  // expecting newline
  if (!lexemes.get()) {
    throw new CompilerError('No statements found after "while <expression>:".', lexemes.get(-1));
  }
  if (lexemes.get()?.type !== "newline") {
    throw new CompilerError(
      'Statements following "while <expression>:" must be on a new line.',
      lexemes.get()
    );
  }
  lexemes.next();

  // create the while statement
  const whileStatement = _whileStatement(whileLexeme, condition);

  // expecting indent
  if (!lexemes.get()) {
    throw new CompilerError('No statements found after "while <expression>:".', lexemes.get(-1));
  }
  if (lexemes.get()?.type !== "indent") {
    throw new CompilerError(
      'Statements following "while <expression>:" must be indented.',
      lexemes.get()
    );
  }
  lexemes.next();

  // expecting a block of statements
  if (!lexemes.get()) {
    throw new CompilerError('No statements found after "while <expression>:".', lexemes.get(-1));
  }
  whileStatement.statements.push(...parseBlock(lexemes, routine));

  // now we have everything we need
  return whileStatement;
};
