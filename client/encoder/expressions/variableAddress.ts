import PCode from "../../constants/pcodes.ts";
import type { VariableAddress } from "../../parser/definitions/expression.ts";
import { VariableValue } from "../../parser/definitions/expression.ts";
import type Program from "../../parser/definitions/program.ts";
import expression from "../expression.ts";
import merge from "../merge.ts";
import type { Options } from "../options.ts";

export default (
  exp: VariableAddress | VariableValue,
  program: Program,
  options: Options
): number[][] => {
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
        // substract the start index if not indexed from 0
        merge(pcode, [[PCode.ldin, exp.variable.arrayDimensions[i][0], PCode.subt]]);
      } else if (exp.variable.arrayDimensions[i] === undefined) {
        // this means the final index expression is to a character within an array of strings
        if (program.language === "Pascal") {
          merge(pcode, [[PCode.decr]]); // Pascal strings are indexed from 1 instead of zero
        }
      }
      merge(pcode, [[PCode.swap, PCode.test, PCode.plus, PCode.incr]]);
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
    merge(pcode, [[PCode.test, PCode.plus, PCode.incr]]);
  }

  // predefined turtle property
  else if (exp.variable.turtle) {
    pcode.push([PCode.ldag, program.turtleAddress + exp.variable.turtle]);
  }

  // global variable
  else if (exp.variable.routine.__ === "program") {
    pcode.push([PCode.ldag, exp.variable.address]);
  }

  // local variable
  else {
    pcode.push([PCode.ldav, exp.variable.routine.address, exp.variable.address]);
  }

  // return the pcode
  return pcode;
};
