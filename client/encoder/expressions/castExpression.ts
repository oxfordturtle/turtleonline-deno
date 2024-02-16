import PCode from "../../constants/pcodes.ts";
import { getType } from "../../parser/definitions/expression.ts";
import type { CastExpression } from "../../parser/definitions/expressions/castExpression.ts";
import type { Program } from "../../parser/definitions/routines/program.ts";
import expression from "../expression.ts";
import merge from "../merge.ts";
import type { Options } from "../options.ts";

export default (exp: CastExpression, program: Program, options: Options): number[][] => {
  // generate the code for the underlying expression
  const pcode = expression(exp.expression, program, options);

  // add type casting as necessary
  if (getType(exp.expression) === "character" && exp.type === "string") {
    merge(pcode, [[PCode.ctos]]);
  }
  if (getType(exp.expression) === "integer" && exp.type === "string") {
    merge(pcode, [[PCode.itos]]);
  }
  if (getType(exp.expression) === "string" && exp.type === "integer") {
    merge(pcode, [[PCode.ldin, 0, PCode.sval]]);
  }

  // return the pcode
  return pcode;
};
