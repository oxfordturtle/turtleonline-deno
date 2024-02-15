import type { Command } from "../../constants/commands.ts";
import type { IdentifierLexeme, KeywordLexeme, OperatorLexeme } from "../../lexer/lexeme.ts";
import type { Constant } from "./constant.ts";
import { compoundExpression, variableValue, type Expression } from "./expression.ts";
import type { Subroutine } from "./routine.ts";
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
export interface VariableAssignment {
  readonly __: "statement";
  readonly statementType: "variableAssignment";
  readonly lexeme: OperatorLexeme;
  readonly variable: Variable;
  readonly indexes: Expression[];
  readonly value: Expression;
};

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
export interface ProcedureCall {
  readonly __: "statement";
  readonly statementType: "procedureCall";
  readonly lexeme: IdentifierLexeme;
  readonly command: Subroutine | Command;
  readonly arguments: Expression[];
};

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
export interface IfStatement {
  readonly __: "statement";
  readonly statementType: "ifStatement";
  readonly lexeme: KeywordLexeme;
  readonly condition: Expression;
  readonly ifStatements: Statement[];
  readonly elseStatements: Statement[];
  readonly variables: Variable[];
  readonly constants: Constant[];
};

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
export interface ForStatement {
  readonly __: "statement";
  readonly statementType: "forStatement";
  readonly lexeme: KeywordLexeme;
  readonly initialisation: VariableAssignment;
  readonly condition: Expression;
  readonly change: VariableAssignment;
  readonly statements: Statement[];
  readonly variables: Variable[];
  readonly constants: Constant[];
};

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
export interface RepeatStatement {
  readonly __: "statement";
  readonly statementType: "repeatStatement";
  readonly lexeme: KeywordLexeme;
  readonly condition: Expression;
  readonly statements: Statement[];
  readonly variables: Variable[];
  readonly constants: Constant[];
};

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
export interface WhileStatement {
  readonly __: "statement";
  readonly statementType: "whileStatement";
  readonly lexeme: KeywordLexeme;
  readonly condition: Expression;
  readonly statements: Statement[];
  readonly variables: Variable[];
  readonly constants: Constant[];
};

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
export interface ReturnStatement {
  readonly __: "statement";
  readonly statementType: "returnStatement";
  readonly lexeme: KeywordLexeme | OperatorLexeme;
  readonly routine: Subroutine;
  readonly value: Expression;
};

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
export interface PassStatement {
  readonly __: "statement";
  readonly statementType: "passStatement";
};

export const passStatement = (): PassStatement => ({
  __: "statement",
  statementType: "passStatement",
});
