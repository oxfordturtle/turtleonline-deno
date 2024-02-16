import { type Lexeme } from "../../lexer/lexeme.ts";
import { CompilerError } from "../../tools/error.ts";
import * as find from "../common/find.ts";
import parseProcedureCall from "../common/procedureCall.ts";
import type { Lexemes } from "../definitions/lexemes.ts";
import type { Routine } from "../definitions/routine.ts";
import type { Subroutine } from "../definitions/routines/subroutine.ts";
import type { Statement } from "../definitions/statement.ts";
import makePassStatement from "../definitions/statements/passStatement.ts";
import identifiers from "./identifiers.ts";
import eosCheck from "./statements/eosCheck.ts";
import parseForStatement from "./statements/forStatement.ts";
import parseIfStatement from "./statements/ifStatement.ts";
import parseReturnStatement from "./statements/returnStatement.ts";
import parseVariableAssignment from "./statements/variableAssignment.ts";
import parseVariableDeclaration from "./statements/variableDeclaration.ts";
import parseWhileStatement from "./statements/whileStatement.ts";

export default (lexeme: Lexeme, lexemes: Lexemes, routine: Routine): Statement => {
  let statement: Statement;

  switch (lexeme.type) {
    // new line
    case "newline":
      // in general this should be impossible (new lines should be eaten up at
      // the end of the previous statement), but it can happen at the start of
      // of the program or the start of a block, if there's a comment on the
      // first line
      lexemes.next();
      statement = makePassStatement();
      break;

    // identifiers (variable declaration, variable assignment, or procedure call)
    case "identifier": {
      const foo = find.variable(routine, lexemes.get()?.content as string);
      const bar = find.command(routine, lexemes.get()?.content as string);
      if (foo) {
        lexemes.next();
        statement = parseVariableAssignment(lexeme, lexemes, routine, foo);
      } else if (bar) {
        lexemes.next();
        statement = parseProcedureCall(lexeme, lexemes, routine, bar);
      } else {
        statement = parseVariableDeclaration(lexeme, lexemes, routine);
      }
      eosCheck(lexemes);
      break;
    }

    // keywords
    case "keyword":
      switch (lexeme.subtype) {
        // def
        case "def": {
          // the subroutine will have been defined in the first pass
          const sub = find.subroutine(routine, lexemes.get(1)?.content as string) as Subroutine;
          // so here, just jump past its lexemes
          // N.B. lexemes[sub.end] is the final DEDENT lexeme; here we want to
          // move past it, hence sub.end + 1
          lexemes.index = sub.end + 1;
          statement = makePassStatement();
          break;
        }

        // global/nonlocal statement
        case "global":
        case "nonlocal":
          lexemes.next();
          if (routine.__ === "Program") {
            throw new CompilerError(
              "{lex} statements can only occur inside a subroutine.",
              lexemes.get(-1)
            );
          }
          if (lexemes.get(-1)?.content === "global") {
            routine.globals.push(...identifiers(lexemes, routine, "global"));
          } else {
            routine.nonlocals.push(...identifiers(lexemes, routine, "nonlocal"));
          }
          statement = makePassStatement();
          eosCheck(lexemes);
          break;

        // return statement
        case "return":
          lexemes.next();
          statement = parseReturnStatement(lexeme, lexemes, routine);
          break;

        // start of IF structure
        case "if":
          lexemes.next();
          statement = parseIfStatement(lexeme, lexemes, routine);
          break;

        // else is an error
        case "else":
          throw new CompilerError(
            'Statement cannot begin with "else". If you have an "if" above, this line may need to be indented more.',
            lexemes.get()
          );

        // start of FOR structure
        case "for":
          lexemes.next();
          statement = parseForStatement(lexeme, lexemes, routine);
          break;

        // start of WHILE structure
        case "while":
          lexemes.next();
          statement = parseWhileStatement(lexeme, lexemes, routine);
          break;

        // PASS
        case "pass":
          lexemes.next();
          eosCheck(lexemes);
          statement = makePassStatement();
          break;

        // any other keyword is an error
        default:
          throw new CompilerError("Statement cannot begin with {lex}.", lexeme);
      }
      break;

    // an indent is an error
    case "indent":
      throw new CompilerError("Statement cannot be indented.", lexeme);

    // any other lexeme is an error
    default:
      throw new CompilerError("Statement cannot begin with {lex}.", lexeme);
  }

  // return the statement
  return statement;
};
