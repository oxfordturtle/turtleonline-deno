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
import parseBlock from "./block.ts";

const parseWhileStatement = (
  whileLexeme: KeywordLexeme,
  lexemes: Lexemes,
  routine: Program | Subroutine
): WhileStatement => {
  // expecting an opening bracket
  if (!lexemes.get() || lexemes.get()?.content !== "(") {
    throw new CompilerError('"while" must be followed by an opening bracket "(".', lexemes.get(-1));
  }
  lexemes.next();

  // expecting a boolean expression
  if (!lexemes.get()) {
    throw new CompilerError('"while (" must be followed by a Boolean expression.', lexemes.get(-1));
  }
  let condition = parseExpression(lexemes, routine);
  condition = typeCheck(routine.language, condition, "boolean");

  // expecting a closing bracket
  if (!lexemes.get() || lexemes.get()?.content !== ")") {
    throw new CompilerError(
      '"while (..." must be followed by a closing bracket ")".',
      lexemes.get(-1)
    );
  }
  lexemes.next();

  // create the while statement
  const whileStatement = makeWhileStatement(whileLexeme, condition);

  // expecting an opening curly bracket
  if (!lexemes.get() || lexemes.get()?.content !== "{") {
    throw new CompilerError(
      '"while (...)" must be followed by an opening curly bracket "{".',
      lexemes.get(-1)
    );
  }
  lexemes.next();

  // expecting a block of statements
  whileStatement.statements.push(...parseBlock(lexemes, routine));

  // now we have everything we need
  return whileStatement;
};

export default parseWhileStatement;
