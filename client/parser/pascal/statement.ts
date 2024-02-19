import { type Lexeme } from "../../lexer/lexeme.ts";
import { CompilerError } from "../../tools/error.ts";
import type { Lexemes } from "../definitions/lexemes.ts";
import type { Program } from "../definitions/routines/program.ts";
import type { Subroutine } from "../definitions/routines/subroutine.ts";
import { type Statement } from "../definitions/statement.ts";
import eosCheck from "./statements/eosCheck.ts";
import parseForStatement from "./statements/forStatement.ts";
import parseIfStatement from "./statements/ifStatement.ts";
import parseRepeatStatement from "./statements/repeatStatement.ts";
import parseSimpleStatement from "./statements/simpleStatement.ts";
import parseWhileStatement from "./statements/whileStatement.ts";

const parseStatement = (
  lexeme: Lexeme,
  lexemes: Lexemes,
  routine: Program | Subroutine
): Statement => {
  // declare the return value
  let statement: Statement;

  // assign the return value accordingly
  switch (lexeme.type) {
    // identifiers (variable assignment or procedure call)
    case "identifier":
      statement = parseSimpleStatement(lexeme, lexemes, routine);
      break;

    // keywords
    case "keyword":
      switch (lexeme.subtype) {
        // start of IF structure
        case "if":
          lexemes.next();
          statement = parseIfStatement(lexeme, lexemes, routine);
          break;

        // start of FOR structure
        case "for":
          lexemes.next();
          statement = parseForStatement(lexeme, lexemes, routine);
          break;

        // start of REPEAT structure
        case "repeat":
          lexemes.next();
          statement = parseRepeatStatement(lexeme, lexemes, routine);
          break;

        // start of WHILE structure
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

  // semicolon check
  eosCheck(lexemes);

  // all good
  return statement;
};

export default parseStatement;
