import type { Lexeme } from "../../lexer/lexeme.ts";
import type Lexemes from "../definitions/lexemes.ts";
import type { Routine } from "../definitions/routine.ts";
import { statement } from "./statement.ts";

/** parses the body of a routine */
export default function body(lexemes: Lexemes, routine: Routine): void {
  lexemes.index = routine.start;
  while (lexemes.index < routine.end) {
    routine.statements.push(statement(lexemes.get() as Lexeme, lexemes, routine));
  }
}
