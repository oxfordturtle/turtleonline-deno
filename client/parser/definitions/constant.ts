import type { Language } from "../../constants/languages.ts";
import type { Type } from "../../lexer/types.ts";

export type Constant = ReturnType<typeof constant>;

const constant = (language: Language, name: string, value: number | string) =>
  ({
    __: "constant",
    name,
    language,
    value,
    type: typeof value === "number" ? "boolint" : "string" satisfies Type,
  } as const);

export default constant;

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
