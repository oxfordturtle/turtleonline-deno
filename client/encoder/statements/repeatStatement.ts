import PCode from "../../constants/pcodes.ts";
import type Program from "../../parser/definitions/program.ts";
import type { RepeatStatement } from "../../parser/definitions/statement.ts";
import expression from "../expression.ts";
import merge from "../merge.ts";
import type { Options } from "../options.ts";
import statement from "../statement.ts";

export default (
  stmt: RepeatStatement,
  program: Program,
  startLine: number,
  options: Options
): number[][] => {
  const pcode: number[][] = [];

  // first lines: pcode for all substatements
  for (const subStmt of stmt.statements) {
    const subStartLine = startLine + pcode.length;
    pcode.push(...statement(subStmt, program, subStartLine, options));
  }

  // last line: evaluate boolean expression; if false, jump back to start
  const condition = expression(stmt.condition, program, options);
  merge(condition, [[PCode.ifno, startLine]]);
  pcode.push(...condition);

  // return the pcode
  return pcode;
};
