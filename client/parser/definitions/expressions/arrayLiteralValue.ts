import type { DelimiterLexeme } from "../../../lexer/lexeme.ts";
import type { Type } from "../../../lexer/types.ts";
import { makeExpression, type Expression, type ExpressionCommon } from "../expression.ts";

export interface ArrayLiteralValue extends ExpressionCommon {
  readonly expressionType: "arrayLiteral";
  readonly lexeme: DelimiterLexeme;
  readonly type: Type;
  readonly values: Expression[];
}

const makeArrayLiteralValue = (lexeme: DelimiterLexeme, type: Type): ArrayLiteralValue => ({
  ...makeExpression(),
  expressionType: "arrayLiteral",
  lexeme,
  type,
  values: [],
});

export default makeArrayLiteralValue;
