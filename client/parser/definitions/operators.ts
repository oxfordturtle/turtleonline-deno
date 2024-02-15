import type { Lexeme } from "../../lexer/lexeme.ts";
import type { Operator, Type } from "../../lexer/types.ts";

export const operators: [Operator[], Operator[], Operator[], Operator[]] = [
  ["eqal", "less", "lseq", "more", "mreq", "noeq", "seql", "sles", "sleq", "smor", "smeq", "sneq"],
  ["plus", "scat", "subt", "or", "orl", "xor"],
  ["and", "andl", "div", "divr", "mod", "mult"],
  ["neg", "not"],
];

export const operator = (lexeme: Lexeme, level: number): Operator | undefined =>
  operators[level].find((x) => lexeme.type === "operator" && lexeme.subtype === x);

export const operatorType: Record<Operator, Type> = {
  not: "boolean",
  eqal: "boolean",
  less: "boolean",
  lseq: "boolean",
  more: "boolean",
  mreq: "boolean",
  noeq: "boolean",
  seql: "boolean",
  sles: "boolean",
  sleq: "boolean",
  smor: "boolean",
  smeq: "boolean",
  sneq: "boolean",
  or: "boolint",
  orl: "boolint",
  xor: "boolint",
  and: "boolint",
  andl: "boolint",
  plus: "integer",
  subt: "integer",
  div: "integer",
  divr: "integer",
  mod: "integer",
  mult: "integer",
  neg: "integer",
  scat: "string",
};

export const stringOperator = (operator: Operator): Operator => {
  const stringOperators: Partial<Record<Operator, Operator>> = {
    eqal: "seql",
    less: "sles",
    lseq: "sleq",
    more: "smor",
    mreq: "smeq",
    noeq: "sneq",
    plus: "scat",
  };

  return stringOperators[operator] ?? operator;
}
