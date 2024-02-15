import type { Type } from "../../lexer/types.ts";
import type Program from "./program.ts";
import type { Subroutine } from "./subroutine.ts";

/** variable */
export class Variable {
  readonly __ = "variable";
  readonly name: string;
  readonly routine: Program | Subroutine;
  isParameter = false;
  isReferenceParameter = false;
  isPointer = false;
  type: Type = "boolint";
  typeIsCertain: boolean;
  turtle?: number; // index of turtle variable (if this is one)
  stringLength = 32;
  arrayDimensions: [number, number][] = []; // for array variables
  private?: Subroutine; // subroutine for private variables (BASIC only)

  /** constructor */
  constructor(name: string, routine: Program | Subroutine) {
    this.name = routine.language === "Pascal" ? name.toLowerCase() : name;
    this.routine = routine;
    // TODO: make this false for TypeScript as well, once type inference works there
    this.typeIsCertain = routine.language === "Python" ? false : true;
  }

  /** whether the variable is an array */
  get isArray(): boolean {
    return this.arrayDimensions.length > 0;
  }

  /** whether the variable is a global */
  get isGlobal(): boolean {
    return this.routine.__ === "program";
  }

  /** length of each of the variable's ultimate elements */
  get baseLength(): number {
    return this.type === "string"
      ? this.stringLength + 3 // 3 = pointer + max length byte + actual length byte
      : 1;
  }

  /** length of each of the variable's immediate elements */
  get elementLength(): number {
    return this.arrayDimensions.length > 1 ? 1 : this.baseLength;
  }

  /** internal length of an array variable (i.e. how many elements it contains) */
  get elementCount(): number {
    return this.isArray ? this.arrayDimensions[0][1] - this.arrayDimensions[0][0] + 1 : 0;
  }

  /** full length of the variable (i.e. how many "bytes" of memory it requires) */
  get length(): number {
    // reference parameters and pointers (simply hold the address to the varaiable)
    if (this.isReferenceParameter || this.isPointer) {
      return 1;
    }

    // arrays
    if (this.isArray) {
      return this.subVariables[0].length * this.elementCount + 2; // +2 for pointer and length byte
      /*let length = this.baseLength
      for (const dimensions of this.arrayDimensions) {
        const size = dimensions[1] - dimensions[0] + 1
        length = (length * size) + 2 // 2 = pointer + array length byte
      }
      return length*/
    }

    // all other variables
    return this.baseLength;
  }

  /** sub variables (for arrays) */
  get subVariables(): SubVariable[] {
    const subVariables: SubVariable[] = [];
    if (this.isArray) {
      for (let i = 0; i < this.elementCount; i += 1) {
        const subVariable = new SubVariable(this, i);
        subVariables.push(subVariable);
      }
    }
    return subVariables;
  }
}

/** subvariable (element of array variable) */
export class SubVariable extends Variable {
  readonly variable: Variable | SubVariable;
  readonly index: number;

  /** constructor */
  constructor(variable: Variable | SubVariable, index: number) {
    super(`${variable.name}_${index.toString(10)}`, variable.routine);
    this.variable = variable;
    this.index = index;
    this.type = variable.type;
    this.isParameter = variable.isParameter;
    this.isReferenceParameter = variable.isReferenceParameter;
    this.stringLength = variable.stringLength;
    this.arrayDimensions = variable.arrayDimensions.slice(1);
    this.private = variable.private;
  }
}
