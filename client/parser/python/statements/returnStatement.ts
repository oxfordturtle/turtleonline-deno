import { type KeywordLexeme } from "../../../lexer/lexeme.ts";
import { CompilerError } from "../../../tools/error.ts";
import { variableValue as _variableValue, getType } from "../../definitions/expression.ts";
import type Lexemes from "../../definitions/lexemes.ts";
import { getResultVariable, type Routine } from "../../definitions/routine.ts";
import {
  returnStatement as _returnStatement,
  type ReturnStatement,
} from "../../definitions/statement.ts";
import { variable as _variable } from "../../definitions/variable.ts";
import { expression, typeCheck } from "../../expression.ts";
import eosCheck from "./eosCheck.ts";

export default (
  returnLexeme: KeywordLexeme,
  lexemes: Lexemes,
  routine: Routine
): ReturnStatement => {
  // check a return statement is allowed
  if (routine.__ === "program") {
    throw new CompilerError("Programs cannot return a value.", lexemes.get());
  }

  // expecting an expression of the right type, followed by end of statement
  let value = expression(lexemes, routine);
  const resultVariable = getResultVariable(routine);
  if (resultVariable !== undefined) {
    // check against previous return statements
    value = typeCheck(routine.language, value, resultVariable);
  } else {
    // otherwise create a return variable
    const result = _variable("!result", routine);
    result.type = getType(value);
    result.typeIsCertain = true;
    routine.typeIsCertain = true;
    routine.variables.unshift(result);
  }
  eosCheck(lexemes);

  // mark that this function has a return statement
  routine.hasReturnStatement = true;

  // create and return the return statement
  return _returnStatement(returnLexeme, routine, value);
};
