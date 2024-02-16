import type { OperatorLexeme } from "../../../lexer/lexeme.ts";
import type { Operator, Type } from "../../../lexer/types.ts";
import { makeExpression, type Expression, type ExpressionCommon } from "../expression.ts";
import { operatorType } from "../operators.ts";

export interface CompoundExpression extends ExpressionCommon {
  readonly expressionType: "compound";
  readonly lexeme: OperatorLexeme;
  readonly left: Expression | null; // left hand side optional (for unary operators 'not' and 'minus')
  readonly right: Expression;
  readonly operator: Operator;
  readonly type: Type;
}

const makeCompoundExpression = (
  lexeme: OperatorLexeme,
  left: Expression | null,
  right: Expression,
  operator: Operator
): CompoundExpression => ({
  ...makeExpression(),
  expressionType: "compound",
  lexeme,
  left,
  right,
  operator,
  type: operatorType[operator],
});

export default makeCompoundExpression;
