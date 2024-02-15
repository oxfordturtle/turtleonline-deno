import PCode from "../../constants/pcodes.ts";
import type { Operator } from "../../lexer/types.ts";
import type { CompoundExpression } from "../../parser/definitions/expression.ts";
import type Program from "../../parser/definitions/program.ts";
import expression from "../expression.ts";
import merge from "../merge.ts";
import type { Options } from "../options.ts";

export default (exp: CompoundExpression, program: Program, options: Options): number[][] => {
  // generate left hand side code
  const left = exp.left ? expression(exp.left, program, options) : null;

  // treat +/- 1 as a special case
  if (left && exp.right.expressionType === "integer" && exp.right.value === 1) {
    if (exp.operator === "plus") {
      merge(left, [[PCode.incr]]);
      return left;
    }
    if (exp.operator === "subt") {
      merge(left, [[PCode.decr]]);
      return left;
    }
  }

  // generate right hand side code and operator code
  const right = expression(exp.right, program, options);
  const op = operator(exp.operator, program, options);

  // stitch it all together
  if (left) {
    merge(left, right);
    merge(left, [op]);
    return left;
  }
  merge(right, [op]);
  return right;
};

const operator = (op: Operator, program: Program, _options: Options): number[] => {
  switch (op) {
    case "not":
      return program.language === "C" ||
        program.language === "Python" ||
        program.language === "TypeScript"
        ? // PCode.not is bitwise negation
          [PCode.ldin, 0, PCode.eqal]
        : [PCode.not];

    default:
      return [PCode[op as any] as any as PCode];
  }
};
