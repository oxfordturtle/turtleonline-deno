import type { Language } from "../constants/languages.ts";
import type { State } from "./state.ts";

export type File = {
  language: Language;
  example: string | null;
  name: string;
  code: string;
  backup: string;
  compiled: boolean;
  edited: boolean;
};

export const getFile = (state: State): File => state.files[state.currentFileIndex];

export const skeletons: Record<Language, string> = {
  BASIC: "var1% = 100\nCOLOUR(GREEN)\nBLOT(var1%)\nEND",
  C: "void main () {\n  int var1 = 100;\n  colour(green);\n  blot(var1);\n}",
  Java: "class ProgramName {\n  void main () {\n    int var1 = 100;\n    colour(green);\n    blot(var1);\n  }\n}",
  Pascal:
    "PROGRAM programName;\nVAR var1: integer;\nBEGIN\n  var1 := 100;\n  colour(green);\n  blot(var1)\nEND.",
  Python: "var1 = 100\ncolour(green)\nblot(var1)",
  TypeScript: "var var1 = 100;\ncolour(green);\nblot(var1);",
};

const makeFile = (language: Language): File => ({
  language,
  example: null,
  name: "",
  code: "",
  backup: "",
  compiled: false,
  edited: false,
});

export default makeFile;
