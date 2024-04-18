import type { UsageCategory } from "../analyser/usageCategory.ts";
import type { Language } from "../constants/languages.ts";
import { createState } from "../elementary/index.ts";
import type { Lexeme } from "../lexer/lexeme.ts";
import makeProgram from "../parser/definitions/routines/program.ts";
import type { Token } from "../tokenizer/token.ts";
import systemState from "./systemState.ts";

const initialState = {
  files: [] as File[],
  currentFileIndex: 0,
  tokens: [] as Token[],
  lexemes: [] as Lexeme[],
  usage: [] as UsageCategory[],
  program: makeProgram(systemState.language, ""),
  pcode: [] as number[][],
};

export const makeFile = (language: Language): File => ({
  language,
  example: null,
  name: "",
  code: "",
  backup: "",
  compiled: false,
  edited: false,
});

export type File = {
  language: Language;
  example: string | null;
  name: string;
  code: string;
  backup: string;
  compiled: boolean;
  edited: boolean;
};

const sessionKeys = Object.keys(initialState) as (keyof typeof initialState)[];

const fileMemory = createState(initialState, { sessionKeys });

export default fileMemory;
