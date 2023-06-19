// type imports
import type { Language } from "../constants/languages.ts";
import type { Lexeme } from "../lexer/lexeme.ts";
import type Program from "./definitions/program.ts";

// submodule imports
import basicParser from "./basic/parser.ts";
import cParser from "./c/parser.ts";
import javaParser from "./java/parser.ts";
import pascalParser from "./pascal/parser.ts";
import pythonParser from "./python/parser.ts";
import typeScriptParser from "./typescript/parser.ts";
import Lexemes from "./definitions/lexemes.ts";

// other module imports
import lexify from "../lexer/lexify.ts";

/** parses codes string or lexemes and returns a program object */
export default function parser(
  code: string | Lexeme[],
  language: Language
): Program {
  const rawLexemes = typeof code === "string" ? lexify(code, language) : code;
  const lexemes = new Lexemes(rawLexemes);

  switch (language) {
    case "BASIC":
      return basicParser(lexemes);

    case "C":
      return cParser(lexemes);

    case "Java":
      return javaParser(lexemes);

    case "Pascal":
      return pascalParser(lexemes);

    case "Python":
      return pythonParser(lexemes);

    case "TypeScript":
      return typeScriptParser(lexemes);
  }
}
