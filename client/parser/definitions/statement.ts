import type { Command } from "../../constants/commands.ts";
import type { IdentifierLexeme, KeywordLexeme, OperatorLexeme } from "../../lexer/lexeme.ts";
import type { Constant } from "./constant.ts";
import { compoundExpression, variableValue, type Expression } from "./expression.ts";
import type { Subroutine } from "./subroutine.ts";
import type { Variable } from "./variable.ts";

export type Statement =
  | VariableAssignment
  | ProcedureCall
  | IfStatement
  | ForStatement
  | RepeatStatement
  | WhileStatement
  | ReturnStatement
  | PassStatement;

// variable assignment
export type VariableAssignment = Readonly<{
  __: "statement";
  statementType: "variableAssignment";
  lexeme: OperatorLexeme;
  variable: Variable;
  indexes: Expression[];
  value: Expression;
}>;

export const variableAssignment = (
  lexeme: OperatorLexeme,
  variable: Variable,
  indexes: Expression[],
  value: Expression
): VariableAssignment => {
  const variableAssignmentValue: Record<string, Expression> = {
    "+=": compoundExpression(lexeme, variableValue(lexeme, variable), value, "plus"),
    "-=": compoundExpression(lexeme, variableValue(lexeme, variable), value, "subt"),
  };

  return {
    __: "statement",
    statementType: "variableAssignment",
    lexeme,
    variable,
    indexes,
    value: variableAssignmentValue[lexeme.content] ?? value,
  };
};

// procedure call
export type ProcedureCall = Readonly<{
  __: "statement";
  statementType: "procedureCall";
  lexeme: IdentifierLexeme;
  command: Subroutine | Command;
  arguments: Expression[];
}>;

export const procedureCall = (
  lexeme: IdentifierLexeme,
  command: Subroutine | Command
): ProcedureCall =>
  ({
    __: "statement",
    statementType: "procedureCall",
    lexeme,
    command,
    arguments: [] as Expression[],
  } as const);

// if statement
export type IfStatement = Readonly<{
  __: "statement";
  statementType: "ifStatement";
  lexeme: KeywordLexeme;
  condition: Expression;
  ifStatements: Statement[];
  elseStatements: Statement[];
  variables: Variable[];
  constants: Constant[];
}>;

export const ifStatement = (lexeme: KeywordLexeme, condition: Expression): IfStatement => ({
  __: "statement",
  statementType: "ifStatement",
  lexeme,
  condition,
  ifStatements: [],
  elseStatements: [],
  variables: [],
  constants: [],
});

// for statement
export type ForStatement = Readonly<{
  __: "statement";
  statementType: "forStatement";
  lexeme: KeywordLexeme;
  initialisation: VariableAssignment;
  condition: Expression;
  change: VariableAssignment;
  statements: Statement[];
  variables: Variable[];
  constants: Constant[];
}>;

export const forStatement = (
  lexeme: KeywordLexeme,
  initialisation: VariableAssignment,
  condition: Expression,
  change: VariableAssignment
): ForStatement => ({
  __: "statement",
  statementType: "forStatement",
  lexeme,
  initialisation,
  condition,
  change,
  statements: [],
  variables: [],
  constants: [],
});

// repeat statement
export type RepeatStatement = Readonly<{
  __: "statement";
  statementType: "repeatStatement";
  lexeme: KeywordLexeme;
  condition: Expression;
  statements: Statement[];
  variables: Variable[];
  constants: Constant[];
}>;

export const repeatStatement = (lexeme: KeywordLexeme, condition: Expression): RepeatStatement => ({
  __: "statement",
  statementType: "repeatStatement",
  lexeme,
  condition,
  statements: [],
  variables: [],
  constants: [],
});

// while statement
export type WhileStatement = Readonly<{
  __: "statement";
  statementType: "whileStatement";
  lexeme: KeywordLexeme;
  condition: Expression;
  statements: Statement[];
  variables: Variable[];
  constants: Constant[];
}>;

export const whileStatement = (lexeme: KeywordLexeme, condition: Expression): WhileStatement => ({
  __: "statement",
  statementType: "whileStatement",
  lexeme,
  condition,
  statements: [],
  variables: [],
  constants: [],
});

// return statement
export type ReturnStatement = Readonly<{
  __: "statement";
  statementType: "returnStatement";
  lexeme: KeywordLexeme | OperatorLexeme;
  routine: Subroutine;
  value: Expression;
}>;

export const returnStatement = (
  lexeme: KeywordLexeme | OperatorLexeme,
  routine: Subroutine,
  value: Expression
): ReturnStatement => ({
  __: "statement",
  statementType: "returnStatement",
  lexeme,
  routine,
  value,
});

// pass statement
export type PassStatement = Readonly<{
  __: "statement";
  statementType: "passStatement";
}>;

export const passStatement = (): PassStatement => ({
  __: "statement",
  statementType: "passStatement",
});
