import type { OperatorLexeme } from "../../../lexer/lexeme.ts";
import { CompilerError } from "../../../tools/error.ts";
import makeCompoundExpression, {
  CompoundExpression,
} from "../../definitions/expressions/compoundExpression.ts";
import type { Lexemes } from "../../definitions/lexemes.ts";
import type { Routine } from "../../definitions/routine.ts";
import parseFactor from "../factor.ts";
import typeCheck from "../typeCheck.ts";

const parseNegativeInteger = (
  lexeme: OperatorLexeme,
  lexemes: Lexemes,
  routine: Routine
): CompoundExpression => {
  lexemes.next();
  const nextLexeme = lexemes.get();
  if (nextLexeme === undefined) {
    throw new CompilerError("Expected an expression after {lex}.", lexeme);
  }
  const expression = parseFactor(nextLexeme, lexemes, routine);
  const checkedExpression = typeCheck(routine.language, expression, "integer");
  return makeCompoundExpression(lexeme, null, checkedExpression, "neg");
};

export default parseNegativeInteger;
