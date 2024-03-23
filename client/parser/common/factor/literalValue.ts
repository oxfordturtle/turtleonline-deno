import type {
  BooleanLexeme,
  CharacterLexeme,
  IntegerLexeme,
  StringLexeme,
} from "../../../lexer/lexeme.ts";
import makeIntegerValue, { type IntegerValue } from "../../definitions/expressions/integerValue.ts";
import makeStringValue, { type StringValue } from "../../definitions/expressions/stringValue.ts";
import type { Lexemes } from "../../definitions/lexemes.ts";
import type { Routine } from "../../definitions/routine.ts";

const parseLiteralValue = (
  lexeme: BooleanLexeme | IntegerLexeme | CharacterLexeme | StringLexeme,
  lexemes: Lexemes,
  _routine: Routine
): IntegerValue | StringValue => {
  lexemes.next();
  return lexeme.subtype === "string" ? makeStringValue(lexeme) : makeIntegerValue(lexeme);
};

export default parseLiteralValue;
