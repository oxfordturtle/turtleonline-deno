import type { Lexeme } from "../../lexer/lexeme.ts";
import { CompilerError } from "../../tools/error.ts";
import type { Lexemes } from "../definitions/lexemes.ts";
import makeProgram, { type Program } from "../definitions/routines/program.ts";
import type { Subroutine } from "../definitions/routines/subroutine.ts";
import statement from "./statement.ts";
import subroutine from "./subroutine.ts";

export default (lexemes: Lexemes): Program => {
  // create the program
  const program = makeProgram("Python");
  program.end = lexemes.lexemes.length;

  // parse the program (which will parse its subroutines in turn)
  parseBody(lexemes, program);

  // check if any type could not be inferred
  checkForUncertainTypes(program);

  // return the program
  return program;
}

const parseBody = (lexemes: Lexemes, routine: Program | Subroutine): void => {
  // first pass: hoist global and nonlocal declarations and subroutine definitions
  let indents = 0;
  lexemes.index = routine.start;
  while (lexemes.index < routine.end) {
    const lexeme = lexemes.get() as Lexeme;
    lexemes.next();
    switch (lexeme.type) {
      // indents
      case "indent":
        indents += 1;
        break;

      // dedents
      case "dedent":
        indents -= 1;
        break;

      // keywords
      case "keyword":
        if (lexeme.subtype === "def") {
          routine.subroutines.push(subroutine(lexeme, lexemes, routine, indents));
        }
        break;
    }
  }

  // second pass: parse the statements of this routine and any subroutines recursively
  lexemes.index = routine.start;
  while (lexemes.index < routine.end) {
    routine.statements.push(statement(lexemes.get() as Lexeme, lexemes, routine));
  }
  for (const sub of routine.subroutines) {
    parseBody(lexemes, sub);
  }
}

const checkForUncertainTypes = (routine: Program | Subroutine): void => {
  const untypedVariable = routine.variables.find((x) => !x.typeIsCertain);
  if (untypedVariable) {
    throw new CompilerError(`Could not infer the type of variable ${untypedVariable.name}.`);
  }

  routine.subroutines.forEach(checkForUncertainTypes);
}
