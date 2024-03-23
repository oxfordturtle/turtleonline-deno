import type { DelimiterLexeme } from "../../../lexer/lexeme.ts";
import { makeExpression, type Expression, type ExpressionCommon } from "../expression.ts";
import type { VariableIndex } from "./variableIndex.ts";
import type { VariableValue } from "./variableValue.ts";

export interface VariableSlice extends ExpressionCommon {
  readonly expressionType: "variableSlice";
  readonly lexeme: DelimiterLexeme;
  readonly variableExpression: VariableValue | VariableIndex | VariableSlice;
  readonly startIndexExpression: Expression;
  readonly endIndexExpression?: Expression;
}

const makeVariableSlice = (
  lexeme: DelimiterLexeme,
  variableExpression: VariableValue | VariableIndex | VariableSlice,
  startIndexExpression: Expression,
  endIndexExpression?: Expression
): VariableSlice => ({
  ...makeExpression(),
  expressionType: "variableSlice",
  lexeme,
  variableExpression,
  startIndexExpression,
  endIndexExpression,
});

export default makeVariableSlice;
