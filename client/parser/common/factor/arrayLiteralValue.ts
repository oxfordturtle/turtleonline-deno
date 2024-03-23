import type { DelimiterLexeme } from "../../../lexer/lexeme.ts";
import { CompilerError } from "../../../tools/error.ts";
import { getType } from "../../definitions/expression.ts";
import makeArrayLiteralValue, { type ArrayLiteralValue } from "../../definitions/expressions/arrayLiteralValue.ts";
import type { Lexemes } from "../../definitions/lexemes.ts";
import type { Routine } from "../../definitions/routine.ts";
import parseExpression from "../expression.ts";
import typeCheck from "../typeCheck.ts";

const parseArrayLiteralValue = (
  lexeme: DelimiterLexeme,
  lexemes: Lexemes,
  routine: Routine
): ArrayLiteralValue => {
  // move past opening bracket
  lexemes.next();
  const firstLexeme = lexemes.get();

  // sanity check
  if (firstLexeme === undefined) {
    throw new CompilerError("Expected an expression after opening bracket.", lexeme);
  }

  // check for empty arrays
  if (firstLexeme.content === "]") {
    lexemes.next();
    return makeArrayLiteralValue(lexeme, "boolint");
  }

  // parse the first value
  const firstValue = parseExpression(lexemes, routine);
  const type = getType(firstValue);

  // create the array value
  const arrayLiteralValue = makeArrayLiteralValue(lexeme, type);
  arrayLiteralValue.values.push(firstValue);

  // check for additional values
  let nextLexeme = lexemes.get();
  while (nextLexeme?.content === ",") {
    lexemes.next();
    const nextValue = parseExpression(lexemes, routine);
    const checkedValue = typeCheck(routine.language, nextValue, type);
    arrayLiteralValue.values.push(checkedValue);
    nextLexeme = lexemes.get();
  }

  // return the array value
  return arrayLiteralValue;
};

export default parseArrayLiteralValue;
