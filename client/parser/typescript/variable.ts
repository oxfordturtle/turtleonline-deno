import { CompilerError } from "../../tools/error.ts";
import type { Lexemes } from "../definitions/lexemes.ts";
import type { Routine } from "../definitions/routine.ts";
import makeVariable, { type Variable } from "../definitions/variable.ts";
import identifier from "./identifier.ts";
import type from "./type.ts";

/** parses lexemes as a variable declaration */
export default function variable(
  lexemes: Lexemes,
  routine: Routine,
  duplicateCheck: boolean
): Variable {
  // expecting identifier
  const name = identifier(lexemes, routine, duplicateCheck);

  // expecting type specification
  const [variableType, stringLength, arrayDimensions] = type(lexemes, routine);

  // "void" not allowed for variables
  if (variableType === null) {
    throw new CompilerError(
      'Variable cannot be void (expected "boolean", "number", or "string").',
      lexemes.get()
    );
  }

  // create the variable
  const variable = makeVariable(name, routine);
  variable.type = variableType;
  variable.stringLength = stringLength;
  variable.arrayDimensions = arrayDimensions;

  // return the variable
  return variable;
}
