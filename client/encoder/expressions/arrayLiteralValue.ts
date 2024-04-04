import { CompilerError } from "../../tools/error.ts";
import type { ArrayLiteralValue } from "../../parser/definitions/expressions/arrayLiteralValue.ts";
import type { Program } from "../../parser/definitions/routines/program.ts";
import type { Options } from "../options.ts";

export default (expression: ArrayLiteralValue, _program: Program, _options: Options): number[] => {
  console.log(expression);
  throw new CompilerError("Array literals are not yet supported");
};
