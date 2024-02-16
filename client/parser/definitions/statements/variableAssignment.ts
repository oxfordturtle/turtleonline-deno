import type { OperatorLexeme } from "../../../lexer/lexeme.ts";
import type { Expression } from "../expression.ts";
import makeCompoundExpression from "../expressions/compoundExpression.ts";
import makeVariableValue from "../expressions/variableValue.ts";
import type { Variable } from "../variable.ts";
import makeStatement, { type StatementCommon } from "../statement.ts";

export interface VariableAssignment extends StatementCommon {
  readonly statementType: "variableAssignment";
  readonly lexeme: OperatorLexeme;
  readonly variable: Variable;
  readonly indexes: Expression[];
  readonly value: Expression;
}

const makeVariableAssignment = (
  lexeme: OperatorLexeme,
  variable: Variable,
  indexes: Expression[],
  value: Expression
): VariableAssignment => {
  const variableAssignmentValue: Record<string, Expression> = {
    "+=": makeCompoundExpression(lexeme, makeVariableValue(lexeme, variable), value, "plus"),
    "-=": makeCompoundExpression(lexeme, makeVariableValue(lexeme, variable), value, "subt"),
  };

  return {
    ...makeStatement(),
    statementType: "variableAssignment",
    lexeme,
    variable,
    indexes,
    value: variableAssignmentValue[lexeme.content] ?? value,
  };
};

export default makeVariableAssignment;
