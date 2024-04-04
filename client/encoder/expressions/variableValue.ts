import PCode from "../../constants/pcodes.ts";
import type { VariableValue } from "../../parser/definitions/expressions/variableValue.ts";
import type { Program } from "../../parser/definitions/routines/program.ts";
import { isArray } from "../../parser/definitions/variable.ts";
import { subroutineAddress, turtleAddress, variableAddress } from "../addresses.ts";
import merge from "../merge.ts";
import type { Options } from "../options.ts";

export default (expression: VariableValue, program: Program, _options: Options): number[][] => {
  const pcode: number[][] = [];

  // predefined turtle property
  if (expression.variable.turtle) {
    pcode.push([PCode.ldvg, turtleAddress(program) + expression.variable.turtle]);
  }

  // global variable
  else if (expression.variable.routine.__ === "Program") {
    pcode.push([PCode.ldvg, variableAddress(expression.variable)]);
  }

  // local reference variable (except arrays and strings)
  else if (
    expression.variable.isReferenceParameter &&
    !isArray(expression.variable) &&
    expression.variable.type !== "string"
  ) {
    pcode.push([PCode.ldvr, subroutineAddress(expression.variable.routine), variableAddress(expression.variable)]);
  }

  // local value variable (and arrays and strings passed by reference)
  else {
    pcode.push([PCode.ldvv, subroutineAddress(expression.variable.routine), variableAddress(expression.variable)]);
  }

  // add peek code for pointer variables
  if (expression.variable.isPointer) {
    merge(pcode, [[PCode.lptr]]);
  }

  // return the pcode
  return pcode;
};
