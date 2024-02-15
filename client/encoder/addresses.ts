import Routine from "../parser/definitions/routine.ts";
import type Program from "../parser/definitions/program.ts";
import type { Subroutine } from "../parser/definitions/subroutine.ts";
import type { SubVariable, Variable } from "../parser/definitions/variable.ts";

const baseGlobals = 12; // turtle, keybuffer, and 10 file handles
const baseOffset = 11; // baseGlobals - 1

export const turtleAddress = (program: Program): number => {
  const subroutinePointers = program.allSubroutines.some((x) => x.type === "function")
    ? program.allSubroutines.length + 1
    : program.allSubroutines.length;
  return subroutinePointers + baseGlobals;
};

export const resultAddress = (program: Program): number =>
  program.allSubroutines.length + baseGlobals;

export const subroutineAddress = (subroutine: Subroutine): number =>
  subroutine.index + baseOffset;

export const variableAddress = (variable: Variable | SubVariable): number => {
  if ("variable" in variable) {
    return lengthByteAddress(variable.variable)+ variable.index + 1;
  } else {
    const arrayIndex = variable.routine.variables.indexOf(variable);
    const routine = new Routine(variable.routine.language);
    routine.variables = variable.routine.variables.slice(0, arrayIndex);
    return variable.routine.__ === "program"
      ? turtleAddress(variable.routine) + variable.routine.turtleVariables.length + routine.memoryNeeded + 1
      : routine.memoryNeeded + 1;
  }
};

export const lengthByteAddress = (variable: Variable | SubVariable): number => {
  if ("variable" in variable) {
    const base = lengthByteAddress(variable.variable) + variable.variable.elementCount + 1;
    return base + (variable.length - 1) * variable.index; // length - 1 because we don't want to count the pointer here
  } else {
    return variableAddress(variable) + 1;
  }
};
