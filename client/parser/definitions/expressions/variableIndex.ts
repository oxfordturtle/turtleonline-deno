import type { Lexeme } from "../../../lexer/lexeme.ts";
import { makeExpression, type Expression, type ExpressionCommon } from "../expression.ts";
import type { VariableSlice } from "./variableSlice.ts";
import type { VariableValue } from "./variableValue.ts";

export interface VariableIndex extends ExpressionCommon {
  readonly expressionType: "variableIndex";
  readonly lexeme: Lexeme;
  readonly variableExpression: VariableValue | VariableIndex | VariableSlice;
  readonly indexExpression: Expression;
}

const makeVariableValue = (
  lexeme: Lexeme,
  variableExpression: VariableValue | VariableIndex | VariableSlice,
  indexExpression: Expression
): VariableIndex => ({
  ...makeExpression(),
  expressionType: "variableIndex",
  lexeme,
  variableExpression,
  indexExpression,
});

export default makeVariableValue;
