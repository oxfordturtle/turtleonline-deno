import { variable } from "./variable.ts";
import { Constant } from "../definitions/constant.ts";
import type Program from "../definitions/program.ts";
import type { Subroutine } from "../definitions/subroutine.ts";
import type Lexemes from "../definitions/lexemes.ts";
import { typeCheck, expression } from "../expression.ts";
import evaluate from "../evaluate.ts";
import { CompilerError } from "../../tools/error.ts";

/** parses lexemes as a constant definition */
export default function constant(
  lexemes: Lexemes,
  routine: Program | Subroutine
): Constant {
  // expecting constant name (which is just like a variable name)
  const foo = variable(lexemes, routine);

  // expecting '='
  if (!lexemes.get() || lexemes.get()?.content !== "=") {
    throw new CompilerError(
      "Constant must be assigned a value.",
      lexemes.get(-1)
    );
  }
  lexemes.next();

  // expecting an expression
  let exp = expression(lexemes, routine);
  const value = evaluate(exp, "BASIC", "constant");
  exp = typeCheck(exp, foo.type);

  // create and return the constant
  return new Constant("BASIC", foo.name, value);
}
