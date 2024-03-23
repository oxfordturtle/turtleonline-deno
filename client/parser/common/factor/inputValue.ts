import type { InputCodeLexeme } from "../../../lexer/lexeme.ts";
import { CompilerError } from "../../../tools/error.ts";
import makeInputValue, { InputValue } from "../../definitions/expressions/inputValue.ts";
import type { Lexemes } from "../../definitions/lexemes.ts";
import type { Routine } from "../../definitions/routine.ts";
import * as find from "../find.ts";

const parseInputValue = (
  lexeme: InputCodeLexeme,
  lexemes: Lexemes,
  routine: Routine
): InputValue => {
  const input = find.input(routine, lexeme.value);
  if (input) {
    lexemes.next();
    return makeInputValue(lexeme, input);
  }
  throw new CompilerError("{lex} is not a valid input code.", lexeme);
};

export default parseInputValue;
