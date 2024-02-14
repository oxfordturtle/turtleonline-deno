import type Program from "../parser/definitions/program.ts";
import type { Statement } from "../parser/definitions/statement.ts";
import type { Options } from "./options.ts";
import forStatement from "./statements/forStatement.ts";
import ifStatement from "./statements/ifStatement.ts";
import procedureCall from "./statements/procedureCall.ts";
import repeatStatement from "./statements/repeatStatement.ts";
import returnStatement from "./statements/returnStatement.ts";
import variableAssignment from "./statements/variableAssignment.ts";
import whileStatement from "./statements/whileStatement.ts";

export default (
  stmt: Statement,
  program: Program,
  startLine: number,
  options: Options
): number[][] => {
  switch (stmt.statementType) {
    case "variableAssignment":
      return variableAssignment(stmt, program, startLine, options);
    case "procedureCall":
      return procedureCall(stmt, program, startLine, options);
    case "ifStatement":
      return ifStatement(stmt, program, startLine, options);
    case "forStatement":
      return forStatement(stmt, program, startLine, options);
    case "repeatStatement":
      return repeatStatement(stmt, program, startLine, options);
    case "whileStatement":
      return whileStatement(stmt, program, startLine, options);
    case "returnStatement":
      return returnStatement(stmt, program, startLine, options);
    case "passStatement":
      return [];
  }
};
