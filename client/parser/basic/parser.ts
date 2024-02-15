import type { KeywordLexeme } from "../../lexer/lexeme.ts";
import { CompilerError } from "../../tools/error.ts";
import type Lexemes from "../definitions/lexemes.ts";
import { program as _program, type Program } from "../definitions/routine.ts";
import body from "./body.ts";
import subroutine from "./subroutine.ts";

/** parses lexemes as a BASIC program */
export default function basic(lexemes: Lexemes): Program {
  // create the program
  const program = _program("BASIC");

  // find the (first) "END" lexeme
  const endLexemeIndex = lexemes.lexemes.findIndex((x) => x.content === "END");
  if (endLexemeIndex < 0) {
    throw new CompilerError('Program must end with keyword "END".');
  }
  program.end = endLexemeIndex;

  // first (semi) pass: loop through any lexemes after "END" and hoist subroutine definitions
  lexemes.index = endLexemeIndex + 1;
  while (lexemes.get()) {
    if (lexemes.get()?.type === "newline") {
      lexemes.next();
    } else if (lexemes.get()?.content === "DEF") {
      lexemes.next();
      program.subroutines.push(subroutine(lexemes.get(-1) as KeywordLexeme, lexemes, program));
    } else {
      throw new CompilerError(
        'Only subroutine definitions are permissible after program "END".',
        lexemes.get()
      );
    }
  }

  // second pass: parse program statements
  // this will also parse subroutine statements after the first call of each
  // subroutine
  body(lexemes, program);

  // in case there is a subroutine that isn't called, parse it now
  for (const subroutine of program.subroutines) {
    if (subroutine.statements.length === 0) {
      body(lexemes, subroutine);
    }
  }

  // return the program
  return program;
}
