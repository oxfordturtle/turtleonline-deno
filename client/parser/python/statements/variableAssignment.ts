import { type IdentifierLexeme } from "../../../lexer/lexeme.ts";
import { CompilerError } from "../../../tools/error.ts";
import parseExpression from "../../common/expression.ts";
import typeCheck from "../../common/typeCheck.ts";
import { type Expression } from "../../definitions/expression.ts";
import makeVariableValue from "../../definitions/expressions/variableValue.ts";
import type { Lexemes } from "../../definitions/lexemes.ts";
import { type Routine } from "../../definitions/routine.ts";
import type { PassStatement } from "../../definitions/statements/passStatement.ts";
import makeVariableAssignment, {
  type VariableAssignment,
} from "../../definitions/statements/variableAssignment.ts";
import { isArray, type Variable } from "../../definitions/variable.ts";

export default (
  variableLexeme: IdentifierLexeme,
  lexemes: Lexemes,
  routine: Routine,
  variable: Variable
): VariableAssignment | PassStatement => {
  // strings and array variables permit element indexes at this point
  const indexes: Expression[] = [];
  if (lexemes.get()?.content === "[") {
    if (isArray(variable)) {
      lexemes.next();
      while (lexemes.get() && lexemes.get()?.content !== "]") {
        // expecting integer expression for the element index
        let exp = parseExpression(lexemes, routine);
        exp = typeCheck(routine.language, exp, variable);
        indexes.push(exp);
        // maybe move past "]["
        if (lexemes.get()?.content === "]" && lexemes.get(1)?.content === "[") {
          lexemes.next();
          lexemes.next();
        }
      }
      // check we came out of the loop above for the right reason
      if (!lexemes.get()) {
        throw new CompilerError('Closing bracket "]" needed after array indexes.', lexemes.get(-1));
      }
      // move past the closing bracket
      lexemes.next();
    } else if (variable.type === "string") {
      lexemes.next();
      // expecting integer expression for the character index
      let exp = parseExpression(lexemes, routine);
      exp = typeCheck(routine.language, exp, variable);
      indexes.push(exp);
      // expecting closing bracket
      if (!lexemes.get() || lexemes.get()?.content !== "]") {
        throw new CompilerError(
          'Closing bracket "]" missing after string variable index.',
          exp.lexeme
        );
      }
      lexemes.next();
    } else {
      throw new CompilerError("{lex} is not a string or array variable.", variableLexeme);
    }
  }

  // check the right number of array variable indexes have been given
  if (isArray(variable)) {
    const allowedIndexes =
      variable.type === "string"
        ? variable.arrayDimensions.length + 1 // one more for characters within strings
        : variable.arrayDimensions.length;
    if (indexes.length > allowedIndexes) {
      throw new CompilerError("Too many indexes for array variable {lex}.", variableLexeme);
    }
  }

  // expecting "=", "+=", or "-="
  const assignmentLexeme = lexemes.get();
  if (!assignmentLexeme) {
    throw new CompilerError(
      'Variable must be followed by assignment operator "=".',
      lexemes.get(-1)
    );
  }
  if (assignmentLexeme.content === ":") {
    if (variable.turtle) {
      throw new CompilerError(
        "{lex} is the name of a predefined Turtle attribute, and cannot be given a type hit.",
        lexemes.get(-1)
      );
    }
    throw new CompilerError("Type of variable {lex} has already been given.", lexemes.get(-1));
  }
  if (assignmentLexeme.content === "[") {
    throw new CompilerError("{lex} is not a string or list variable.", lexemes.get(-1));
  }
  if (assignmentLexeme.type !== "operator" || assignmentLexeme.subtype !== "asgn") {
    throw new CompilerError('Variable must be followed by assignment operator "=".', lexemes.get());
  }
  lexemes.next();

  // expecting an expression as the value to assign to the variable
  if (!lexemes.get()) {
    throw new CompilerError(
      `Variable "${variable.name}" must be assigned a value.`,
      lexemes.get(-1)
    );
  }
  let value = parseExpression(lexemes, routine);
  const variableValue = makeVariableValue(variableLexeme, variable);
  variableValue.indexes.push(...indexes);

  // type checking
  value = typeCheck(routine.language, value, variable);

  // create and return the variable assignment statement
  return makeVariableAssignment(assignmentLexeme, variable, indexes, value);
};
