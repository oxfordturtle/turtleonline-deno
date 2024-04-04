import {
  getDimensions,
  type Expression,
  getVariable,
} from "../parser/definitions/expression.ts";
import type { VariableValue } from "../parser/definitions/expressions/variableValue.ts";
import type { Program } from "../parser/definitions/routines/program.ts";
import type { Options } from "./options.ts";
import encodeArrayLiteralValue from "./expressions/arrayLiteralValue.ts";
import encodeCastExpression from "./expressions/castExpression.ts";
import encodeColourValue from "./expressions/colourValue.ts";
import encodeCompoundExpression from "./expressions/compoundExpression.ts";
import encodeConstantIndex from "./expressions/constantIndex.ts";
import encodeConstantValue from "./expressions/constantValue.ts";
import encodeFunctionCall from "./expressions/functionCall.ts";
import encodeInputValue from "./expressions/inputValue.ts";
import encodeIntegerValue from "./expressions/integerValue.ts";
import encodeQueryValue from "./expressions/queryValue.ts";
import encodeStringValue from "./expressions/stringValue.ts";
import encodeVariableAddress from "./expressions/variableAddress.ts";
import encodeVariableExpression from "./expressions/variableExpression.ts";
import { VariableIndex } from "../parser/definitions/expressions/variableIndex.ts";
import { VariableSlice } from "../parser/definitions/expressions/variableSlice.ts";
import { getArrayDepth } from "../parser/definitions/variable.ts";

const encodeExpression = (
  expression: Expression,
  program: Program,
  options: Options,
  reference = false
): number[][] => {
  switch (expression.expressionType) {
    case "integer":
      return [encodeIntegerValue(expression, program, options)];
    case "string":
      return [encodeStringValue(expression, program, options)];
    case "arrayLiteral":
      return [encodeArrayLiteralValue(expression, program, options)];
    case "input":
      return [encodeInputValue(expression, program, options)];
    case "query":
      return [encodeQueryValue(expression, program, options)];
    case "colour":
      return [encodeColourValue(expression, program, options)];
    case "constant":
      return encodeConstantValue(expression, program, options);
    case "constantIndex":
      return encodeConstantIndex(expression, program, options);
    case "variableAddress":
      return encodeVariableAddress(expression, program, options);
    case "variable":
    case "variableIndex":
      return reference && !referenceVariableAddressIsValue(expression)
        ? encodeVariableAddress(expression, program, options)
        : encodeVariableExpression(expression, program, options);
    case "variableSlice":
      return encodeVariableExpression(expression, program, options);
    case "namedArgument":
      return encodeExpression(
        expression.expression,
        program,
        options,
        reference
      );
    case "function":
      return encodeFunctionCall(expression, program, options);
    case "compound":
      return encodeCompoundExpression(expression, program, options);
    case "cast":
      return encodeCastExpression(expression, program, options);
    default:
      return expression satisfies never;
  }
};

export default encodeExpression;

const referenceVariableAddressIsValue = (
  expression: VariableIndex | VariableSlice | VariableValue
): boolean => {
  // for arrays and strings, the address is the value
  if (expression.expressionType === "variable") {
    return (
      expression.variable.isArray || expression.variable.type === "string"
    );
  }

  // for indexed variables / variable slices, check that we haven't gone all the way down to the bottom
  const variable = getVariable(expression);
  const dimensions = getDimensions(expression);
  return (
    (variable.isArray && dimensions < getArrayDepth(variable)) ||
    (!variable.isArray && variable.type === "string" && dimensions === 0)
  );
};
