import type { TypeLexeme } from "../../../lexer/lexeme.ts";
import { CompilerError } from "../../../tools/error.ts";
import { getType, type Expression } from "../../definitions/expression.ts";
import makeCastExpression from "../../definitions/expressions/castExpression.ts";
import type { Lexemes } from "../../definitions/lexemes.ts";
import type { Routine } from "../../definitions/routine.ts";
import parseExpression from "../expression.ts";

const parseCastExpression = (
  lexeme: TypeLexeme,
  lexemes: Lexemes,
  routine: Routine
): Expression => {
  lexemes.next();
  const type = lexeme.subtype;
  if (type === null) {
    throw new CompilerError("Expression cannot be cast as void.", lexeme);
  }
  lexemes.next();
  if (lexemes.get()?.content !== ")") {
    throw new CompilerError(
      'Type in type cast expression must be followed by a closing bracket ")".',
      lexeme
    );
  }
  lexemes.next();
  const expression = parseExpression(lexemes, routine);
  const expressionType = getType(expression);
  if (type !== expressionType) {
    if (type === "boolean" && expressionType === "character") {
      throw new CompilerError("Characters cannot be cast as booleans.", lexeme);
    }
    if (type === "boolean" && expressionType === "string") {
      throw new CompilerError("Strings cannot be cast as booleans.", lexeme);
    }
    if (type === "string" && expressionType === "boolean") {
      throw new CompilerError("Booleans cannot be cast as strings.", lexeme);
    }
    if (type === "character" && expressionType === "boolean") {
      throw new CompilerError("Booleans cannot be cast as characters.", lexeme);
    }
    if (type === "character" && expressionType === "string") {
      throw new CompilerError("Strings cannot be cast as characters.", lexeme);
    }
    return makeCastExpression(lexeme, type, expression);
  }
  return expression;
};

export default parseCastExpression;
