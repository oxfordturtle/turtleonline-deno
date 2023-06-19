import * as find from "../find.ts";
import Lexemes from "../definitions/lexemes.ts";
import Program from "../definitions/program.ts";
import { Subroutine } from "../definitions/subroutine.ts";
import { CompilerError } from "../../tools/error.ts";

/** parses lexeme as an identifier, and returns the name */
export default function identifier(
  lexemes: Lexemes,
  routine: Program | Subroutine,
  duplicateCheck: boolean
): string {
  const identifier = lexemes.get();

  if (!identifier) {
    throw new CompilerError(
      "{lex} must be followed by an identifier.",
      lexemes.get(-1)
    );
  }

  if (identifier.type !== "identifier") {
    throw new CompilerError("{lex} is not a valid identifier.", identifier);
  }

  if (duplicateCheck) {
    if (identifier.subtype === "turtle") {
      throw new CompilerError(
        "{lex} is already the name of a Turtle attribute.",
        identifier
      );
    }
    if (find.isDuplicate(routine, identifier.value)) {
      throw new CompilerError(
        "{lex} is already the name of a variable or subroutine in the current scope.",
        identifier
      );
    }
  }

  lexemes.next();

  return identifier.value;
}
