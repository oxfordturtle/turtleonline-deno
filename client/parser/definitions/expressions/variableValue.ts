import type { IdentifierLexeme, OperatorLexeme } from "../../../lexer/lexeme.ts";
import { makeExpression, type ExpressionCommon } from "../expression.ts";
import type { Variable } from "../variable.ts";

export interface VariableValue extends ExpressionCommon {
  readonly expressionType: "variable";
  readonly lexeme: IdentifierLexeme | OperatorLexeme; // can be "+=" or "-=" operators in a variable assignment
  readonly variable: Variable;
}

const makeVariableValue = (
  lexeme: IdentifierLexeme | OperatorLexeme,
  variable: Variable
): VariableValue => ({
  ...makeExpression(),
  expressionType: "variable",
  lexeme,
  variable,
});

export default makeVariableValue;
