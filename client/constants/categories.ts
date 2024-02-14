import type { Subroutine } from "../parser/definitions/subroutine.ts";
import commands, { type Command } from "./commands.ts";
import keywords, { type Keyword } from "./keywords.ts";

export type Expression = Command | Keyword | Subroutine;

export type Category<Exp extends Expression> = ReturnType<typeof category<Exp>>;

export const category = <Exp extends Expression>(
  index: number,
  title: string,
  expressions: ReadonlyArray<Exp>
) =>
  ({
    __: "category",
    index,
    title,
    expressions,
  } as const);

export const commandCategories = [
  category(
    0,
    "Turtle: relative movement",
    commands.filter((x) => x.category === 0)
  ),
  category(
    1,
    "Turtle: absolute movement",
    commands.filter((x) => x.category === 1)
  ),
  category(
    2,
    "Turtle: drawing shapes",
    commands.filter((x) => x.category === 2)
  ),
  category(
    3,
    "Other Turtle commands",
    commands.filter((x) => x.category === 3)
  ),
  category(
    4,
    "Canvas operations",
    commands.filter((x) => x.category === 4)
  ),
  category(
    5,
    "General arithmetic functions",
    commands.filter((x) => x.category === 5)
  ),
  category(
    6,
    "Trig / exp / log functions",
    commands.filter((x) => x.category === 6)
  ),
  category(
    7,
    "String operations",
    commands.filter((x) => x.category === 7)
  ),
  category(
    8,
    "Type conversion routines",
    commands.filter((x) => x.category === 8)
  ),
  category(
    9,
    "Input and timing routines",
    commands.filter((x) => x.category === 9)
  ),
  category(
    10,
    "File processing",
    commands.filter((x) => x.category === 10)
  ),
  category(
    11,
    "Turtle Machine monitoring",
    commands.filter((x) => x.category === 11)
  ),
] as const;

export const keywordCategories = {
  BASIC: [
    category(
      20,
      "Command structures",
      keywords.BASIC.filter((x) => x.category === 20)
    ),
    category(
      21,
      "Variable scope modifiers",
      keywords.BASIC.filter((x) => x.category === 21)
    ),
  ],
  C: [
    category(
      20,
      "Command structures",
      keywords.C.filter((x) => x.category === 20)
    ),
  ],
  Java: [
    category(
      20,
      "Command structures",
      keywords.Java.filter((x) => x.category === 20)
    ),
  ],
  Pascal: [
    category(
      20,
      "Command structures",
      keywords.Pascal.filter((x) => x.category === 20)
    ),
  ],
  Python: [
    category(
      20,
      "Command structures",
      keywords.Python.filter((x) => x.category === 20)
    ),
    category(
      21,
      "Variable scope modifiers",
      keywords.Python.filter((x) => x.category === 21)
    ),
  ],
  TypeScript: [
    category(
      20,
      "Command structures",
      keywords.TypeScript.filter((x) => x.category === 20)
    ),
  ],
} as const;
