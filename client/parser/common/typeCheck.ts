import type { Parameter } from "../../constants/commands.ts";
import type { Language } from "../../constants/languages.ts";
import type { Type } from "../../lexer/types.ts";
import { CompilerError } from "../../tools/error.ts";
import { getType, type Expression } from "../definitions/expression.ts";
import makeCastExpression from "../definitions/expressions/castExpression.ts";
import { getResultVariable } from "../definitions/routines/subroutine.ts";
import makeVariable, { type Variable } from "../definitions/variable.ts";

const typeCheck = (
  language: Language,
  found: Expression,
  expected: Type | Variable | Parameter
): Expression => {
  const expectedType = typeof expected === "string" ? expected : expected.type;
  const foundType = getType(found);

  // if expected type isn't yet certain, infer it
  if (typeof expected !== "string" && expected.__ === "Variable" && !expected.typeIsCertain) {
    expected.type = foundType;
    expected.typeIsCertain = true;
    return found;
  }

  // if found type isn't yet certain, infer it
  if (found.expressionType === "variable" && !found.variable.typeIsCertain) {
    found.variable.type = expectedType;
    found.variable.typeIsCertain = true;
    return found;
  }
  if (
    found.expressionType === "function" &&
    found.command.__ === "Subroutine" &&
    !found.command.typeIsCertain
  ) {
    const result = getResultVariable(found.command);
    if (result) {
      result.type = found.type;
      result.typeIsCertain = true;
    } else {
      const result = makeVariable("!result", found.command);
      result.type = found.type;
      result.typeIsCertain = true;
      found.command.variables.unshift(result);
    }
    found.command.typeIsCertain = true;
    return found;
  }

  // found and expected the same is obviously ok
  if (foundType === expectedType) {
    return found;
  }

  // if STRING is expected, CHARACTER is ok
  if (expectedType === "string" && foundType === "character") {
    // but we'll need to cast it as a string
    return makeCastExpression(found.lexeme, "string", found);
  }

  // if CHARACTER is expected, STRING is ok
  // (the whole expression will end up being a string anyway)
  if (expectedType === "character" && foundType === "string") {
    return found;
  }

  // if CHARACTER is expected, INTEGER is ok
  if (expectedType === "character" && foundType === "integer") {
    return found;
  }

  // if INTEGER is expected, CHARACTER is ok
  if (expectedType === "integer" && foundType === "character") {
    return found;
  }

  // if BOOLINT is expected, either BOOLEAN or INTEGER is ok
  if (expectedType === "boolint" && (foundType === "boolean" || foundType === "integer")) {
    return found;
  }

  // if BOOLINT is found, either BOOLEAN or INTEGER expected is ok
  if (foundType === "boolint" && (expectedType === "boolean" || expectedType === "integer")) {
    return found;
  }

  // if INTEGER is found and BOOLEAN is expected, that's fine in Python and TypeScript
  if (
    (language === "Python" || language === "TypeScript") &&
    expectedType === "boolean" &&
    foundType === "integer"
  ) {
    return found;
  }

  // everything else is an error
  throw new CompilerError(
    `Type error: '${expectedType}' expected but '${foundType}' found.`,
    found.lexeme
  );
}

export default typeCheck;
