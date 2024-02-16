import { type IdentifierLexeme } from "../../../lexer/lexeme.ts";
import { CompilerError } from "../../../tools/error.ts";
import constant from "../../definitions/constant.ts";
import type { Lexemes } from "../../definitions/lexemes.ts";
import { type Routine } from "../../definitions/routine.ts";
import makePassStatement, { type PassStatement } from "../../definitions/statements/passStatement.ts";
import type { VariableAssignment } from "../../definitions/statements/variableAssignment.ts";
import evaluate from "../../evaluate.ts";
import { expression } from "../../expression.ts";
import variable from "../variable.ts";
import parseVariableAssignment from "./variableAssignment.ts";

export default (
  variableLexeme: IdentifierLexeme,
  lexemes: Lexemes,
  routine: Routine
): VariableAssignment | PassStatement => {
  // expecting constant or variable declaration
  const foo = variable(lexemes, routine);

  // constants
  if (foo.__ === "constant") {
    // expecting '='
    if (!lexemes.get()) {
      throw new CompilerError("Constant must be assigned a value.", lexemes.get(-1));
    }
    if (lexemes.get()?.content !== "=") {
      throw new CompilerError("Constant must be assigned a value.", lexemes.get());
    }
    lexemes.next();

    // expecting an expression
    const exp = expression(lexemes, routine);
    const value = evaluate(exp, "Python", "constant");

    // add the constant to the routine
    const bar = constant(routine.language, foo.name, value);
    routine.constants.push(bar);

    // return a pass statement
    return makePassStatement();
  }

  // otherwise it's a variable
  routine.variables.push(foo);

  // check for initial assignment
  if (lexemes.get()?.content === "=") {
    return parseVariableAssignment(variableLexeme, lexemes, routine, foo);
  }

  // otherwise pass
  return makePassStatement();
};
