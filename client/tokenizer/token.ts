export type Token = ReturnType<typeof token>;

export type TokenType =
  | "spaces"
  | "newline"
  | "comment"
  | "unterminatedComment"
  | "keyword"
  | "type"
  | "operator"
  | "delimiter"
  | "string"
  | "unterminatedString"
  | "boolean"
  | "binary"
  | "badBinary"
  | "octal"
  | "badOctal"
  | "hexadecimal"
  | "badHexadecimal"
  | "decimal"
  | "real"
  | "inputCode"
  | "badInputCode"
  | "queryCode"
  | "badQueryCode"
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
