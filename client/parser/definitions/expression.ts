import type { Type } from "../../lexer/types.ts";
import { getArrayDepth, getBaseVariable, type Variable } from "./variable.ts";
import type { ArrayLiteralValue } from "./expressions/arrayLiteralValue.ts";
import type { CastExpression } from "./expressions/castExpression.ts";
import type { ColourValue } from "./expressions/colourValue.ts";
import type { CompoundExpression } from "./expressions/compoundExpression.ts";
import type { ConstantValue } from "./expressions/constantValue.ts";
import type { ConstantIndex } from "./expressions/constantIndex.ts";
import type { FunctionCall } from "./expressions/functionCall.ts";
import type { InputValue } from "./expressions/inputValue.ts";
import type { IntegerValue } from "./expressions/integerValue.ts";
import type { NamedArgument } from "./expressions/namedArgument.ts";
import type { QueryValue } from "./expressions/queryValue.ts";
import type { StringValue } from "./expressions/stringValue.ts";
import type { VariableAddress } from "./expressions/variableAddress.ts";
import type { VariableValue } from "./expressions/variableValue.ts";
import type { VariableIndex } from "./expressions/variableIndex.ts";
import type { VariableSlice } from "./expressions/variableSlice.ts";

export type Expression =
  | IntegerValue
  | StringValue
  | ArrayLiteralValue
  | InputValue
  | QueryValue
  | ColourValue
  | ConstantValue
  | ConstantIndex
  | VariableAddress
  | VariableValue
  | VariableIndex
  | VariableSlice
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

export const getVariableExpression = (
  expression: VariableValue | VariableIndex | VariableSlice
): VariableValue => {
  switch (expression.expressionType) {
    case "variable":
      return expression;
    default:
      return getVariableExpression(expression.variableExpression);
  }
};

export const getVariable = (
  expression: VariableValue | VariableIndex | VariableSlice
): Variable => getVariableExpression(expression).variable;

export const getDimensions = (
  expression: VariableValue | VariableIndex | VariableSlice
): number => {
  switch (expression.expressionType) {
    case "variable":
      return expression.variable.isArray ? getArrayDepth(expression.variable) : 0;
    case "variableIndex":
      return getDimensions(expression.variableExpression) - 1;
    case "variableSlice":
      return getDimensions(expression.variableExpression);
  }
};

const languagesWithCharacterType = ["C", "Java", "Pascal"];

export const getType = (expression: Expression): Type => {
  switch (expression.expressionType) {
    case "constant":
      return expression.constant.type;
    case "constantIndex":
      if (
        languagesWithCharacterType.includes(
          expression.constantExpression.constant.language
        )
      ) {
        return expression.constantExpression.constant.type === "string"
          ? "character"
          : expression.constantExpression.constant.type;
      }
      return expression.constantExpression.constant.type;
    case "variable":
      return getBaseVariable(expression.variable).type;
    case "variableAddress":
      return "integer";
    case "variableSlice":
      return getType(expression.variableExpression);
    case "variableIndex": {
      const variable = getVariable(expression);
      const baseVariable = getBaseVariable(variable);
      const variableDimensions = getDimensions(expression);
      return languagesWithCharacterType.includes(variable.routine.language)
        ? baseVariable.type === "string" && variableDimensions === 0
          ? "character"
          : baseVariable.type
        : baseVariable.type;
    }
    case "namedArgument":
      return getType(expression.expression);
    default:
      return expression.type;
  }
};
