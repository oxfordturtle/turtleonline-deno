import type { Language } from "../../constants/languages.ts";
import type { Type } from "../../lexer/types.ts";

export type Constant = Readonly<{
  __: "constant";
  name: string;
  language: Language;
  value: number | string;
  type: Type;
}>;

export default (language: Language, name: string, value: number | string): Constant =>
  ({
    __: "constant",
    name,
    language,
    value,
    type: typeof value === "number" ? "boolint" : "string" satisfies Type,
  } as const);
