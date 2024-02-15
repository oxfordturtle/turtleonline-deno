import { CompilerError } from "../../tools/error.ts";
import constant, { type Constant } from "../definitions/constant.ts";
import type Lexemes from "../definitions/lexemes.ts";
import type { Routine } from "../definitions/routine.ts";
import evaluate from "../evaluate.ts";
import { expression, typeCheck } from "../expression.ts";
import { variable } from "./variable.ts";

export default (lexemes: Lexemes, routine: Routine): Constant => {
  // expecting constant name (which is just like a variable name)
  const foo = variable(lexemes, routine);

  // expecting '='
  if (!lexemes.get() || lexemes.get()?.content !== "=") {
    throw new CompilerError("Constant must be assigned a value.", lexemes.get(-1));
  }
  lexemes.next();

  // expecting an expression
  let exp = expression(lexemes, routine);
  const value = evaluate(exp, "BASIC", "constant");
  exp = typeCheck(routine.language, exp, foo.type);

  // create and return the constant
  return constant("BASIC", foo.name, value);
};
