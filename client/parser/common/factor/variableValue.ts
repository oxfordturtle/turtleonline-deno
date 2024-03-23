import type { DelimiterLexeme, IdentifierLexeme } from "../../../lexer/lexeme.ts";
import { CompilerError } from "../../../tools/error.ts";
import type { FunctionCall } from "../../definitions/expressions/functionCall.ts";
import makeVariableIndex, {
  type VariableIndex
} from "../../definitions/expressions/variableIndex.ts";
import makeVariableSlice, {
  type VariableSlice,
} from "../../definitions/expressions/variableSlice.ts";
import makeVariableValue, {
  type VariableValue,
} from "../../definitions/expressions/variableValue.ts";
import type { Lexemes } from "../../definitions/lexemes.ts";
import type { Routine } from "../../definitions/routine.ts";
import type { Variable } from "../../definitions/variable.ts";
import parseExpression from "../expression.ts";
import typeCheck from "../typeCheck.ts";
import * as find from "../find.ts";
import { parseMethodFunctionCall } from "./functionCall.ts";

const parseVariableValue = (
  lexeme: IdentifierLexeme,
  lexemes: Lexemes,
  routine: Routine,
  variable: Variable
): FunctionCall | VariableIndex | VariableSlice | VariableValue => {
  // create variable value
  const variableValue = makeVariableValue(lexeme, variable);

  // move along
  lexemes.next();
  const nextLexeme = lexemes.get();

  // check for string/array indexes or slices
  const openBracket = routine.language === "BASIC" ? "(" : "[";
  if (nextLexeme?.type === "delimiter" && nextLexeme.content === openBracket) {
    lexemes.next();
    return parseVariableExtras(nextLexeme, lexemes, routine, variableValue);
  }

  // check for method call and potentially return that instead
  if (nextLexeme?.content === ".") {
    lexemes.next();
    const methodLexeme = lexemes.get();
    if (methodLexeme?.type !== "identifier") {
      throw new CompilerError("Method name missing after '.'.", lexemes.get());
    }
    const method = find.nativeCommand(routine, `.${methodLexeme.value}`);
    if (!method) {
      throw new CompilerError(`Method "${methodLexeme.value}" is not defined.`, methodLexeme);
    }
    lexemes.next();
    return parseMethodFunctionCall(methodLexeme, lexemes, routine, method, variableValue);
  }

  // otherwise return the variable value
  return variableValue;
};

export default parseVariableValue;

const parseVariableExtras = (
  lexeme: DelimiterLexeme,
  lexemes: Lexemes,
  routine: Routine,
  variableExpression: VariableValue | VariableIndex | VariableSlice
): VariableIndex | VariableSlice => {
  // expecting an integer expression for the index / slice start
  const expression = parseExpression(lexemes, routine);
  const checkedExpression = typeCheck(routine.language, expression, "integer");

  // expecting colon for slice, or comma/closing bracket for index
  const closeBracket = routine.language === "BASIC" ? ")" : "]";
  const nextLexeme = lexemes.get();
  if (nextLexeme === undefined) {
    throw new CompilerError("Expected closing bracket after array variable index.", lexeme);
  }

  // slices in Python
  if (routine.language === "Python" && nextLexeme?.content === ":") {
    lexemes.next();

    // expecting an integer expression for the slice end
    const endExpression = parseExpression(lexemes, routine);
    const checkedEndExpression = typeCheck(routine.language, endExpression, "integer");

    // expecting closing bracket
    const finalLexeme = lexemes.get();
    if (finalLexeme?.content !== closeBracket) {
      throw new CompilerError(
        `Closing bracket "${closeBracket}" missing after array variable slice.`,
        checkedEndExpression.lexeme
      );
    }
    lexemes.next();

    return makeVariableSlice(lexeme, variableExpression, checkedExpression, checkedEndExpression);
  }

  // subindexes in BASIC and Pascal
  if (routine.language === "BASIC" || routine.language === "Pascal") {
    if (nextLexeme?.content === ",") {
      const variableIndex = makeVariableIndex(lexeme, variableExpression, checkedExpression);
      lexemes.next();
      return parseVariableExtras(lexeme, lexemes, routine, variableIndex);
    }
  }

  // check for closing bracket
  if (nextLexeme.content !== closeBracket) {
    throw new CompilerError(
      `Closing bracket "${closeBracket}" missing after array variable index.`,
      checkedExpression.lexeme
    );
  }

  // check for opening bracket for subindexes
  const openBracket = routine.language === "BASIC" ? "(" : "[";
  const nextNextLexeme = lexemes.get(1);
  if (nextNextLexeme?.type === "delimiter" && nextNextLexeme.content === openBracket) {
    lexemes.next();
    lexemes.next();
    const variableIndex = makeVariableIndex(lexeme, variableExpression, checkedExpression);
    return parseVariableExtras(lexeme, lexemes, routine, variableIndex);
  }

  // otherwise we're done, return the variable index
  return makeVariableIndex(lexeme, variableExpression, checkedExpression);
};
