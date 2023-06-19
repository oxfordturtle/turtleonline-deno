import program from "./program.ts";
import constant from "./constant.ts";
import { statement, simpleStatement, eosCheck } from "./statement.ts";
import type from "./type.ts";
import identifier from "./identifier.ts";
import subroutine from "./subroutine.ts";
import Lexemes from "../definitions/lexemes.ts";
import Program from "../definitions/program.ts";
import { CompilerError } from "../../tools/error.ts";
import { Lexeme } from "../../lexer/lexeme.ts";

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
            "Program can only contain constant definitions, variable declarations, and subroutine defintions.",
            lexeme
          );
        }
        break;

      // variable declarations/assignments or subroutine definitions
      case "type":
        // expecting type specification followed by idenfitier (throw away the results)
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
          "Program can only contain constant definitions, variable declarations, and subroutine defintions.",
          lexeme
        );
    }
  }

  // second pass: parse the statements of each subroutine
  for (const subroutine of prog.allSubroutines) {
    // loop through the lexemes
    lexemes.index = subroutine.start;
    while (lexemes.index < subroutine.end) {
      subroutine.statements.push(
        statement(lexemes.get() as Lexeme, lexemes, subroutine)
      );
    }
  }

  // check for a main subroutine
  if (!prog.subroutines.some((x) => x.name === "main")) {
    throw new CompilerError('Program does not contain any "main" method.');
  }

  // return the program
  return prog;
}
