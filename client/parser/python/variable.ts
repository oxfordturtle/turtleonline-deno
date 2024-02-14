import { Constant } from "../definitions/constant.ts";
import type Lexemes from "../definitions/lexemes.ts";
import type Program from "../definitions/program.ts";
import type { Subroutine } from "../definitions/subroutine.ts";
import Variable from "../definitions/variable.ts";
import identifier from "./identifier.ts";
import type from "./type.ts";

/** parses lexemes as a variable/parameter declaration */
export default function variable(
  lexemes: Lexemes,
  routine: Program | Subroutine
): Constant | Variable {
  // expecting identifier
  const name = identifier(lexemes, routine, true);

  // colon followed by type hint is permissible here
  if (lexemes.get() && lexemes.get()?.content === ":") {
    lexemes.next();

    // expecting type specification
    const [isConstant, variableType, stringLength, arrayDimensions] = type(lexemes, routine);

    if (isConstant) {
      // return the constant with any value; the value will be set later
      return new Constant("Python", name, 0);
    }

    // create and return the variable
    const variable = new Variable(name, routine);
    variable.type = variableType;
    variable.typeIsCertain = true;
    variable.stringLength = stringLength;
    variable.arrayDimensions = arrayDimensions;
    return variable;
  }

  // if there's no type hint, just return a default (boolint) variable
  return new Variable(name, routine);
}
