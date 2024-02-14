import PCode from "../../constants/pcodes.ts";
import type { ColourValue } from "../../parser/definitions/expression.ts";
import type Program from "../../parser/definitions/program.ts";
import type { Options } from "../options.ts";

export default (exp: ColourValue, _program: Program, _options: Options): number[] => [PCode.ldin, exp.colour.value];
