import type { Language } from "../../constants/languages.ts";

export type Constant = IntegerConstant | StringConstant;

interface ConstantCommon {
  readonly __: "constant";
  readonly name: string;
  readonly language: Language;
}

export interface IntegerConstant extends ConstantCommon {
  readonly value: number;
  readonly type: "boolint";
}

export interface StringConstant extends ConstantCommon {
  readonly value: string;
  readonly type: "string";
}

const makeConstant = (
  language: Language,
  name: string,
  value: number | string
): Constant =>
  typeof value === "number"
    ? { __: "constant", name, language, value, type: "boolint" }
    : { __: "constant", name, language, value, type: "string" };

export default makeConstant;
