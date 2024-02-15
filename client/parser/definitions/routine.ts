import type { Language } from "../../constants/languages.ts";
import type { KeywordLexeme, TypeLexeme } from "../../lexer/lexeme.ts";
import type { Type } from "../../lexer/types.ts";
import type { Constant } from "./constant.ts";
import type { Statement } from "./statement.ts";
import { variable as _variable, getLength, type Variable } from "./variable.ts";

export type Routine = Program | Subroutine;

interface RoutineCommon {
  readonly language: Language;
  name: string;
  index: number;
  start: number;
  end: number;
  constants: Constant[];
  variables: Variable[];
  subroutines: Subroutine[];
  statements: Statement[];
}

// main program
export interface Program extends RoutineCommon {
  readonly __: "program";
}

export const program = (language: Language, name = "!"): Program => ({
  __: "program",
  language,
  name: language === "Pascal" ? name.toLowerCase() : name,
  index: 0,
  start: 0,
  end: 0,
  constants: [],
  variables: [],
  subroutines: [],
  statements: [],
});

// program subroutine
export interface Subroutine extends RoutineCommon {
  readonly __: "subroutine";
  readonly lexeme: KeywordLexeme | TypeLexeme; // the routine's initial (defining) lexeme
  readonly parent: Program | Subroutine;
  readonly level: -1; // needed for the usage data table
  hasReturnStatement: boolean; // for C, Java, Python, and TypeScript
  typeIsCertain: boolean;
  globals: string[]; // for Python
  nonlocals: string[]; // for Python
  indent: number; // for Python
  startLine: number; // first line in PCode (fixed later by the encoder module)
}

export const subroutine = (
  lexeme: KeywordLexeme | TypeLexeme,
  parent: Program | Subroutine,
  name = ""
): Subroutine => ({
  __: "subroutine",
  language: parent.language,
  name,
  index: 0,
  start: 0,
  end: 0,
  constants: [],
  variables: [],
  subroutines: [],
  statements: [],
  lexeme,
  parent,
  level: -1,
  hasReturnStatement: false,
  typeIsCertain: parent.language === "Python" ? false : true,
  globals: [],
  nonlocals: [],
  indent: 0,
  startLine: 0,
});

// useful functions
export const getMemoryNeeded = (routine: Routine): number =>
  routine.variables.reduce((x, y) => x + getLength(y), 0);

export const getAllSubroutines = (routine: Routine): Subroutine[] => {
  const allSubroutines: Subroutine[] = [];
  for (const subroutine of routine.subroutines) {
    allSubroutines.push(...getAllSubroutines(subroutine));
    allSubroutines.push(subroutine);
  }
  return allSubroutines;
};

export const getTurtleVariables = (program: Program): Variable[] => [
  makeTurtleVariable("x", program),
  makeTurtleVariable("y", program),
  makeTurtleVariable("d", program),
  makeTurtleVariable("a", program),
  makeTurtleVariable("t", program),
  makeTurtleVariable("c", program),
];

const makeTurtleVariable = (
  name: "x" | "y" | "d" | "a" | "t" | "c",
  program: Program
): Variable => {
  const fullName = program.language === "BASIC" ? `turt${name}%` : `turt${name}`;
  const variable = _variable(fullName, program);
  variable.type = "integer";
  variable.typeIsCertain = true;
  variable.turtle = ["x", "y", "d", "a", "t", "c"].indexOf(name) + 1;
  return variable;
};

export const getParameters = (subroutine: Subroutine): Variable[] =>
  subroutine.variables.filter((x) => x.isParameter);

export const getProgram = (subroutine: Subroutine): Program =>
  subroutine.parent.__ === "program" ? subroutine.parent : getProgram(subroutine.parent);

export const getResultVariable = (subroutine: Subroutine): Variable | undefined =>
  subroutine.variables.find((x) =>
    subroutine.language === "Pascal" ? x.name === "result" : x.name === "!result"
  );

export const getResultType = (subroutine: Subroutine): Type | null => {
  const resultVariable = getResultVariable(subroutine);
  return resultVariable ? resultVariable.type : null;
};

export type SubroutineType = "function" | "procedure";

export const getSubroutineType = (subroutine: Subroutine): SubroutineType =>
  getResultVariable(subroutine) ? "function" : "procedure";
