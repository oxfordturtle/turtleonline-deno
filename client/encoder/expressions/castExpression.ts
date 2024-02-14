import PCode from "../../constants/pcodes.ts";
import type { CastExpression } from "../../parser/definitions/expression.ts";
import type Program from "../../parser/definitions/program.ts";
import expression from "../expression.ts";
import merge from "../merge.ts";
import type { Options } from "../options.ts";

export default (exp: CastExpression, program: Program, options: Options): number[][] => {
  // generate the code for the underlying expression
  const pcode = expression(exp.expression, program, options);

  // add type casting as necessary
  if (exp.expression.type === "character" && exp.type === "string") {
    merge(pcode, [[PCode.ctos]]);
  }
  if (exp.expression.type === "integer" && exp.type === "string") {
    merge(pcode, [[PCode.itos]]);
  }
  if (exp.expression.type === "string" && exp.type === "integer") {
    merge(pcode, [[PCode.ldin, 0, PCode.sval]]);
  }

  // return the pcode
  return pcode;
};
