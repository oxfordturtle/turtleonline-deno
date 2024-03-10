import { operatorLexeme, type KeywordLexeme } from "../../../lexer/lexeme.ts";
import { token } from "../../../tokenizer/token.ts";
import { CompilerError } from "../../../tools/error.ts";
import parseExpression from "../../common/expression.ts";
import typeCheck from "../../common/typeCheck.ts";
import makeCompoundExpression from "../../definitions/expressions/compoundExpression.ts";
import type { Lexemes } from "../../definitions/lexemes.ts";
import { type Subroutine } from "../../definitions/routines/subroutine.ts";
import makeRepeatStatement, {
  type RepeatStatement,
} from "../../definitions/statements/repeatStatement.ts";
import parseBlock from "./block.ts";
import eosCheck from "./eosCheck.ts";

const parseDoStatement = (
  doLexeme: KeywordLexeme,
  lexemes: Lexemes,
  routine: Subroutine
): RepeatStatement => {
  // expecting an opening bracket
  if (!lexemes.get() || lexemes.get()?.content !== "{") {
    throw new CompilerError('"do" must be followed by an opening bracket "{".', lexemes.get(-1));
  }
  lexemes.next();

  // expecting a block of code
  const repeatStatements = parseBlock(lexemes, routine);

  // expecting "while"
  if (!lexemes.get() || lexemes.get()?.content !== "while") {
    throw new CompilerError('"do { ... }" must be followed by "while".', lexemes.get(-1));
  }
  lexemes.next();

  // expecting an opening bracket
  if (!lexemes.get() || lexemes.get()?.content !== "(") {
    throw new CompilerError('"while" must be followed by an opening bracket "(".', lexemes.get(-1));
  }
  lexemes.next();

  // expecting a boolean expression
  if (!lexemes.get()) {
    throw new CompilerError('"while (" must be followed by a boolean expression.', lexemes.get(-1));
  }
  let condition = parseExpression(lexemes, routine);
  condition = typeCheck(routine.language, condition, "boolean");
  // negate the condition
  const notToken = token("operator", "!", condition.lexeme.line, condition.lexeme.character);
  const notLexeme = operatorLexeme(notToken, "C");
  condition = makeCompoundExpression(notLexeme, null, condition, "not");

  // expecting a closing bracket
  if (!lexemes.get() || lexemes.get()?.content !== ")") {
    throw new CompilerError(
      '"while (..." must be followed by a closing bracket ")".',
      lexemes.get(-1)
    );
  }
  lexemes.next();

  // expecting a semicolon
  eosCheck(lexemes);

  // create and return the repeat statement
  const repeatStatement = makeRepeatStatement(doLexeme, condition);
  repeatStatement.statements.push(...repeatStatements);
  return repeatStatement;
};

export default parseDoStatement;
