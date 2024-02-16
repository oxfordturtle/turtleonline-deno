import type { IdentifierLexeme, OperatorLexeme } from "../../../lexer/lexeme.ts";
import type { Type } from "../../../lexer/types.ts";
import { makeExpression, type Expression, type ExpressionCommon } from "../expression.ts";
import type { Variable } from "../variable.ts";

export interface VariableValue extends ExpressionCommon {
  readonly expressionType: "variable";
  readonly lexeme: IdentifierLexeme | OperatorLexeme; // can be "+=" or "-=" operators in a variable assignment
  readonly variable: Variable;
  slice: [Expression, Expression] | null; // for string/array slices, TODO: make readonly
  readonly indexes: Expression[]; // for elements of array variables
  readonly type: Type;
}

const makeVariableValue = (
  lexeme: IdentifierLexeme | OperatorLexeme,
  variable: Variable
): VariableValue => ({
  ...makeExpression(),
  expressionType: "variable",
  lexeme,
  variable,
  slice: null,
  indexes: [],
  type: variable.type,
});

export default makeVariableValue;
