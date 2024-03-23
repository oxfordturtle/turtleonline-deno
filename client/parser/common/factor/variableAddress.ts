import type { OperatorLexeme } from "../../../lexer/lexeme.ts";
import { CompilerError } from "../../../tools/error.ts";
import makeVariableAddress, {
  VariableAddress,
} from "../../definitions/expressions/variableAddress.ts";
import type { Lexemes } from "../../definitions/lexemes.ts";
import type { Routine } from "../../definitions/routine.ts";
import parseFactor from "../factor.ts";

const parseVariableAddress = (
  lexeme: OperatorLexeme,
  lexemes: Lexemes,
  routine: Routine
): VariableAddress => {
  lexemes.next();
  const nextLexeme = lexemes.get();
  if (nextLexeme === undefined) {
    throw new CompilerError("Expected an expression after {lex}.", lexeme);
  }
  const expression = parseFactor(nextLexeme, lexemes, routine);
  if (expression.expressionType !== "variable") {
    throw new CompilerError('Address operator "&" must be followed by a variable.', lexeme);
  }
  const variableAddress = makeVariableAddress(expression.lexeme, expression.variable);
  return variableAddress;
};

export default parseVariableAddress;
