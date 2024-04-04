import PCode from "../../constants/pcodes.ts";
import type { ConstantIndex } from "../../parser/definitions/expressions/constantIndex.ts";
import type { Program } from "../../parser/definitions/routines/program.ts";
import encodeExpression from "../expression.ts";
import merge from "../merge.ts";
import type { Options } from "../options.ts";

export default (
  expression: ConstantIndex,
  program: Program,
  options: Options
): number[][] => {
  // string constant
  if (expression.constantExpression.constant.type === "string") {
    const value = expression.constantExpression.constant.value;
    const pcode = [
      [PCode.lstr, value.length].concat(
        Array.from(value).map((x) => x.charCodeAt(0))
      ),
    ];
    const indexExpression = encodeExpression(
      expression.indexExpression,
      program,
      options
    );
    merge(pcode, indexExpression);
    if (program.language === "Pascal") {
      merge(pcode, [[PCode.decr]]); // Pascal indexes strings from 1 instead of 0
    }
    merge(pcode, [
      [PCode.swap, PCode.test, PCode.plus, PCode.incr, PCode.lptr],
    ]);
    return pcode;
  }

  // integer constant
  return [[PCode.ldin, expression.constantExpression.constant.value]];
};
