import PCode from "../../constants/pcodes.ts";
import type { Program } from "../../parser/definitions/routine.ts";
import type { ForStatement } from "../../parser/definitions/statement.ts";
import expression from "../expression.ts";
import merge from "../merge.ts";
import type { Options } from "../options.ts";
import statement from "../statement.ts";
import variableAssignment from "./variableAssignment.ts";

export default (
  stmt: ForStatement,
  program: Program,
  startLine: number,
  options: Options
): number[][] => {
  const pcode: number[][] = [];

  // middle lines: pcode for all substatements
  for (const subStmt of stmt.statements) {
    const subStartLine = startLine + pcode.length + 2;
    pcode.push(...statement(subStmt, program, subStartLine, options));
  }

  // second lines: loop condition
  const condition = expression(stmt.condition, program, options);
  merge(condition, [[PCode.ifno, startLine + pcode.length + condition.length + 2]]);
  pcode.unshift(...condition);

  // first lines: initialise loop variable
  pcode.unshift(...variableAssignment(stmt.initialisation, program, startLine, options));

  // last lines: modify loop variable, then jump back to second lines (loop test)
  pcode.push(...variableAssignment(stmt.change, program, startLine, options));
  merge(pcode, [[PCode.jump, startLine + 1]]);

  return pcode;
};
