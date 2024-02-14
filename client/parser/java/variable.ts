import { CompilerError } from "../../tools/error.ts";
import type Lexemes from "../definitions/lexemes.ts";
import type Program from "../definitions/program.ts";
import type { Subroutine } from "../definitions/subroutine.ts";
import Variable from "../definitions/variable.ts";
import identifier from "./identifier.ts";
import type from "./type.ts";

/** parses lexemes as a variable declaration */
export default function variable(lexemes: Lexemes, routine: Program | Subroutine): Variable {
  // expecting type specification
  const [variableType, stringLength, arrayDimensions] = type(lexemes, routine);

  // "void" not allowed for variables
  if (variableType === null) {
    throw new CompilerError(
      'Variable cannot be void (expected "boolean", "char", "int", or "String").',
      lexemes.get()
    );
  }

  // expecting identifier
  const name = identifier(lexemes, routine);

  // create the variable
  const variable = new Variable(name, routine);
  variable.type = variableType;
  variable.stringLength = stringLength;
  variable.arrayDimensions = arrayDimensions;

  // return the variable
  return variable;
}
