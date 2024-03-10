import type { Input } from "../../../constants/inputs.ts";
import type { InputCodeLexeme } from "../../../lexer/lexeme.ts";
import { makeExpression, type ExpressionCommon } from "../expression.ts";

export interface InputValue extends ExpressionCommon {
  readonly expressionType: "input";
  readonly lexeme: InputCodeLexeme;
  readonly type: "integer";
  readonly input: Input;
}

const makeInputValue = (lexeme: InputCodeLexeme, input: Input): InputValue => ({
  ...makeExpression(),
  expressionType: "input",
  lexeme,
  type: "integer",
  input,
});

export default makeInputValue;
