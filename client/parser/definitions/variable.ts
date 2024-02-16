import type { Type } from "../../lexer/types.ts";
import type { Routine } from "./routine.ts";
import type { Subroutine } from "./routines/subroutine.ts";

export interface Variable {
  readonly __: "Variable";
  readonly name: string;
  readonly routine: Routine;
  readonly isGlobal: boolean;
  isParameter: boolean;
  isReferenceParameter: boolean;
  isPointer: boolean;
  type: Type;
  typeIsCertain: boolean;
  turtle?: number; // index of turtle variable (if this is one)
  stringLength: number;
  arrayDimensions: [number, number][]; // for array variables
  private?: Subroutine; // subroutine for private variables (BASIC only)
}

const makeVariable = (name: string, routine: Routine): Variable => ({
  __: "Variable",
  name: routine.language === "Pascal" ? name.toLowerCase() : name,
  routine,
  isGlobal: routine.__ === "Program",
  isParameter: false,
  isReferenceParameter: false,
  isPointer: false,
  type: "boolint",
  typeIsCertain: routine.language === "Python" ? false : true,
  stringLength: 32,
  arrayDimensions: [],
});

export default makeVariable;

export const isArray = (variable: Variable): boolean => variable.arrayDimensions.length > 0;

export const baseLength = (variable: Variable): number =>
  variable.type === "string"
    ? variable.stringLength + 3 // 3 = pointer + max length byte + actual length byte
    : 1;

export const elementCount = (variable: Variable): number =>
  isArray(variable) ? variable.arrayDimensions[0][1] - variable.arrayDimensions[0][0] + 1 : 0;

export const getLength = (variable: Variable): number => {
  // reference parameters and pointers (simply hold the address to the variable)
  if (variable.isReferenceParameter || variable.isPointer) {
    return 1;
  }

  // arrays
  if (isArray(variable)) {
    return getLength(getSubVariables(variable)[0]) * elementCount(variable) + 2; // +2 for pointer and length byte
  }

  // all other variables
  return baseLength(variable);
};

export const getSubVariables = (variable: Variable): SubVariable[] => {
  const subVariables: SubVariable[] = [];
  if (isArray(variable)) {
    for (let i = 0; i < elementCount(variable); i += 1) {
      subVariables.push(makeSubVariable(variable, i));
    }
  }
  return subVariables;
};

export interface SubVariable extends Variable {
  readonly variable: Variable | SubVariable;
  readonly index: number;
}

export const makeSubVariable = (variable: Variable | SubVariable, index: number): SubVariable => ({
  ...makeVariable(`${variable.name}_${index.toString(10)}`, variable.routine),
  isGlobal: variable.isGlobal,
  isParameter: variable.isParameter,
  isReferenceParameter: variable.isReferenceParameter,
  isPointer: variable.isPointer,
  type: variable.type,
  typeIsCertain: variable.typeIsCertain,
  turtle: variable.turtle,
  stringLength: variable.stringLength,
  arrayDimensions: variable.arrayDimensions.slice(1),
  private: variable.private,
  variable,
  index,
});
