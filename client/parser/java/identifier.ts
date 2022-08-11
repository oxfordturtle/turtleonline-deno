import Lexemes from "../definitions/lexemes.ts"
import Program from "../definitions/program.ts"
import { Subroutine } from "../definitions/subroutine.ts"
import * as find from "../find.ts"
import { CompilerError } from "../../tools/error.ts"

/** parses lexeme as an identifier (checking for potential errors) */
export default function identifier(lexemes: Lexemes, routine: Program | Subroutine): string {
  const identifier = lexemes.get()

  if (!identifier) {
    throw new CompilerError("{lex} must be followed by an identifier.", lexemes.get(-1))
  }

  if (identifier.type !== "identifier") {
    throw new CompilerError("{lex} is not a valid identifier.", identifier)
  }

  if (identifier.subtype === "turtle") {
    throw new CompilerError("{lex} is already the name of a predefined Turtle property.", identifier)
  }

  if (find.isDuplicate(routine, identifier.value)) {
    throw new CompilerError("{lex} is already defined in the current scope.", identifier)
  }

  lexemes.next()

  return identifier.value
}
