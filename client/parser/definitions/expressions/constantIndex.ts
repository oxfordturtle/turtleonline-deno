import type { Lexeme } from "../../../lexer/lexeme.ts";
import { makeExpression, type Expression, type ExpressionCommon } from "../expression.ts";
import type { ConstantValue } from "./constantValue.ts";

export interface ConstantIndex extends ExpressionCommon {
  readonly expressionType: "constantIndex";
  readonly lexeme: Lexeme;
  readonly constantExpression: ConstantValue;
  readonly indexExpression: Expression;
}

const makeConstantIndex = (
  lexeme: Lexeme,
  constantExpression: ConstantValue,
  indexExpression: Expression
): ConstantIndex => ({
  ...makeExpression(),
  expressionType: "constantIndex",
  lexeme,
  constantExpression,
  indexExpression,
});

export default makeConstantIndex;
