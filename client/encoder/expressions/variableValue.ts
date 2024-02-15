import PCode from "../../constants/pcodes.ts";
import { VariableValue } from "../../parser/definitions/expression.ts";
import type Program from "../../parser/definitions/program.ts";
import { subroutineAddress, turtleAddress, variableAddress } from "../addresses.ts";
import expression from "../expression.ts";
import merge from "../merge.ts";
import type { Options } from "../options.ts";

export default (exp: VariableValue, program: Program, options: Options): number[][] => {
  const pcode: number[][] = [];

  // array element
  if (exp.variable.isArray && exp.indexes.length > 0) {
    const baseVariableExp = new VariableValue(exp.lexeme, exp.variable); // same variable, no indexes
    pcode.push(...expression(baseVariableExp, program, options));
    for (let i = 0; i < exp.indexes.length; i += 1) {
      const index = exp.indexes[i];
      const indexExp = expression(index, program, options);
      merge(pcode, indexExp);
      if (exp.variable.arrayDimensions[i] && exp.variable.arrayDimensions[i][0] !== 0) {
        // subtract the start index if not indexed from 0
        merge(pcode, [[PCode.ldin, exp.variable.arrayDimensions[i][0], PCode.subt]]);
      } else if (exp.variable.arrayDimensions[i] === undefined) {
        // this means the final index expression is to a character within an array of strings
        if (program.language === "Pascal") {
          // Pascal string indexes start from 1 instead of 0
          merge(pcode, [[PCode.decr]]);
        }
      }
      merge(pcode, [[PCode.swap, PCode.test, PCode.plus, PCode.incr, PCode.lptr]]);
    }
  }

  // character from string variable as array
  else if (exp.variable.type === "string" && exp.indexes.length > 0) {
    pcode.push(...expression(exp.indexes[0], program, options));
    if (program.language === "Pascal") {
      // Pascal string indexes start from 1 instead of 0
      merge(pcode, [[PCode.decr]]);
    }
    const baseVariableExp = new VariableValue(exp.lexeme, exp.variable); // same variable, no indexes
    merge(pcode, expression(baseVariableExp, program, options));
    merge(pcode, [[PCode.test, PCode.plus, PCode.incr, PCode.lptr]]);
    if (program.language === "Python" || program.language === "TypeScript") {
      // Python and TypeScript don't have character types, so we need to add
      // this here - it won't be picked up with a contextual type cast
      // (N.B. BASIC doesn't have a character type either, but BASIC doesn't
      // allow direct reference to characters within strings, so this
      // situation won't arise for BASIC)
      merge(pcode, [[PCode.ctos]]);
    }
  }

  // predefined turtle property
  else if (exp.variable.turtle) {
    pcode.push([PCode.ldvg, turtleAddress(program) + exp.variable.turtle]);
  }

  // global variable
  else if (exp.variable.routine.__ === "program") {
    pcode.push([PCode.ldvg, variableAddress(exp.variable)]);
  }

  // local reference variable (except arrays and strings)
  else if (
    exp.variable.isReferenceParameter &&
    !exp.variable.isArray &&
    exp.variable.type !== "string"
  ) {
    pcode.push([PCode.ldvr, subroutineAddress(exp.variable.routine), variableAddress(exp.variable)]);
  }

  // local value variable (and arrays and strings passed by reference)
  else {
    pcode.push([PCode.ldvv, subroutineAddress(exp.variable.routine), variableAddress(exp.variable)]);
  }

  // add peek code for pointer variables
  if (exp.variable.isPointer) {
    merge(pcode, [[PCode.lptr]]);
  }

  // return the pcode
  return pcode;
};
