import PCode from "../../constants/pcodes.ts";
import { type StringValue } from "../../parser/definitions/expression.ts";
import type { Program } from "../../parser/definitions/routine.ts";
import type { Options } from "../options.ts";

export default (exp: StringValue, _program: Program, _options: Options): number[] =>
  [PCode.lstr, exp.value.length].concat(Array.from(exp.value).map((x) => x.charCodeAt(0)));
