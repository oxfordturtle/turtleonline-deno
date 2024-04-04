import PCode from "../../constants/pcodes.ts";
import type { ConstantValue } from "../../parser/definitions/expressions/constantValue.ts";
import type { Program } from "../../parser/definitions/routines/program.ts";
import type { Options } from "../options.ts";

export default (
  expression: ConstantValue,
  _program: Program,
  _options: Options
): number[][] =>
  expression.constant.type === "string"
    ? [
        [PCode.lstr, expression.constant.value.length].concat(
          Array.from(expression.constant.value).map((x) => x.charCodeAt(0))
        ),
      ]
    : [[PCode.ldin, expression.constant.value]];
