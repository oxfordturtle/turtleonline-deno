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

/** constant */
// export class Constant {
//   readonly __ = "constant";
//   readonly name: string;
//   readonly language: Language;
//   value: number | string;

//   constructor(language: Language, name: string, value: number | string) {
//     this.name = language === "Pascal" ? name.toLowerCase() : name;
//     this.language = language;
//     this.value = value;
//   }

//   get type(): Type {
//     return typeof this.value === "number" ? "boolint" : "string";
//   }
// }
