import PCode from "../../constants/pcodes.ts";
import {
  getDimensions,
  getVariable,
  getVariableExpression,
} from "../../parser/definitions/expression.ts";
import type { VariableIndex } from "../../parser/definitions/expressions/variableIndex.ts";
import makeVariableValue, {
  type VariableValue,
} from "../../parser/definitions/expressions/variableValue.ts";
import type { Program } from "../../parser/definitions/routines/program.ts";
import { isArray } from "../../parser/definitions/variable.ts";
import encodeExpression from "../expression.ts";
import merge from "../merge.ts";
import type { Options } from "../options.ts";

export default (
  expression: VariableIndex,
  program: Program,
  options: Options
): number[][] => {
  const variable = getVariable(expression);

  // encode the base expression
  const pcode = isArray(variable)
    ? encodeArrayIndex(expression, program, options)
    : encodeStringIndex(expression, program, options);

  // add peek code for pointer variables
  if (variable.isPointer) {
    merge(pcode, [[PCode.lptr]]);
  }

  // return the pcode
  return pcode;
};

const encodeArrayIndex = (
  expression: VariableIndex,
  program: Program,
  options: Options
): number[][] => {
  expression.variableExpression

  const baseVariableExp = makeVariableValue(
    expression.lexeme,
    expression.variable
  ); // same variable, no indexes
  pcode.push(...encodeExpression(baseVariableExp, program, options));
  for (let i = 0; i < expression.indexes.length; i += 1) {
    const index = expression.indexes[i];
    const indexExp = encodeExpression(index, program, options);
    merge(pcode, indexExp);
    if (
      expression.variable.arrayDimensions[i] &&
      expression.variable.arrayDimensions[i][0] !== 0
    ) {
      // subtract the start index if not indexed from 0
      merge(pcode, [
        [PCode.ldin, expression.variable.arrayDimensions[i][0], PCode.subt],
      ]);
    } else if (expression.variable.arrayDimensions[i] === undefined) {
      // this means the final index expression is to a character within an array of strings
      if (program.language === "Pascal") {
        // Pascal string indexes start from 1 instead of 0
        merge(pcode, [[PCode.decr]]);
      }
    }
    merge(pcode, [
      [PCode.swap, PCode.test, PCode.plus, PCode.incr, PCode.lptr],
    ]);
  }
};

const encodeStringIndex = (
  expression: VariableIndex,
  program: Program,
  options: Options
): number[][] => {
  const variableExpression = getVariableExpression(expression);
  const pcode: number[][] = [];
  pcode.push(...encodeExpression(expression.indexExpression, program, options));
  if (program.language === "Pascal") {
    // Pascal string indexes start from 1 instead of 0
    merge(pcode, [[PCode.decr]]);
  }
  merge(pcode, encodeExpression(variableExpression, program, options));
  merge(pcode, [[PCode.test, PCode.plus, PCode.incr, PCode.lptr]]);
  if (program.language === "Python" || program.language === "TypeScript") {
    // Python and TypeScript don't have character types, so we need to add
    // this here - it won't be picked up with a contextual type cast
    // (N.B. BASIC doesn't have a character type either, but BASIC doesn't
    // allow direct reference to characters within strings, so this
    // situation won't arise for BASIC)
    merge(pcode, [[PCode.ctos]]);
  }
  return pcode;
};
