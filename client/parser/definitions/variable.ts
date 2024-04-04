import type { Type } from "../../lexer/types.ts";
import type { Routine } from "./routine.ts";
import type { Subroutine } from "./routines/subroutine.ts";

export type Variable = BaseVariable | ArrayVariable;

export interface VariableCommon {
  readonly __: "Variable";
  readonly name: string;
  readonly routine: Routine;
  readonly isGlobal: boolean;
  private?: Subroutine; // subroutine for private variables (BASIC only)
  isParameter: boolean;
  isReferenceParameter: boolean;
  isPointer: boolean;
}

export interface BaseVariable extends VariableCommon {
  readonly isArray: false;
  type: Type;
  typeIsCertain: boolean;
  turtle?: number; // index of turtle variable (if this is one)
  stringLength: number;
}

export interface ArrayVariable extends VariableCommon {
  readonly isArray: true;
  readonly subVariable: Variable;
  readonly startIndex: number;
  readonly endIndex: number;
}

const makeVariable = (name: string, routine: Routine): Variable => ({
  __: "Variable",
  name: routine.language === "Pascal" ? name.toLowerCase() : name,
  routine,
  isGlobal: routine.__ === "Program",
  isParameter: false,
  isReferenceParameter: false,
  isPointer: false,
  isArray: false,
  type: "boolint",
  typeIsCertain: routine.language === "Python" ? false : true,
  stringLength: 64,
});

export default makeVariable;

export const makeArrayVariable = (subVariable: Variable, startIndex: number, endIndex: number): ArrayVariable => ({
  __: "Variable",
  name: subVariable.name,
  routine: subVariable.routine,
  isGlobal: subVariable.isGlobal,
  private: subVariable.private,
  isParameter: subVariable.isParameter,
  isReferenceParameter: subVariable.isReferenceParameter,
  isPointer: subVariable.isPointer,
  isArray: true,
  subVariable,
  startIndex,
  endIndex,
});

export const getBaseVariable = (variable: Variable): BaseVariable =>
  variable.isArray ? getBaseVariable(variable.subVariable) : variable;

export const getBaseLength = (variable: Variable): number => {
  const baseVariable = getBaseVariable(variable);
  return baseVariable.type === "string"
    ? baseVariable.stringLength + 3 // 3 = pointer + max length byte + actual length byte
    : 1;
}

export const getElementCount = (variable: Variable): number =>
  variable.isArray ? variable.endIndex - variable.startIndex + 1 : 0;

export const getLength = (variable: Variable): number => {
  // arrays
  if (variable.isArray) {
    return getLength(variable.subVariable) * getElementCount(variable) + 2; // +2 for pointer and length byte
  }

  // reference parameters and pointers (simply hold the address to the variable)
  if (variable.isReferenceParameter || variable.isPointer) {
    return 1;
  }

  // all other variables
  return getBaseLength(variable);
};

export const getArrayDepth = (variable: ArrayVariable): number =>
  variable.subVariable.isArray ? 1 + getArrayDepth(variable.subVariable) : 1;
