import PCode from "../../constants/pcodes.ts";
import type Program from "../../parser/definitions/program.ts";
import type { WhileStatement } from "../../parser/definitions/statement.ts";
import expression from "../expression.ts";
import merge from "../merge.ts";
import type { Options } from "../options.ts";
import statement from "../statement.ts";

export default (
  stmt: WhileStatement,
  program: Program,
  startLine: number,
  options: Options
): number[][] => {
  const pcode: number[][] = [];

  // middle lines: pcode for all substatements
  for (const subStmt of stmt.statements) {
    const subStartLine = startLine + pcode.length + 1;
    pcode.push(...statement(subStmt, program, subStartLine, options));
  }

  // first lines: evalutate boolean expression; if false, jump out of the loop
  const condition = expression(stmt.condition, program, options);
  const nextLine = startLine + pcode.length + condition.length + 1; // +1 for last line
  merge(condition, [[PCode.ifno, nextLine]]);
  pcode.unshift(...condition);

  // last line: jump back to first line
  pcode.push([PCode.jump, startLine]);

  return pcode;
};
