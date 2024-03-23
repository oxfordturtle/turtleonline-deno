import type { IdentifierLexeme, OperatorLexeme } from "../../../lexer/lexeme.ts";
import { makeExpression, type ExpressionCommon } from "../expression.ts";
import type { Variable } from "../variable.ts";

export interface VariableAddress extends ExpressionCommon {
  readonly expressionType: "variableAddress";
  readonly lexeme: IdentifierLexeme | OperatorLexeme;
  readonly variable: Variable;
}

const makeVariableAddress = (
  lexeme: IdentifierLexeme | OperatorLexeme,
  variable: Variable
): VariableAddress => ({
  ...makeExpression(),
  expressionType: "variableAddress",
  lexeme,
  variable,
});

export default makeVariableAddress;
