import type { Language } from "../constants/languages.ts";
import type { Token } from "../tokenizer/token.ts";
import type { Keyword } from "./keywords.ts";
import type { Type } from "./types.ts";
import type { Operator } from "./operators.ts";
import type { Delimiter } from "./delimiters.ts";

export type Lexeme = ReturnType<
  | typeof newlineLexeme
  | typeof indentLexeme
  | typeof dedentLexeme
  | typeof commentLexeme
  | typeof keywordLexeme
  | typeof typeLexeme
  | typeof operatorLexeme
  | typeof delimiterLexeme
  | typeof booleanLexeme
  | typeof integerLexeme
  | typeof characterLexeme
  | typeof stringLexeme
  | typeof inputcodeLexeme
  | typeof querycodeLexeme
  | typeof identifierLexeme
>;

const lexeme = (token: Token) =>
  ({
    __: "lexeme",
    subtype: null,
    line: token.line,
    character: token.character,
    content: token.content,
  } as const);

export const newlineLexeme = (token: Token) =>
  ({
    ...lexeme(token),
    type: "newline",
    content: "[newline]",
  } as const);

export const indentLexeme = (token: Token) =>
  ({
    ...lexeme(token),
    type: "indent",
    content: "[indent]",
  } as const);

export const dedentLexeme = (token: Token) =>
  ({
    ...lexeme(token),
    type: "dedent",
    content: "[dedent]",
  } as const);

export const commentLexeme = (token: Token, language: Language) => {
  const value: Record<Language, string> = {
    BASIC: token.content.slice(3).trim(),
    C: token.content.slice(2).trim(),
    Java: token.content.slice(2).trim(),
    Pascal: token.content.slice(1, -1).trim(),
    Python: token.content.slice(1).trim(),
    TypeScript: token.content.slice(2).trim(),
  };

  return {
    ...lexeme(token),
    type: "comment",
    value: value[language],
  } as const;
};

export const keywordLexeme = (token: Token) =>
  ({
    ...lexeme(token),
    type: "keyword",
    subtype: token.content.toLowerCase() as Keyword,
  } as const);

export const typeLexeme = (token: Token) => {
  const subtypes: Record<string, Type> = {
    bool: "boolean",
    boolean: "boolean",
    char: "character",
    int: "integer",
    integer: "integer",
    string: "string",
    String: "string",
  };

  return {
    ...lexeme(token),
    type: "type",
    subtype: subtypes[token.content] ?? null,
  } as const;
};

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
    ...lexeme(token),
    type: "operator",
    subtype: subtypes[token.content.toLowerCase()] as Operator | "asgn",
  } as const;
};

export const delimiterLexeme = (token: Token) =>
  ({
    ...lexeme(token),
    type: "delimiter",
    subtype: token.content as Delimiter,
  } as const);

export const booleanLexeme = (token: Token, language: Language) => {
  const trueValue = language === "C" || language === "Python" ? 1 : -1;

  return {
    ...lexeme(token),
    type: "literal",
    subtype: "boolean",
    value: token.content.toLowerCase() === "true" ? trueValue : 0,
  } as const;
};

export const integerLexeme = (token: Token, radix: number) => {
  const firstNonInteger = token.content.match(/[^0-9]/);
  const trimmedContent = firstNonInteger
    ? token.content.slice((firstNonInteger.index || 0) + 1)
    : token.content;

  return {
    ...lexeme(token),
    type: "literal",
    subtype: "integer",
    value: parseInt(trimmedContent, 10),
    radix,
  } as const;
};

export const characterLexeme = (token: Token, language: Language) => {
  const asStringLexeme = stringLexeme(token, language);

  return {
    ...asStringLexeme,
    subtype: "character",
    value: asStringLexeme.value.charCodeAt(0),
  } as const;
};

export const stringLexeme = (token: Token, language: Language) => {
  const value: Record<Language, string> = {
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
    ...lexeme(token),
    type: "literal",
    subtype: "string",
    value: value[language],
  } as const;
};

export const inputcodeLexeme = (token: Token, language: Language) =>
  ({
    ...lexeme(token),
    type: "input",
    subtype: "inputcode",
    value:
      language === "Pascal"
        ? token.content.slice(1).toLowerCase()
        : token.content.slice(1),
  } as const);

export const querycodeLexeme = (token: Token, language: Language) =>
  ({
    ...lexeme(token),
    type: "input",
    subtype: "querycode",
    value:
      language === "Pascal"
        ? token.content.slice(1).toLowerCase()
        : token.content.slice(1),
  } as const);

export const identifierLexeme = (token: Token, language: Language) =>
  ({
    ...lexeme(token),
    type: "identifier",
    subtype: token.type === "turtle" ? "turtle" : "identifier",
    value: language === "Pascal" ? token.content.toLowerCase() : token.content,
  } as const);
