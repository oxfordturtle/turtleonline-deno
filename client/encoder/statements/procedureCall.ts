import PCode from "../../constants/pcodes.ts";
import { type Program } from "../../parser/definitions/routines/program.ts";
import { getParameters } from "../../parser/definitions/routines/subroutine.ts";
import type { ProcedureCall } from "../../parser/definitions/statements/procedureCall.ts";
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

  // Python "print" command is a special case...
  if (program.language === "Python" && stmt.command.__ === "Command" && stmt.command.names.Python === "print") {
    let newLine = true;
    for (const argument of stmt.arguments) {
      if (argument.expressionType === "namedArgument") {
        newLine = false;
      } else {
        merge(pcode, expression(argument, program, options));
        merge(pcode, [[PCode.writ]]);
      }
    }
    if (newLine) {
      merge(pcode, [[PCode.newl]]);
    }
    return pcode;
  }

  // first: load arguments onto the stack
  const parameters = stmt.command.__ === "Command" ? stmt.command.parameters : getParameters(stmt.command);
  for (let index = 0; index < parameters.length; index += 1) {
    const arg = stmt.arguments[index];
    const param = parameters[index];
    merge(pcode, expression(arg, program, options, param.isReferenceParameter));
  }

  // next: code for the command
  if (stmt.command.__ === "Subroutine") {
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
