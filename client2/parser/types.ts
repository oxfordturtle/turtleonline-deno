import type { Language } from "../constants/languages.ts";

export type Type = "boolint" | "boolean" | "integer" | "character" | "string";

export type Constant = {
  readonly __: "Constant";
  readonly name: string;
  readonly language: Language;
  value: number | string;
};

export type Expression =
  | IntegerValue
  | StringValue
  | InputValue
  | ColourValue
  | ConstantValue
  | VariableAddress
  | VariableValue
  | FunctionCall
  | CompoundExpression
  | CastExpression;
