export type Token = ReturnType<typeof token>;

export type TokenType =
  | "spaces"
  | "newline"
  | "comment"
  | "unterminated-comment"
  | "keyword"
  | "type"
  | "operator"
  | "delimiter"
  | "string"
  | "unterminated-string"
  | "boolean"
  | "binary"
  | "bad-binary"
  | "octal"
  | "bad-octal"
  | "hexadecimal"
  | "bad-hexadecimal"
  | "decimal"
  | "real"
  | "inputcode"
  | "bad-inputcode"
  | "querycode"
  | "bad-querycode"
  | "turtle"
  | "command"
  | "colour"
  | "identifier"
  | "illegal";

export const token = (type: TokenType, content: string, line: number, character: number) =>
  ({
    __: "token",
    type,
    content,
    line,
    character,
  } as const);
