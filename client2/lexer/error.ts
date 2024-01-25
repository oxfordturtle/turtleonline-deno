import type { Token } from "../tokenizer/token.ts";

export type LexerError = ReturnType<typeof lexerError>;

const lexerError = (message: string, token: Token) =>
  ({
    __: "LexerError",
    message,
    token,
  } as const);

export default lexerError;
