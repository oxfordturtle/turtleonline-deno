import type { Command } from "../../constants/commands.ts";
import type { IdentifierLexeme, KeywordLexeme, OperatorLexeme } from "../../lexer/lexeme.ts";
import type { Constant } from "./constant.ts";
import { CompoundExpression, VariableValue, type Expression } from "./expression.ts";
import type { Subroutine } from "./subroutine.ts";
import type { Variable } from "./variable.ts";

/** statement */
export type Statement =
  | VariableAssignment
  | ProcedureCall
  | IfStatement
  | ForStatement
  | RepeatStatement
  | WhileStatement
  | ReturnStatement
  | PassStatement;

/** variable assignment */
export class VariableAssignment {
  readonly __ = "statement";
  readonly statementType = "variableAssignment";
  readonly lexeme: OperatorLexeme;
  readonly variable: Variable;
  readonly indexes: Expression[];
  readonly value: Expression;

  /** constructor */
  constructor(
    lexeme: OperatorLexeme,
    variable: Variable,
    indexes: Expression[],
    value: Expression
  ) {
    this.lexeme = lexeme;
    this.variable = variable;
    this.indexes = indexes;
    switch (lexeme.content) {
      case "+=":
        this.value = new CompoundExpression(
          lexeme,
          new VariableValue(lexeme as any, variable),
          value,
          "plus"
        );
        break;
      case "-=":
        this.value = new CompoundExpression(
          lexeme,
          new VariableValue(lexeme as any, variable),
          value,
          "subt"
        );
        break;
      default:
        this.value = value;
        break;
    }
  }
}

/** procedure call */
export class ProcedureCall {
  readonly __ = "statement";
  readonly statementType = "procedureCall";
  readonly lexeme: IdentifierLexeme;
  readonly command: Subroutine | Command;
  readonly arguments: Expression[] = [];

  constructor(lexeme: IdentifierLexeme, command: Subroutine | Command) {
    this.lexeme = lexeme;
    this.command = command;
  }
}

/** if statement */
export class IfStatement {
  readonly __ = "statement";
  readonly statementType = "ifStatement";
  readonly lexeme: KeywordLexeme;
  readonly condition: Expression;
  readonly ifStatements: Statement[] = [];
  readonly elseStatements: Statement[] = [];
  readonly variables: Variable[] = [];
  readonly constants: Constant[] = [];

  constructor(lexeme: KeywordLexeme, condition: Expression) {
    this.lexeme = lexeme;
    this.condition = condition;
  }
}

/** for statement */
export class ForStatement {
  readonly __ = "statement";
  readonly statementType = "forStatement";
  readonly lexeme: KeywordLexeme;
  readonly initialisation: VariableAssignment;
  readonly condition: Expression;
  readonly change: VariableAssignment;
  readonly statements: Statement[] = [];
  readonly variables: Variable[] = [];
  readonly constants: Constant[] = [];

  constructor(
    lexeme: KeywordLexeme,
    initialisation: VariableAssignment,
    condition: Expression,
    change: VariableAssignment
  ) {
    this.lexeme = lexeme;
    this.initialisation = initialisation;
    this.condition = condition;
    this.change = change;
  }
}

/** repeat statement */
export class RepeatStatement {
  readonly __ = "statement";
  readonly statementType = "repeatStatement";
  readonly lexeme: KeywordLexeme;
  readonly condition: Expression;
  readonly statements: Statement[] = [];
  readonly variables: Variable[] = [];
  readonly constants: Constant[] = [];

  constructor(lexeme: KeywordLexeme, condition: Expression) {
    this.lexeme = lexeme;
    this.condition = condition;
  }
}

/** while statement */
export class WhileStatement {
  readonly __ = "statement";
  readonly statementType = "whileStatement";
  readonly lexeme: KeywordLexeme;
  readonly condition: Expression;
  readonly statements: Statement[] = [];
  readonly variables: Variable[] = [];
  readonly constants: Constant[] = [];

  constructor(lexeme: KeywordLexeme, condition: Expression) {
    this.lexeme = lexeme;
    this.condition = condition;
  }
}

/** return statement */
export class ReturnStatement {
  readonly __ = "statement";
  readonly statementType = "returnStatement";
  readonly lexeme: KeywordLexeme | OperatorLexeme; // "=" operator in BASIC, "return" keyword in other languages
  readonly routine: Subroutine;
  readonly value: Expression;

  constructor(lexeme: KeywordLexeme | OperatorLexeme, routine: Subroutine, value: Expression) {
    this.lexeme = lexeme;
    this.routine = routine;
    this.value = value;
  }
}

/** pass statement */
export class PassStatement {
  readonly __ = "statement";
  readonly statementType = "passStatement";
}
