import { trueValue, type Language } from "../constants/languages.ts";
import type { Token } from "../tokenizer/token.ts";
import type { Delimiter, Keyword, Operator, Type } from "./types.ts";

export type Lexeme =
  | NewlineLexeme
  | IndentLexeme
  | DedentLexeme
  | CommentLexeme
  | KeywordLexeme
  | TypeLexeme
  | OperatorLexeme
  | DelimiterLexeme
  | BooleanLexeme
  | IntegerLexeme
  | CharacterLexeme
  | StringLexeme
  | InputCodeLexeme
  | QueryCodeLexeme
  | IdentifierLexeme;

const lexeme = (line: number, character: number, content: string) =>
  ({
    __: "lexeme",
    line,
    character,
    content,
  } as const);

export type NewlineLexeme = ReturnType<typeof newlineLexeme>;

export const newlineLexeme = (token: Token) =>
  ({
    ...lexeme(token.line, token.character, "[newline]"),
    type: "newline",
  } as const);

export type IndentLexeme = ReturnType<typeof indentLexeme>;

export const indentLexeme = (token: Token) =>
  ({
    ...lexeme(token.line, token.character, "[indent]"),
    type: "indent",
  } as const);

export type DedentLexeme = ReturnType<typeof dedentLexeme>;

export const dedentLexeme = (token: Token) =>
  ({
    ...lexeme(token.line, token.character, "[dedent]"),
    type: "dedent",
  } as const);

export type CommentLexeme = ReturnType<typeof commentLexeme>;

export const commentLexeme = (token: Token, language: Language) => {
  const values = {
    BASIC: token.content.slice(3).trim(),
    C: token.content.slice(2).trim(),
    Java: token.content.slice(2).trim(),
    Pascal: token.content.slice(1, -1).trim(),
    Python: token.content.slice(1).trim(),
    TypeScript: token.content.slice(2).trim(),
  };

  return {
    ...lexeme(token.line, token.character, token.content),
    type: "comment",
    value: values[language],
  } as const;
};

export type KeywordLexeme = ReturnType<typeof keywordLexeme>;

export const keywordLexeme = (token: Token) =>
  ({
    ...lexeme(token.line, token.character, token.content),
    type: "keyword",
    subtype: token.content.toLowerCase() as Keyword,
  } as const);

export type TypeLexeme = ReturnType<typeof typeLexeme>;

export const typeLexeme = (token: Token) => {
  const subtypes: Record<string, Type> = {
    bool: "boolean",
    boolean: "boolean",
    char: "character",
    int: "integer",
    integer: "integer",
    number: "integer",
    string: "string",
  };

  return {
    ...lexeme(token.line, token.character, token.content),
    type: "type",
    subtype: subtypes[token.content.toLowerCase()],
  } as const;
};

export type OperatorLexeme = ReturnType<typeof operatorLexeme>;

export const operatorLexeme = (token: Token, language: Language) => {
  const subtypes: Record<string, Operator | "asgn"> = {
    "+": "plus",
    "-": "subt",
    "*": "mult",
    "/": "divr",
    div: "div",
    "//": "div",
    mod: "mod",
    "%": "mod",
    "=": language === "BASIC" || language === "Pascal" ? "eqal" : "asgn",
    "+=": "asgn",
    "-=": "asgn",
    "==": "eqal",
    "<>": "noeq",
    "!=": "noeq",
    "<=": "lseq",
    ">=": "mreq",
    "<": "less",
    ">": "more",
    not: "not",
    "~": "not",
    "!": "not",
    and: language === "Python" ? "andl" : "and",
    or: language === "Python" ? "orl" : "or",
    andl: "andl",
    "&&": "andl",
    "&": "and",
    orl: "orl",
    "||": "orl",
    "|": "or",
    eor: "xor",
    xor: "xor",
    "^": "xor",
  };

  return {
    ...lexeme(token.line, token.character, token.content),
    type: "operator",
    subtype: subtypes[token.content.toLowerCase()],
  } as const;
};

export type DelimiterLexeme = ReturnType<typeof delimiterLexeme>;

export const delimiterLexeme = (token: Token) =>
  ({
    ...lexeme(token.line, token.character, token.content),
    type: "delimiter",
    subtype: token.content as Delimiter,
  } as const);

export type BooleanLexeme = ReturnType<typeof booleanLexeme>;

export const booleanLexeme = (token: Token, language: Language) =>
  ({
    ...lexeme(token.line, token.character, token.content),
    type: "literal",
    subtype: "boolean",
    value: token.content.toLowerCase() === "true" ? trueValue[language] : 0,
  } as const);

export type IntegerLexeme = ReturnType<typeof integerLexeme>;

export const integerLexeme = (token: Token, radix: number) => {
  const firstNonInteger = token.content.match(/[^0-9]/);
  const trimmedContent = firstNonInteger
    ? token.content.slice((firstNonInteger.index ?? 0) + 1)
    : token.content;

  return {
    ...lexeme(token.line, token.character, token.content),
    type: "literal",
    subtype: "integer",
    value: parseInt(trimmedContent, radix),
    radix,
  } as const;
};

export type CharacterLexeme = ReturnType<typeof characterLexeme>;

export const characterLexeme = (token: Token, language: Language) =>
  ({
    ...stringLexeme(token, language),
    subtype: "character",
    value: token.content.charCodeAt(0),
  } as const);

export type StringLexeme = ReturnType<typeof stringLexeme>;

export const stringLexeme = (token: Token, language: Language) => {
  const values = {
    BASIC: token.content.slice(1, -1).replace(/""/g, '"'),
    C: token.content.slice(1, -1).replace(/\\('|")/g, "$1"),
    Java: token.content.slice(1, -1).replace(/\\('|")/g, "$1"),
    Pascal:
      token.content[0] === "'"
        ? token.content.slice(1, -1).replace(/''/g, "'")
        : token.content.slice(1, -1).replace(/""/g, '"'),
    Python: token.content.slice(1, -1).replace(/\\('|")/g, "$1"),
    TypeScript: token.content.slice(1, -1).replace(/\\('|")/g, "$1"),
  };

  return {
    ...lexeme(token.line, token.character, token.content),
    type: "literal",
    subtype: "string",
    value: values[language],
  } as const;
};

export type InputCodeLexeme = ReturnType<typeof inputCodeLexeme>;

export const inputCodeLexeme = (token: Token, language: Language) =>
  ({
    ...lexeme(token.line, token.character, token.content),
    type: "input",
    subtype: "inputCode",
    value: language === "Pascal" ? token.content.slice(1).toLowerCase() : token.content.slice(1),
  } as const);

export type QueryCodeLexeme = ReturnType<typeof queryCodeLexeme>;

export const queryCodeLexeme = (token: Token, language: Language) =>
  ({
    ...lexeme(token.line, token.character, token.content),
    type: "input",
    subtype: "queryCode",
    value: language === "Pascal" ? token.content.slice(1).toLowerCase() : token.content.slice(1),
  } as const);

export type IdentifierLexeme = ReturnType<typeof identifierLexeme>;

export const identifierLexeme = (token: Token, language: Language) =>
  ({
    ...lexeme(token.line, token.character, token.content),
    type: "identifier",
    subtype: token.type === "turtle" ? "turtle" : "identifier",
    value: language === "Pascal" ? token.content.toLowerCase() : token.content,
  } as const);
