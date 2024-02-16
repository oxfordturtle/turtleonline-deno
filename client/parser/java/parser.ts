import type { Lexeme } from "../../lexer/lexeme.ts";
import { CompilerError } from "../../tools/error.ts";
import type { Lexemes } from "../definitions/lexemes.ts";
import { getAllSubroutines } from "../definitions/routine.ts";
import type { Program } from "../definitions/routines/program.ts";
import constant from "./constant.ts";
import identifier from "./identifier.ts";
import program from "./program.ts";
import { eosCheck, simpleStatement, statement } from "./statement.ts";
import subroutine from "./subroutine.ts";
import type from "./type.ts";

/** parses lexemes as a Java program */
export default function java(lexemes: Lexemes): Program {
  // create the program
  const prog = program(lexemes);

  // first pass: hoist all constants, variables, and methods
  lexemes.index = prog.start;
  while (lexemes.index < prog.end) {
    const lexeme = lexemes.get() as Lexeme;
    const lexemeIndex = lexemes.index;

    switch (lexeme.type) {
      // constant definitions
      case "keyword":
        if (lexeme.subtype === "final") {
          lexemes.next();
          prog.constants.push(constant(lexemes, prog));
          eosCheck(lexemes);
        } else {
          throw new CompilerError(
            "Program can only contain constant definitions, variable declarations, and subroutine definitions.",
            lexeme
          );
        }
        break;

      // variable declarations/assignments or subroutine definitions
      case "type":
        // expecting type specification followed by identifier (throw away the results)
        type(lexemes, prog);
        identifier(lexemes, prog);

        // open bracket here means its a subroutine
        if (lexemes.get()?.content === "(") {
          lexemes.index = lexemeIndex; // go back to the start
          prog.subroutines.push(subroutine(lexeme, lexemes, prog));
        }

        // otherwise its a variable declaration/assignment
        else {
          lexemes.index = lexemeIndex; // go back to the start
          prog.statements.push(simpleStatement(lexeme, lexemes, prog));
          eosCheck(lexemes);
        }
        break;

      // anything else is an error
      default:
        throw new CompilerError(
          "Program can only contain constant definitions, variable declarations, and subroutine definitions.",
          lexeme
        );
    }
  }

  // second pass: parse the statements of each subroutine
  for (const subroutine of getAllSubroutines(prog)) {
    // loop through the lexemes
    lexemes.index = subroutine.start;
    while (lexemes.index < subroutine.end) {
      subroutine.statements.push(statement(lexemes.get() as Lexeme, lexemes, subroutine));
    }
  }

  // check for a main subroutine
  if (!prog.subroutines.some((x) => x.name === "main")) {
    throw new CompilerError('Program does not contain any "main" method.');
  }

  // return the program
  return prog;
}
