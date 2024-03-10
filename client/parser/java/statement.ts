import { type Lexeme } from "../../lexer/lexeme.ts";
import { CompilerError } from "../../tools/error.ts";
import type { Lexemes } from "../definitions/lexemes.ts";
import { type Subroutine } from "../definitions/routines/subroutine.ts";
import { type Statement } from "../definitions/statement.ts";
import parseDoStatement from "./statements/doStatement.ts";
import eosCheck from "./statements/eosCheck.ts";
import parseForStatement from "./statements/forStatement.ts";
import parseIfStatement from "./statements/ifStatement.ts";
import parseReturnStatement from "./statements/returnStatement.ts";
import parseSimpleStatement from "./statements/simpleStatement.ts";
import parseWhileStatement from "./statements/whileStatement.ts";

const parseStatement = (lexeme: Lexeme, lexemes: Lexemes, routine: Subroutine): Statement => {
  let statement: Statement;

  switch (lexeme.type) {
    // identifiers and type keywords (variable declaration/assignment or procedure call)
    case "identifier": // fallthrough
    case "type":
      statement = parseSimpleStatement(lexeme, lexemes, routine);
      eosCheck(lexemes);
      break;

    // keywords
    case "keyword":
      switch (lexeme.subtype) {
        // constant definition
        case "final":
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

        // anything else is an error
        default:
          throw new CompilerError("Statement cannot begin with {lex}.", lexeme);
      }
      break;

    default:
      throw new CompilerError("Statement cannot begin with {lex}.", lexeme);
  }

  // all good
  return statement;
};

export default parseStatement;
