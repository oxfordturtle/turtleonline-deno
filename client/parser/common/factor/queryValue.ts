import type { QueryCodeLexeme } from "../../../lexer/lexeme.ts";
import { CompilerError } from "../../../tools/error.ts";
import makeQueryValue, { QueryValue } from "../../definitions/expressions/queryValue.ts";
import type { Lexemes } from "../../definitions/lexemes.ts";
import type { Routine } from "../../definitions/routine.ts";
import * as find from "../find.ts";

const parseQueryValue = (
  lexeme: QueryCodeLexeme,
  lexemes: Lexemes,
  routine: Routine
): QueryValue => {
  const query = find.query(routine, lexeme.value);
  if (query) {
    lexemes.next();
    return makeQueryValue(lexeme, query);
  }
  throw new CompilerError("{lex} is not a valid query code.", lexeme);
};

export default parseQueryValue;
