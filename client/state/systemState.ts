import type { Language } from "../constants/languages.ts";
import { Mode } from "../constants/modes.ts";
import { createState } from "../elementary/index.ts";

const initialState = {
  savedSettingsHaveBeenLoaded: false,
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
};

const sessionKeys = Object.keys(initialState) as (keyof typeof initialState)[];

const systemState = createState(initialState, { sessionKeys });

export default systemState;
