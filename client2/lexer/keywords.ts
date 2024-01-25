export type Keyword =
  | Lowercase<typeof BASIC[number]>
  | typeof C[number]
  | typeof Java[number]
  | typeof Pascal[number]
  | typeof Python[number]
  | typeof TypeScript[number];

const BASIC = [
  // command structures
  "IF",
  "ELSE",
  "FOR",
  "REPEAT",
  "WHILE",
  "DEF",
  // variable scope modifiers
  "LOCAL",
  "PRIVATE",
  // other keywords (not shown in usage tables)
  "RETURN",
  "CONST",
  "DIM",
  "END",
  "ENDPROC",
  "THEN",
  "ENDIF",
  "TO",
  "STEP",
  "NEXT",
  "UNTIL",
  "ENDWHILE",
] as const;

const C = [
  // command structures
  "if",
  "else",
  "for",
  "while",
  "do",
  // other keywords (not shown in usage tables)
  "const",
  "return",
] as const;

const Java = [
  // command structures
  "if",
  "else",
  "for",
  "while",
  "do",
  // other keywords (not shown in usage tables)
  "class",
  "final",
  "return",
] as const;

const Pascal = [
  // command structures
  "if",
  "else",
  "for",
  "repeat",
  "while",
  "procedure",
  "function",
  // other keywords (not shown in usage tables)
  "program",
  "var",
  "const",
  "array",
  "of",
  "begin",
  "end",
  "then",
  "to",
  "downto",
  "do",
  "until",
] as const;

const Python = [
  // command structures
  "if",
  "else",
  "elif",
  "for",
  "while",
  "def",
  "try",
  "except",
  // variable scope modifiers
  "global",
  "nonlocal",
  // other keywords (not shown in usage tables)
  "in",
  "pass",
  "return",
] as const;

const TypeScript = [
  // command structures
  "if",
  "else",
  "for",
  "while",
  "do",
  "function",
  "try",
  "catch",
  // other keywords (not shown in usage tables)
  "var",
  "const",
  "return",
] as const;

export default {
  BASIC,
  C,
  Java,
  Pascal,
  Python,
  TypeScript,
} as const;
