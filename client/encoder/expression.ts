import type { Expression } from "../parser/definitions/expression.ts";
import type { VariableValue } from "../parser/definitions/expression.ts";
import type Program from "../parser/definitions/program.ts";
import type { Options } from "./options.ts";
import castExpression from "./expressions/castExpression.ts";
import colourValue from "./expressions/colourValue.ts";
import compoundExpression from "./expressions/compoundExpression.ts";
import constantValue from "./expressions/constantValue.ts";
import functionValue from "./expressions/functionValue.ts";
import inputValue from "./expressions/inputValue.ts";
import literalIntegerValue from "./expressions/literalIntegerValue.ts";
import literalStringValue from "./expressions/literalStringValue.ts";
import variableAddress from "./expressions/variableAddress.ts";
import variableValue from "./expressions/variableValue.ts";

export default (
  exp: Expression,
  program: Program,
  options: Options,
  reference = false
): number[][] => {
  switch (exp.expressionType) {
    case "integer":
      return [literalIntegerValue(exp, program, options)];
    case "string":
      return [literalStringValue(exp, program, options)];
    case "input":
      return [inputValue(exp, program, options)];
    case "colour":
      return [colourValue(exp, program, options)];
    case "constant":
      return constantValue(exp, program, options);
    case "address":
      return variableAddress(exp, program, options);
    case "variable":
      return reference && !referenceVariableAddressIsValue(exp)
        ? variableAddress(exp, program, options)
        : variableValue(exp, program, options);
    case "function":
      return functionValue(exp, program, options);
    case "compound":
      return compoundExpression(exp, program, options);
    case "cast":
      return castExpression(exp, program, options);
  }
};

const referenceVariableAddressIsValue = (exp: VariableValue): boolean =>
  (exp.variable.isArray && exp.indexes.length < exp.variable.arrayDimensions.length) ||
  (exp.variable.type === "string" && exp.indexes.length === 0);
