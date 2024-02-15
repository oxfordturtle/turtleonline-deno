import PCode from "../../constants/pcodes.ts";
import { type IntegerValue } from "../../parser/definitions/expression.ts";
import type { Program } from "../../parser/definitions/routine.ts";
import type { Options } from "../options.ts";

export default (exp: IntegerValue, _program: Program, _options: Options): number[] => [
  PCode.ldin,
  exp.value,
];
