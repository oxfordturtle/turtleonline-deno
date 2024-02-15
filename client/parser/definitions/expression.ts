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
import { getResultType, type Subroutine } from "./routine.ts";
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

export interface IntegerValue {
  readonly __: "expression";
  readonly expressionType: "integer";
  readonly lexeme: BooleanLexeme | CharacterLexeme | IntegerLexeme;
  readonly type: "boolean" | "character" | "integer";
  readonly value: number;
};

export const integerValue = (
  lexeme: BooleanLexeme | CharacterLexeme | IntegerLexeme
): IntegerValue => ({
  __: "expression",
  expressionType: "integer",
  lexeme,
  type: lexeme.subtype,
  value: lexeme.value,
});

export interface StringValue {
  readonly __: "expression";
  readonly expressionType: "string";
  readonly lexeme: StringLexeme;
  readonly type: "string";
  readonly value: string;
};

export const stringValue = (lexeme: StringLexeme): StringValue => ({
  __: "expression",
  expressionType: "string",
  lexeme,
  type: "string",
  value: lexeme.value,
});

export interface InputValue {
  readonly __: "expression";
  readonly expressionType: "input";
  readonly lexeme: InputCodeLexeme | QueryCodeLexeme;
  readonly type: "integer";
  readonly input: Input;
};

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

export interface ColourValue {
  readonly __: "expression";
  readonly expressionType: "colour";
  readonly lexeme: IdentifierLexeme;
  readonly type: "integer";
  readonly colour: Colour;
};

export const colourValue = (lexeme: IdentifierLexeme, colour: Colour): ColourValue => ({
  __: "expression",
  expressionType: "colour",
  lexeme,
  type: "integer",
  colour,
});

export interface ConstantValue {
  readonly __: "expression";
  readonly expressionType: "constant";
  readonly lexeme: IdentifierLexeme;
  readonly constant: Constant;
  readonly indexes: Expression[];
};

export const constantValue = (lexeme: IdentifierLexeme, constant: Constant): ConstantValue => ({
  __: "expression",
  expressionType: "constant",
  lexeme,
  constant,
  indexes: [],
});

export interface VariableAddress {
  readonly __: "expression";
  readonly expressionType: "address";
  readonly lexeme: IdentifierLexeme | OperatorLexeme;
  readonly variable: Variable;
  readonly indexes: Expression[];
  readonly type: "integer";
};

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

export interface VariableValue {
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

export interface FunctionCall {
  readonly __: "expression";
  readonly expressionType: "function";
  readonly lexeme: IdentifierLexeme;
  readonly command: Subroutine | Command;
  readonly type: Type;
  readonly arguments: Expression[];
};

export const functionCall = (
  lexeme: IdentifierLexeme,
  command: Subroutine | Command
): FunctionCall => ({
  __: "expression",
  expressionType: "function",
  lexeme,
  command,
  type: command.__ === "Command" ? command.returns! : getResultType(command)!, // function calls should only ever be created with functions
  arguments: [],
});

export interface CompoundExpression {
  readonly __: "expression";
  readonly expressionType: "compound";
  readonly lexeme: OperatorLexeme;
  readonly left: Expression | null; // left hand side optional (for unary operators 'not' and 'minus')
  readonly right: Expression;
  readonly operator: Operator;
  readonly type: Type;
};

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

export interface CastExpression {
  readonly __: "expression";
  readonly expressionType: "cast";
  readonly lexeme: Lexeme;
  readonly type: Type;
  readonly expression: Expression;
};

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
