import PCode from "../../constants/pcodes.ts";
import type Program from "../../parser/definitions/program.ts";
import type { ProcedureCall } from "../../parser/definitions/statement.ts";
import expression from "../expression.ts";
import merge from "../merge.ts";
import type { Options } from "../options.ts";

export default (
  stmt: ProcedureCall,
  program: Program,
  _startLine: number,
  options: Options
): number[][] => {
  const pcode: number[][] = [];

  // first: load arguments onto the stack
  for (let index = 0; index < stmt.command.parameters.length; index += 1) {
    const arg = stmt.arguments[index];
    const param = stmt.command.parameters[index];
    merge(pcode, expression(arg, program, options, param.isReferenceParameter));
  }

  // next: code for the command
  if (stmt.command.__ === "subroutine") {
    // custom commands
    // N.B. use command index as placeholder for now; this will be backpatched
    // when compilation is otherwise complete
    merge(pcode, [[PCode.subr, stmt.command.index]]);
  } else {
    // native commands
    merge(pcode, [stmt.command.code(program.turtleAddress)]);
  }

  return pcode;
};
