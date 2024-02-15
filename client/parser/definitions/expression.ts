import type { Colour } from "../../constants/colours.ts";
import type { Command } from "../../constants/commands.ts";
import type { Input } from "../../constants/inputs.ts";
import type {
  BooleanLexeme,
  CharacterLexeme,
  IdentifierLexeme,
  InputCodeLexeme,
  IntegerLexeme,
  Lexeme,
  OperatorLexeme,
  QueryCodeLexeme,
  StringLexeme,
} from "../../lexer/lexeme.ts";
import type { Operator, Type } from "../../lexer/types.ts";
import type { Constant } from "./constant.ts";
import { operatorType } from "./operators.ts";
import type { Subroutine } from "./subroutine.ts";
import type { Variable } from "./variable.ts";

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

export const getType = (expression: Expression): Type => {
  const languagesWithCharacterType = ["C", "Java", "Pascal"];
  switch (expression.expressionType) {
    case "constant":
      // type is not known in advance, as it depends on expression.indexes.length
      if (languagesWithCharacterType.includes(expression.constant.language)) {
        return expression.constant.type === "string" && expression.indexes.length > 0
          ? "character"
          : expression.constant.type;
      }
      return expression.constant.type;
    case "variable":
      // type is not known in advance, as it depends on expression.indexes.length
      return languagesWithCharacterType.includes(expression.variable.routine.language)
        ? expression.variable.type === "string" &&
          expression.indexes.length > expression.variable.arrayDimensions.length
          ? "character"
          : expression.variable.type
        : expression.variable.type;
    default:
      return expression.type;
  }
};

export type IntegerValue = Readonly<{
  __: "expression";
  expressionType: "integer";
  lexeme: BooleanLexeme | CharacterLexeme | IntegerLexeme;
  type: "boolean" | "character" | "integer";
  value: number;
}>;

export const integerValue = (
  lexeme: BooleanLexeme | CharacterLexeme | IntegerLexeme
): IntegerValue => ({
  __: "expression",
  expressionType: "integer",
  lexeme,
  type: lexeme.subtype,
  value: lexeme.value,
});

export type StringValue = Readonly<{
  __: "expression";
  expressionType: "string";
  lexeme: StringLexeme;
  type: "string";
  value: string;
}>;

export const stringValue = (lexeme: StringLexeme): StringValue => ({
  __: "expression",
  expressionType: "string",
  lexeme,
  type: "string",
  value: lexeme.value,
});

export type InputValue = Readonly<{
  __: "expression";
  expressionType: "input";
  lexeme: InputCodeLexeme | QueryCodeLexeme;
  type: "integer";
  input: Input;
}>;

export const inputValue = (
  lexeme: InputCodeLexeme | QueryCodeLexeme,
  input: Input
): InputValue => ({
  __: "expression",
  expressionType: "input",
  lexeme,
  type: "integer",
  input,
});

export type ColourValue = Readonly<{
  __: "expression";
  expressionType: "colour";
  lexeme: IdentifierLexeme;
  type: "integer";
  colour: Colour;
}>;

export const colourValue = (lexeme: IdentifierLexeme, colour: Colour): ColourValue => ({
  __: "expression",
  expressionType: "colour",
  lexeme,
  type: "integer",
  colour,
});

export type ConstantValue = Readonly<{
  __: "expression";
  expressionType: "constant";
  lexeme: IdentifierLexeme;
  constant: Constant;
  indexes: Expression[];
}>;

export const constantValue = (lexeme: IdentifierLexeme, constant: Constant): ConstantValue => ({
  __: "expression",
  expressionType: "constant",
  lexeme,
  constant,
  indexes: [],
});

export type VariableAddress = Readonly<{
  __: "expression";
  expressionType: "address";
  lexeme: IdentifierLexeme | OperatorLexeme;
  variable: Variable;
  indexes: Expression[];
  type: "integer";
}>;

export const variableAddress = (
  lexeme: IdentifierLexeme | OperatorLexeme,
  variable: Variable
): VariableAddress => ({
  __: "expression",
  expressionType: "address",
  lexeme,
  variable,
  indexes: [],
  type: "integer",
});

export type VariableValue = {
  readonly __: "expression";
  readonly expressionType: "variable";
  readonly lexeme: IdentifierLexeme | OperatorLexeme; // can be "+=" or "-=" operators in a variable assignment
  readonly variable: Variable;
  slice: [Expression, Expression] | null; // for string/array slices, TODO: make readonly
  readonly indexes: Expression[]; // for elements of array variables
  readonly type: Type;
};

export const variableValue = (
  lexeme: IdentifierLexeme | OperatorLexeme,
  variable: Variable
): VariableValue => ({
  __: "expression",
  expressionType: "variable",
  lexeme,
  variable,
  slice: null,
  indexes: [],
  type: variable.type,
});

export type FunctionCall = Readonly<{
  __: "expression";
  expressionType: "function";
  lexeme: IdentifierLexeme;
  command: Subroutine | Command;
  type: Type;
  arguments: Expression[];
}>;

export const functionCall = (
  lexeme: IdentifierLexeme,
  command: Subroutine | Command
): FunctionCall => ({
  __: "expression",
  expressionType: "function",
  lexeme,
  command,
  type: command.returns!, // function calls should only ever be created with functions
  arguments: [],
});

export type CompoundExpression = Readonly<{
  __: "expression";
  expressionType: "compound";
  lexeme: OperatorLexeme;
  left: Expression | null; // left hand side optional (for unary operators 'not' and 'minus')
  right: Expression;
  operator: Operator;
  type: Type;
}>;

export const compoundExpression = (
  lexeme: OperatorLexeme,
  left: Expression | null,
  right: Expression,
  operator: Operator
): CompoundExpression => ({
  __: "expression",
  expressionType: "compound",
  lexeme,
  left,
  right,
  operator,
  type: operatorType[operator],
});

export type CastExpression = Readonly<{
  __: "expression";
  expressionType: "cast";
  lexeme: Lexeme;
  type: Type;
  expression: Expression;
}>;

export const castExpression = (
  lexeme: Lexeme,
  type: Type,
  expression: Expression
): CastExpression => ({
  __: "expression",
  expressionType: "cast",
  lexeme,
  type,
  expression,
});
