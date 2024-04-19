import type { UsageCategory } from "../analyser/usageCategory.ts";
import type { Language } from "../constants/languages.ts";
import { createState } from "../elementary/index.ts";
import type { Lexeme } from "../lexer/lexeme.ts";
import makeProgram from "../parser/definitions/routines/program.ts";
import type { Token } from "../tokenizer/token.ts";
import { Mode } from "../constants/modes.ts";
import makeFile, { type File } from "./file.ts";

export const initialState = {
  savedSettingsHaveBeenLoaded: false,
  // core system state
  language: "Python" as Language,
  mode: "normal" as Mode,
  editorFontFamily: "Courier" as "Courier" | "Consolas" | "Lucida Sans Typewriter" | "Monospace",
  editorFontSize: 13,
  outputFontFamily: "Courier" as "Courier" | "Consolas" | "Lucida Sans Typewriter" | "Monospace",
  outputFontSize: 13,
  includeCommentsInExamples: true,
  loadCorrespondingExample: true,
  pcodeDisplayType: "assembler" as "assembler" | "machine",
  pcodeDisplayRadix: "decimal" as "decimal" | "hexadecimal",
  autoCompileOnLoad: false,
  autoRunOnLoad: false,
  autoFormatOnLoad: false,
  alwaysSaveSettings: false,
  // file memory
  files: [makeFile("Python")],
  currentFileIndex: 0,
  tokens: [] as Token[],
  lexemes: [] as Lexeme[],
  usage: [] as UsageCategory[],
  program: makeProgram("Python", ""),
  pcode: [] as number[][],
  // machine options
  showCanvasOnRun: true,
  showOutputOnWrite: false,
  showMemoryOnDump: true,
  drawCountMax: 4,
  codeCountMax: 100000,
  smallSize: 60,
  stackSize: 50000,
  traceOnRun: false,
  activateHCLR: true,
  preventStackCollision: true,
  rangeCheckArrays: true,
  // compiler options
  canvasStartSize: 1000,
  setupDefaultKeyBuffer: true,
  turtleAttributesAsGlobals: true,
  initialiseLocals: true,
  allowCSTR: true,
  separateReturnStack: true,
  separateMemoryControlStack: true,
  separateSubroutineRegisterStack: true,
};

const sessionKeys = Object.keys(initialState) as (keyof typeof initialState)[];

const state = createState(initialState, { sessionKeys });

export type State = typeof state;

export const file = (): File => state.files[state.currentFileIndex];

export const machineOptions = () => ({
  showCanvasOnRun: state.showCanvasOnRun,
  showOutputOnWrite: state.showOutputOnWrite,
  showMemoryOnDump: state.showMemoryOnDump,
  drawCountMax: state.drawCountMax,
  codeCountMax: state.codeCountMax,
  smallSize: state.smallSize,
  stackSize: state.stackSize,
  traceOnRun: state.traceOnRun,
  activateHCLR: state.activateHCLR,
  preventStackCollision: state.preventStackCollision,
  rangeCheckArrays: state.rangeCheckArrays,
});

export const compilerOptions = () => ({
  canvasStartSize: state.canvasStartSize,
  setupDefaultKeyBuffer: state.setupDefaultKeyBuffer,
  turtleAttributesAsGlobals: state.turtleAttributesAsGlobals,
  initialiseLocals: state.initialiseLocals,
  allowCSTR: state.allowCSTR,
  separateReturnStack: state.separateReturnStack,
  separateMemoryControlStack: state.separateMemoryControlStack,
  separateSubroutineRegisterStack: state.separateSubroutineRegisterStack,
});

export default state;
