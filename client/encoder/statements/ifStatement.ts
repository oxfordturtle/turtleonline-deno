import PCode from "../../constants/pcodes.ts";
import type Program from "../../parser/definitions/program.ts";
import type { IfStatement } from "../../parser/definitions/statement.ts";
import expression from "../expression.ts";
import merge from "../merge.ts";
import type { Options } from "../options.ts";
import statement from "../statement.ts";

export default (
  stmt: IfStatement,
  program: Program,
  startLine: number,
  options: Options
): number[][] => {
  const firstLines = expression(stmt.condition, program, options);

  // inner lines: pcode for all IF substatements
  const ifPcode: number[][] = [];
  for (const subStmt of stmt.ifStatements) {
    const subStartLine = startLine + ifPcode.length + firstLines.length;
    ifPcode.push(...statement(subStmt, program, subStartLine, options));
  }

  // more inner lines: pcode for all ELSE statements
  const elsePcode: number[][] = [];
  for (const subStmt of stmt.elseStatements) {
    const subStartLine = startLine + ifPcode.length + elsePcode.length + firstLines.length + 1;
    elsePcode.push(...statement(subStmt, program, subStartLine, options));
  }

  // plain IF statement
  if (elsePcode.length === 0) {
    // first lines: evaluate condition; if false, jump past all IF statements
    merge(firstLines, [[PCode.ifno, startLine + ifPcode.length + firstLines.length]]);
    ifPcode.unshift(...firstLines);
    return ifPcode;
  }

  // IF-ELSE statement
  // first lines: evaluate condition; if false, jump past all IF statements and ELSE jump
  merge(firstLines, [[PCode.ifno, startLine + ifPcode.length + firstLines.length + 1]]);

  // middle line: jump past ELSE statements (at end of IF statements)
  const middleLine = [
    PCode.jump,
    startLine + ifPcode.length + elsePcode.length + firstLines.length + 1,
  ];

  ifPcode.unshift(...firstLines);
  ifPcode.push(middleLine);
  return ifPcode.concat(elsePcode);
};
