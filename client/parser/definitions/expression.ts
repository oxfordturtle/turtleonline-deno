import type { Type } from "../../lexer/types.ts";
import type { CastExpression } from "./expressions/castExpression.ts";
import type { ColourValue } from "./expressions/colourValue.ts";
import type { CompoundExpression } from "./expressions/compoundExpression.ts";
import type { ConstantValue } from "./expressions/constantValue.ts";
import type { FunctionCall } from "./expressions/functionCall.ts";
import type { InputValue } from "./expressions/inputValue.ts";
import type { IntegerValue } from "./expressions/integerValue.ts";
import type { NamedArgument } from "./expressions/namedArgument.ts";
import type { QueryValue } from "./expressions/queryValue.ts";
import type { StringValue } from "./expressions/stringValue.ts";
import type { VariableAddress } from "./expressions/variableAddress.ts";
import type { VariableValue } from "./expressions/variableValue.ts";

export type Expression =
  | IntegerValue
  | StringValue
  | InputValue
  | QueryValue
  | ColourValue
  | ConstantValue
  | VariableAddress
  | VariableValue
  | NamedArgument
  | FunctionCall
  | CompoundExpression
  | CastExpression;

export interface ExpressionCommon {
  readonly __: "expression";
}

export const makeExpression = (): ExpressionCommon => ({
  __: "expression",
});

export const getType = (expression: Expression): Type => {
  const languagesWithCharacterType = ["C", "Java", "Pascal"];
  switch (expression.expressionType) {
    case "constant":
      // type is not known in advance, as it depends on expression.indexes.length
      if (languagesWithCharacterType.includes(expression.constant.language)) {
        return expression.constant.type === "string" && expression.indexes.length > 0
          ? "character"
          : expression.constant.type;
      }
      return expression.constant.type;

    case "variable":
      // type is not known in advance, as it depends on expression.indexes.length
      return languagesWithCharacterType.includes(expression.variable.routine.language)
        ? expression.variable.type === "string" &&
          expression.indexes.length > expression.variable.arrayDimensions.length
          ? "character"
          : expression.variable.type
        : expression.variable.type;

    case "namedArgument":
      return getType(expression.expression);

    default:
      return expression.type;
  }
};
