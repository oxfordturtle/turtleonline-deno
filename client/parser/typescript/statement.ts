import { type Lexeme } from "../../lexer/lexeme.ts";
import { CompilerError } from "../../tools/error.ts";
import * as find from "../common/find.ts";
import type { Lexemes } from "../definitions/lexemes.ts";
import type { Program } from "../definitions/routines/program.ts";
import { type Subroutine } from "../definitions/routines/subroutine.ts";
import { type Statement } from "../definitions/statement.ts";
import makePassStatement from "../definitions/statements/passStatement.ts";
import parseDoStatement from "./statements/doStatement.ts";
import eosCheck from "./statements/eosCheck.ts";
import parseForStatement from "./statements/forStatement.ts";
import parseIfStatement from "./statements/ifStatement.ts";
import parseReturnStatement from "./statements/returnStatement.ts";
import parseSimpleStatement from "./statements/simpleStatement.ts";
import parseWhileStatement from "./statements/whileStatement.ts";

const parseStatement = (
  lexeme: Lexeme,
  lexemes: Lexemes,
  routine: Program | Subroutine
): Statement => {
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

    // identifiers (variable assignment or procedure call)
    case "identifier":
      statement = parseSimpleStatement(lexeme, lexemes, routine);
      eosCheck(lexemes);
      break;

    // keywords
    case "keyword":
      switch (lexeme.subtype) {
        // function
        case "function": {
          // the subroutine will have been defined in the first pass
          const sub = find.subroutine(routine, lexemes.get(1)?.content as string) as Subroutine;
          // so here, just jump past its lexemes
          // N.B. lexemes[sub.end] is the final "}" lexeme; here we want to move
          // past it, hence sub.end + 1
          lexemes.index = sub.end + 1;
          statement = makePassStatement();
          break;
        }

        // start of variable declaration/assignment
        case "const": // fallthrough
        case "var":
          statement = parseSimpleStatement(lexeme, lexemes, routine);
          eosCheck(lexemes);
          break;

        // start of RETURN statement
        case "return":
          lexemes.next();
          statement = parseReturnStatement(lexeme, lexemes, routine);
          break;

        // start of IF statement
        case "if":
          lexemes.next();
          statement = parseIfStatement(lexeme, lexemes, routine);
          break;

        // else is an error
        case "else":
          throw new CompilerError(
            'Statement cannot begin with "else". If you have an "if" above, you may be missing a closing bracket "}".',
            lexeme
          );

        // start of FOR statement
        case "for":
          lexemes.next();
          statement = parseForStatement(lexeme, lexemes, routine);
          break;

        // start of DO (REPEAT) statement
        case "do":
          lexemes.next();
          statement = parseDoStatement(lexeme, lexemes, routine);
          break;

        // start of WHILE statement
        case "while":
          lexemes.next();
          statement = parseWhileStatement(lexeme, lexemes, routine);
          break;

        // any other keyword is an error
        default:
          throw new CompilerError("Statement cannot begin with {lex}.", lexeme);
      }
      break;

    // any other lexeme is an error
    default:
      throw new CompilerError("Statement cannot begin with {lex}.", lexeme);
  }

  // all good
  return statement;
};

export default parseStatement;
