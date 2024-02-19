import { CompilerError } from "../../tools/error.ts";
import evaluate from "../common/evaluate.ts";
import parseExpression from "../common/expression.ts";
import constant, { type Constant } from "../definitions/constant.ts";
import type { Lexemes } from "../definitions/lexemes.ts";
import type { Program } from "../definitions/routines/program.ts";
import identifier from "./identifier.ts";
import parseSemicolon from "./statements/semicolon.ts";

export default (lexemes: Lexemes, routine: Program): Constant => {
  // expecting constant name
  const name = identifier(lexemes, routine);

  // expecting '='
  if (!lexemes.get() || lexemes.get()?.content !== "=") {
    throw new CompilerError("Constant must be assigned a value.", lexemes.get(-1));
  }
  lexemes.next();

  // expecting an expression
  const exp = parseExpression(lexemes, routine);
  const value = evaluate(exp, "Pascal", "constant");

  // create the constant
  const foo = constant("Pascal", name, value);

  // expecting a semicolon
  parseSemicolon(lexemes, true, "constant definition");

  // return the constant
  return foo;
}
