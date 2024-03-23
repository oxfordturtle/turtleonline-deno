import type { OperatorLexeme } from "../../lexer/lexeme.ts";
import type { Operator } from "../../lexer/types.ts";
import { CompilerError } from "../../tools/error.ts";
import { getType, type Expression } from "../definitions/expression.ts";
import makeCompoundExpression from "../definitions/expressions/compoundExpression.ts";
import { type Lexemes } from "../definitions/lexemes.ts";
import { operator, stringOperator } from "../definitions/operators.ts";
import type { Routine } from "../definitions/routine.ts";
import parseFactor from "./factor.ts";
import typeCheck from "./typeCheck.ts";

const parseExpression = (lexemes: Lexemes, routine: Routine, level = 0): Expression => {
  // check for a lexeme
  const lexeme = lexemes.get();
  if (lexeme === undefined) {
    throw new CompilerError("Expected an expression after {lex}.", lexemes.get(-1));
  }

  // break out of recursion at level > 2
  if (level > 2) {
    return parseFactor(lexeme, lexemes, routine);
  }

  // evaluate the first bit
  let exp = parseExpression(lexemes, routine, level + 1);

  while (operator(lexemes.get(), level)) {
    // get the operator (provisionally), and save the operator lexeme
    const lexeme = lexemes.get() as OperatorLexeme;
    let op = operator(lexeme, level) as Operator;

    // move past the operator
    lexemes.next();

    // evaluate the second bit
    let nextExp = parseExpression(lexemes, routine, level + 1);

    // check types match (check both ways - so that if there's a character on
    // either side, and a string on the other, we'll know to convert the
    // character to a string)
    exp = typeCheck(routine.language, exp, getType(nextExp));
    nextExp = typeCheck(routine.language, nextExp, getType(exp));

    // maybe replace provisional operator with its string equivalent
    if (getType(exp) === "string" || getType(nextExp) === "string") {
      op = stringOperator(op);
    }
    if (getType(exp) === "character" || getType(nextExp) === "character") {
      // TODO: reconsider this, as this behaviour is not ideal
      // whether to use the string operator should be determined by the context
      // i.e. if we're expecting a string, use the string equivalent ??
      if (op === "plus") {
        op = stringOperator(op);
      }
    }

    // create a compound expression with the operator
    exp = makeCompoundExpression(lexeme, exp, nextExp, op);
  }

  // return the expression
  return exp;
}

export default parseExpression;
