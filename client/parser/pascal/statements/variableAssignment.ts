import { type IdentifierLexeme } from "../../../lexer/lexeme.ts";
import { CompilerError } from "../../../tools/error.ts";
import parseExpression from "../../common/expression.ts";
import typeCheck from "../../common/typeCheck.ts";
import { type Expression } from "../../definitions/expression.ts";
import type { Lexemes } from "../../definitions/lexemes.ts";
import type { Program } from "../../definitions/routines/program.ts";
import type { Subroutine } from "../../definitions/routines/subroutine.ts";
import makeVariableAssignment, {
  type VariableAssignment,
} from "../../definitions/statements/variableAssignment.ts";
import { isArray, type Variable } from "../../definitions/variable.ts";

const parseVariableAssignment = (
  variableLexeme: IdentifierLexeme,
  lexemes: Lexemes,
  routine: Program | Subroutine,
  variable: Variable
): VariableAssignment => {
  // strings and array variables permit element indexes at this point
  const indexes: Expression[] = [];
  if (lexemes.get()?.content === "[") {
    if (isArray(variable)) {
      lexemes.next();
      while (lexemes.get() && lexemes.get()?.content !== "]") {
        // expecting integer expression for the element index
        let exp = parseExpression(lexemes, routine);
        exp = typeCheck(routine.language, exp, "integer");
        indexes.push(exp);
        // maybe move past comma
        if (lexemes.get()?.content === ",") {
          lexemes.next();
          // check for trailing comma
          if (lexemes.get()?.content === "]") {
            throw new CompilerError("Trailing comma at the end of array indexes.", lexemes.get(-1));
          }
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
      exp = typeCheck(routine.language, exp, "integer");
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

  // expecting assignment operator
  const assignmentLexeme = lexemes.get();
  if (
    !assignmentLexeme ||
    assignmentLexeme.type !== "operator" ||
    assignmentLexeme.subtype !== "asgn"
  ) {
    throw new CompilerError(
      'Variable must be followed by assignment operator ":=".',
      variableLexeme
    );
  }
  lexemes.next();

  // expecting an expression as the value to assign to the variable
  if (!lexemes.get()) {
    throw new CompilerError(
      `Variable "${variable.name}" must be assigned a value.`,
      assignmentLexeme
    );
  }
  const typeToCheck =
    variable.type === "string" && indexes.length > 0 ? "character" : variable.type;
  let value = parseExpression(lexemes, routine);
  value = typeCheck(routine.language, value, typeToCheck);

  // create and return the variable assignment
  return makeVariableAssignment(assignmentLexeme, variable, indexes, value);
};

export default parseVariableAssignment;
