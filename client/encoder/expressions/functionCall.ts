import PCode from "../../constants/pcodes.ts";
import type { FunctionCall } from "../../parser/definitions/expressions/functionCall.ts";
import type { Program } from "../../parser/definitions/routines/program.ts";
import {
  getParameters,
  getResultType,
} from "../../parser/definitions/routines/subroutine.ts";
import { resultAddress, turtleAddress } from "../addresses.ts";
import expression from "../expression.ts";
import merge from "../merge.ts";
import type { Options } from "../options.ts";

export default (
  exp: FunctionCall,
  program: Program,
  options: Options
): number[][] => {
  const pcode: number[][] = [];

  // first: load arguments onto stack
  const parameters =
    exp.command.__ === "Command"
      ? exp.command.parameters
      : getParameters(exp.command);
  for (let index = 0; index < parameters.length; index += 1) {
    const arg = exp.arguments[index];
    const param = parameters[index];
    merge(pcode, expression(arg, program, options, param.isReferenceParameter));
  }

  // next: code for the function
  if (exp.command.__ === "Subroutine") {
    // custom functions
    // N.B. use command index as placeholder for now; this will be back-patched
    // when compilation is otherwise complete
    merge(pcode, [[PCode.subr, exp.command.index]]);
  } else {
    // native functions
    // copy the command.code array so it isn't modified subsequently
    merge(pcode, [exp.command.code(turtleAddress(program))]);
  }

  // custom functions: load the result variable onto the stack
  if (exp.command.__ === "Subroutine") {
    // push, don't merge; anything after the subroutine call must be on a new line
    pcode.push([PCode.ldvv, resultAddress(program), 1]);
    if (getResultType(exp.command) === "string") {
      merge(pcode, [[PCode.hstr]]);
    }
  }

  // return the pcode
  return pcode;
};
