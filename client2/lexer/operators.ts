export type Operator = (typeof operators)[number];

const operators = [
  "neg",
  "not",
  "plus",
  "subt",
  "mult",
  "divr",
  "div",
  "mod",
  "and",
  "or",
  "xor",
  "andl",
  "orl",
  "scat",
  "eqal",
  "noeq",
  "less",
  "more",
  "lseq",
  "mreq",
  "seql",
  "sneq",
  "sles",
  "smor",
  "sleq",
  "smeq",
] as const;

export default operators;
