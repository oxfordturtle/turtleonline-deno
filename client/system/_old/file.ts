import { extension, type Language } from "../constants/languages.ts";

/** turtle system file */
export class File {
  language: Language;
  example: string | null;
  name: string;
  code: string;
  backup: string;
  compiled: boolean;
  edited: boolean;

  /** constructor */
  constructor(language: Language, example: string | null = null) {
    this.language = language;
    this.example = example;
    this.name = "";
    this.code = "";
    this.backup = "";
    this.compiled = false;
    this.edited = false;
  }

  /** file extension */
  get extension(): string {
    return extension[this.language];
  }

  /** filename */
  get filename(): string {
    return `${this.name || "filename"}.${this.extension}`;
  }
}

/** skeleton programs */
export const skeletons: Record<Language, string> = {
  BASIC: "var1% = 100\nCOLOUR(GREEN)\nBLOT(var1%)\nEND",
  C: "void main () {\n  int var1 = 100;\n  colour(green);\n  blot(var1);\n}",
  Java: "class ProgramName {\n  void main () {\n    int var1 = 100;\n    colour(green);\n    blot(var1);\n  }\n}",
  Pascal:
    "PROGRAM programName;\nVAR var1: integer;\nBEGIN\n  var1 := 100;\n  colour(green);\n  blot(var1)\nEND.",
  Python: "var1 = 100\ncolour(green)\nblot(var1)",
  TypeScript: "var var1 = 100;\ncolour(green);\nblot(var1);",
};
