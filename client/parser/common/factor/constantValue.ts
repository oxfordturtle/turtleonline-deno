import type { IdentifierLexeme } from "../../../lexer/lexeme.ts";
import { CompilerError } from "../../../tools/error.ts";
import { Constant } from "../../definitions/constant.ts";
import makeConstantIndex, {
  type ConstantIndex,
} from "../../definitions/expressions/constantIndex.ts";
import makeConstantValue, {
  type ConstantValue,
} from "../../definitions/expressions/constantValue.ts";
import type { Lexemes } from "../../definitions/lexemes.ts";
import type { Routine } from "../../definitions/routine.ts";
import parseExpression from "../expression.ts";
import typeCheck from "../typeCheck.ts";

const parseConstantValue = (
  lexeme: IdentifierLexeme,
  lexemes: Lexemes,
  routine: Routine,
  constant: Constant
): ConstantValue | ConstantIndex => {
  // create constant value
  const constantValue = makeConstantValue(lexeme, constant);

  // move along
  lexemes.next();

  // check for string index
  const openBracket = routine.language === "BASIC" ? "(" : "[";
  const closeBracket = routine.language === "BASIC" ? ")" : "]";
  const nextLexeme = lexemes.get();
  if (nextLexeme?.content === openBracket) {
    if (constant.type !== "string") {
      throw new CompilerError("{lex} is not an string constant.", lexeme);
    }

    lexemes.next();

    // expecting an integer expression for the character index
    const expression = parseExpression(lexemes, routine);
    const checkedExpression = typeCheck(routine.language, expression, "integer");

    // expecting closing bracket
    const finalLexeme = lexemes.get();
    if (finalLexeme?.content !== closeBracket) {
      throw new CompilerError(
        `Closing bracket "${closeBracket}" missing after string variable index.`,
        checkedExpression.lexeme
      );
    }
    lexemes.next();

    return makeConstantIndex(lexeme, constantValue, checkedExpression);
  }

  return constantValue;
};

export default parseConstantValue;
