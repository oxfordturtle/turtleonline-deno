export type Delimiter = (typeof delimiters)[number];

const delimiters = [
  "(",
  ")",
  "{",
  "}",
  "[",
  "]",
  ",",
  ":",
  ";",
  ".",
  "..",
  "->",
] as const;

export default delimiters;
