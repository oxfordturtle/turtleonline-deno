import PCode from "../../constants/pcodes.ts";
import { getParameters, type Program } from "../../parser/definitions/routine.ts";
import type { ProcedureCall } from "../../parser/definitions/statement.ts";
import { turtleAddress } from "../addresses.ts";
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
  const parameters = stmt.command.__ === "command" ? stmt.command.parameters : getParameters(stmt.command);
  for (let index = 0; index < parameters.length; index += 1) {
    const arg = stmt.arguments[index];
    const param = parameters[index];
    merge(pcode, expression(arg, program, options, param.isReferenceParameter));
  }

  // next: code for the command
  if (stmt.command.__ === "subroutine") {
    // custom commands
    // N.B. use command index as placeholder for now; this will be back-patched
    // when compilation is otherwise complete
    merge(pcode, [[PCode.subr, stmt.command.index]]);
  } else {
    // native commands
    merge(pcode, [stmt.command.code(turtleAddress(program))]);
  }

  return pcode;
};
