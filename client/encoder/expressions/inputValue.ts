import PCode from "../../constants/pcodes.ts";
import type { InputValue } from "../../parser/definitions/expressions/inputValue.ts";
import type { Program } from "../../parser/definitions/routines/program.ts";
import type { Options } from "../options.ts";

export default (exp: InputValue, _program: Program, _options: Options): number[] =>
  exp.input.value < 0 ? [PCode.ldin, exp.input.value, PCode.stat] : [PCode.ldin, exp.input.value];
