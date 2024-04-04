import PCode from "../../constants/pcodes.ts";
import {
  getDimensions,
  getVariable,
  getVariableExpression,
} from "../../parser/definitions/expression.ts";
import type { VariableIndex } from "../../parser/definitions/expressions/variableIndex.ts";
import type { VariableSlice } from "../../parser/definitions/expressions/variableSlice.ts";
import makeVariableValue, {
  type VariableValue,
} from "../../parser/definitions/expressions/variableValue.ts";
import type { Program } from "../../parser/definitions/routines/program.ts";
import {
  subroutineAddress,
  turtleAddress,
  variableAddress,
} from "../addresses.ts";
import encodeExpression from "../expression.ts";
import merge from "../merge.ts";
import type { Options } from "../options.ts";

const encodeVariableExpression = (
  expression: VariableIndex | VariableSlice | VariableValue,
  program: Program,
  options: Options
): number[][] => {
  // bottom out at variable values
  if (expression.expressionType === "variable") {
    return encodeVariableValue(expression, program, options);
  }

  // otherwise start by encoding the underlying expression (recursively)
  const pcode = encodeVariableExpression(expression.variableExpression, program, options);

  if (expression.expressionType === "variableIndex") {
    // indexed element of variable
    const indexExpression = encodeExpression(expression.indexExpression, program, options);
    merge(pcode, indexExpression);
    expression.variableExpression.expressionType === 
  } else {
    // string/array slice
  }

  return pcode;
};

export default encodeVariableExpression;

const encodeVariableValue = (
  expression: VariableValue,
  program: Program,
  _options: Options
): number[][] => {
  const pcode: number[][] = [];

  // predefined turtle property
  if (!expression.variable.isArray && expression.variable.turtle) {
    pcode.push([
      PCode.ldvg,
      turtleAddress(program) + expression.variable.turtle,
    ]);
  }

  // global variable
  else if (expression.variable.routine.__ === "Program") {
    pcode.push([PCode.ldvg, variableAddress(expression.variable)]);
  }

  // local reference variable (except arrays and strings)
  else if (
    expression.variable.isReferenceParameter &&
    !expression.variable.isArray &&
    expression.variable.type !== "string"
  ) {
    pcode.push([
      PCode.ldvr,
      subroutineAddress(expression.variable.routine),
      variableAddress(expression.variable),
    ]);
  }

  // local value variable (and arrays and strings passed by reference)
  else {
    pcode.push([
      PCode.ldvv,
      subroutineAddress(expression.variable.routine),
      variableAddress(expression.variable),
    ]);
  }

  // add peek code for pointer variables
  if (expression.variable.isPointer) {
    merge(pcode, [[PCode.lptr]]);
  }

  // return the pcode
  return pcode;
};
