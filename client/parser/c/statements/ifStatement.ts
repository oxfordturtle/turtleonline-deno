import { type KeywordLexeme } from "../../../lexer/lexeme.ts";
import { CompilerError } from "../../../tools/error.ts";
import parseExpression from "../../common/expression.ts";
import typeCheck from "../../common/typeCheck.ts";
import type { Lexemes } from "../../definitions/lexemes.ts";
import { type Subroutine } from "../../definitions/routines/subroutine.ts";
import makeIfStatement, { type IfStatement } from "../../definitions/statements/ifStatement.ts";
import parseBlock from "./block.ts";

const parseIfStatement = (
  ifLexeme: KeywordLexeme,
  lexemes: Lexemes,
  routine: Subroutine
): IfStatement => {
  // expecting an opening bracket
  if (!lexemes.get() || lexemes.get()?.content !== "(") {
    throw new CompilerError('"if" must be followed by an opening bracket "(".', ifLexeme);
  }
  lexemes.next();

  // expecting a boolean expression
  if (!lexemes.get()) {
    throw new CompilerError('"if (" must be followed by a Boolean expression.', lexemes.get(-1));
  }
  let condition = parseExpression(lexemes, routine);
  condition = typeCheck(routine.language, condition, "boolean");

  // expecting a closing bracket
  if (!lexemes.get() || lexemes.get()?.content !== ")") {
    throw new CompilerError(
      '"if (..." must be followed by a closing bracket ")".',
      lexemes.get(-1)
    );
  }
  lexemes.next();

  // create the if statement
  const ifStatement = makeIfStatement(ifLexeme, condition);

  // expecting an opening curly bracket
  if (!lexemes.get() || lexemes.get()?.content !== "{") {
    throw new CompilerError(
      '"if (...)" must be followed by an opening curly bracket "{".',
      lexemes.get(-1)
    );
  }
  lexemes.next();

  // expecting a block of statements
  ifStatement.ifStatements.push(...parseBlock(lexemes, routine));

  // happy with an "else" here (but it's optional)
  if (lexemes.get() && lexemes.get()?.content === "else") {
    lexemes.next();

    // expecting an opening bracket
    if (!lexemes.get() || lexemes.get()?.content !== "{") {
      throw new CompilerError(
        '"else" must be followed by an opening bracket "{".',
        lexemes.get(-1)
      );
    }
    lexemes.next();

    // expecting a block of statements
    ifStatement.elseStatements.push(...parseBlock(lexemes, routine));
  }

  // now we have everything we need
  return ifStatement;
};

export default parseIfStatement;
