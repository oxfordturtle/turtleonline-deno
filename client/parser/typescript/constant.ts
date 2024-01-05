import identifier from "./identifier.ts";
import type from "./type.ts";
import Lexemes from "../definitions/lexemes.ts";
import { Constant } from "../definitions/constant.ts";
import Program from "../definitions/program.ts";
import { Subroutine } from "../definitions/subroutine.ts";
import { expression, typeCheck } from "../expression.ts";
import evaluate from "../evaluate.ts";
import { CompilerError } from "../../tools/error.ts";

/** parses lexemes at a constant definition */
export default function constant(
  lexemes: Lexemes,
  routine: Program | Subroutine,
  duplicateCheck: boolean
): Constant {
  // expecting identifier
  const name = identifier(lexemes, routine, duplicateCheck);

  // expecting type specification
  const [constantType, , arrayDimensions] = type(lexemes, routine);
  if (constantType === null) {
    throw new CompilerError(
      'Constant type cannot be void (expected "boolean", "number", or "string").',
      lexemes.get()
    );
  }
  if (arrayDimensions.length > 0) {
    throw new CompilerError("Constant cannot be an array.", lexemes.get());
  }

  // expecting "="
  if (!lexemes.get()) {
    throw new CompilerError(
      `Constant ${name} must be assigned a value.`,
      lexemes.get(-1)
    );
  }
  if (lexemes.get()?.content !== "=") {
    throw new CompilerError(
      `Constant ${name} must be assigned a value.`,
      lexemes.get()
    );
  }
  lexemes.next();

  // expecting value expression
  const exp = expression(lexemes, routine);
  typeCheck(routine.language, exp, constantType);
  const value = evaluate(exp, "TypeScript", "constant");

  // create and return the constant
  return new Constant("TypeScript", name, value);
}
