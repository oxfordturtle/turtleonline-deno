import type Program from "../../parser/definitions/program.ts";
import type { Subroutine } from "../../parser/definitions/subroutine.ts";
import type { Options } from "../options.ts";
import statement from "../statement.ts";

export default (routine: Program | Subroutine, startLine: number, options: Options): number[][] => {
  const program = routine.__ === "subroutine" ? routine.program : routine;
  const pcode: number[][] = [];
  for (const stmt of routine.statements) {
    pcode.push(...statement(stmt, program, startLine + pcode.length, options));
  }
  return pcode;
};
