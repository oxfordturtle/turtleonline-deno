import type { Parameter } from "../constants/commands.ts";
import type { Language } from "../constants/languages.ts";
import type { Lexeme, OperatorLexeme, TypeLexeme } from "../lexer/lexeme.ts";
import type { Operator, Type } from "../lexer/types.ts";
import { CompilerError } from "../tools/error.ts";
import { functionCall, methodFunctionCall } from "./call.ts";
import {
  CastExpression,
  ColourValue,
  CompoundExpression,
  ConstantValue,
  InputValue,
  IntegerValue,
  StringValue,
  VariableAddress,
  VariableValue,
  type Expression,
} from "./definitions/expression.ts";
import type Lexemes from "./definitions/lexemes.ts";
import { operator, stringOperator } from "./definitions/operators.ts";
import type Program from "./definitions/program.ts";
import { Subroutine } from "./definitions/subroutine.ts";
import { Variable } from "./definitions/variable.ts";
import * as find from "./find.ts";

/** checks types match (throws an error if not) */
export function typeCheck(
  language: Language,
  found: Expression,
  expected: Type | Variable | Parameter
): Expression {
  const expectedType = typeof expected === "string" ? expected : expected.type;

  // if expected type isn't yet certain, infer it
  if (typeof expected !== "string" && expected.__ === "variable" && !expected.typeIsCertain) {
    expected.type = found.type;
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
    found.command.__ === "subroutine" &&
    (!found.command.typeIsCertain || (found.command.result && !found.command.result.typeIsCertain))
  ) {
    const result = found.command.result;
    if (result) {
      result.type = found.type;
      result.typeIsCertain = true;
    } else {
      const result = new Variable("!result", found.command);
      result.type = found.type;
      result.typeIsCertain = true;
      found.command.variables.unshift(result);
    }
    found.command.typeIsCertain = true;
    return found;
  }

  // found and expected the same is obviously ok
  if (found.type === expectedType) {
    return found;
  }

  // if STRING is expected, CHARACTER is ok
  if (expectedType === "string" && found.type === "character") {
    // but we'll need to cast it as a string
    return new CastExpression(found.lexeme, "string", found);
  }

  // if CHARACTER is expected, STRING is ok
  // (the whole expression will end up being a string anyway)
  if (expectedType === "character" && found.type === "string") {
    return found;
  }

  // if CHARACTER is expected, INTEGER is ok
  if (expectedType === "character" && found.type === "integer") {
    return found;
  }

  // if INTEGER is expected, CHARACTER is ok
  if (expectedType === "integer" && found.type === "character") {
    return found;
  }

  // if BOOLINT is expected, either BOOLEAN or INTEGER is ok
  if (expectedType === "boolint" && (found.type === "boolean" || found.type === "integer")) {
    return found;
  }

  // if BOOLINT is found, either BOOLEAN or INTEGER expected is ok
  if (found.type === "boolint" && (expectedType === "boolean" || expectedType === "integer")) {
    return found;
  }

  // if INTEGER is found and BOOLEAN is expected, that's fine in Python and TypeScript
  if (
    (language === "Python" || language === "TypeScript") &&
    expectedType === "boolean" &&
    found.type === "integer"
  ) {
    return found;
  }

  // everything else is an error
  throw new CompilerError(
    `Type error: '${expectedType}' expected but '${found.type}' found.`,
    found.lexeme
  );
}

/** parses lexemes as an expression */
export function expression(lexemes: Lexemes, routine: Program | Subroutine, level = 0): Expression {
  // break out of recursion at level > 2
  if (level > 2) {
    return factor(lexemes, routine);
  }

  // evaluate the first bit
  let exp = expression(lexemes, routine, level + 1);

  while (lexemes.get() && operator(lexemes.get() as Lexeme, level)) {
    // get the operator (provisionally), and save the operator lexeme
    const lexeme = lexemes.get() as OperatorLexeme;
    let op = operator(lexeme, level) as Operator;

    // move past the operator
    lexemes.next();

    // evaluate the second bit
    let nextExp = expression(lexemes, routine, level + 1);

    // check types match (check both ways - so that if there's a character on
    // either side, and a string on the other, we'll know to convert the
    // character to a string)
    exp = typeCheck(routine.language, exp, nextExp.type);
    nextExp = typeCheck(routine.language, nextExp, exp.type);

    // maybe replace provisional operator with its string equivalent
    if (exp.type === "string" || nextExp.type === "string") {
      op = stringOperator(op);
    }
    if (exp.type === "character" || nextExp.type === "character") {
      // TODO: reconsider this, as this behaviour is not ideal
      // whether to use the string operator should be determined by the context
      // i.e. if we're expecting a string, use the string equivalent ??
      if (op === "plus") {
        op = stringOperator(op);
      }
    }

    // create a compound expression with the operator
    exp = new CompoundExpression(lexeme, exp, nextExp, op);
  }

  // return the expression
  return exp;
}

/** parses lexemes as a factor */
function factor(lexemes: Lexemes, routine: Program | Subroutine): Expression {
  const lexeme = lexemes.get() as Lexeme;
  let exp: Expression;

  switch (lexeme.type) {
    // operators
    case "operator":
      switch (lexeme.subtype) {
        case "subt":
          lexemes.next();
          exp = factor(lexemes, routine);
          exp = typeCheck(routine.language, exp, "integer");
          return new CompoundExpression(lexeme, null, exp, "neg");

        case "not":
          lexemes.next();
          exp = factor(lexemes, routine);
          exp = typeCheck(routine.language, exp, "boolint");
          return new CompoundExpression(lexeme, null, exp, "not");

        case "and": {
          if (routine.language !== "C") {
            throw new CompilerError("Expression cannot begin with {lex}.", lexemes.get());
          }
          lexemes.next();
          exp = factor(lexemes, routine);
          if (exp.expressionType !== "variable") {
            throw new CompilerError('Address operator "&" must be followed by a variable.', lexeme);
          }
          const variableAddress = new VariableAddress(exp.lexeme, exp.variable);
          variableAddress.indexes.push(...exp.indexes);
          return variableAddress;
        }

        default:
          throw new CompilerError("Expression cannot begin with {lex}.", lexeme);
      }

    // literal values
    case "literal":
      lexemes.next();
      return lexeme.subtype === "string" ? new StringValue(lexeme) : new IntegerValue(lexeme);

    // input codes
    case "input": {
      const input = find.input(routine, lexeme.value);
      if (input) {
        lexemes.next();
        return new InputValue(lexeme, input);
      }
      throw new CompilerError("{lex} is not a valid input code.", lexeme);
    }

    // identifiers
    case "identifier": {
      // look for a constant
      const constant = find.constant(routine, lexeme.value);
      if (constant) {
        const constantValue = new ConstantValue(lexeme, constant);
        lexemes.next();
        // check for reference to a character
        const open = routine.language === "BASIC" ? "(" : "[";
        const close = routine.language === "BASIC" ? ")" : "]";
        if (lexemes.get() && lexemes.get()?.content === open) {
          if (constant.type === "string") {
            lexemes.next();
            // expecting an integer expression for the character index
            let exp = expression(lexemes, routine);
            exp = typeCheck(routine.language, exp, "integer");
            constantValue.indexes.push(exp);
            // expecting closing bracket
            if (!lexemes.get() || lexemes.get()?.content !== close) {
              throw new CompilerError(
                `Closing bracket "${close}" missing after string variable index.`,
                exp.lexeme
              );
            }
            lexemes.next();
          } else {
            throw new CompilerError("{lex} is not a string constant.", lexeme);
          }
        }
        return constantValue;
      }

      // look for a variable
      const variable = find.variable(routine, lexeme.value);
      if (variable) {
        const variableValue = new VariableValue(lexeme, variable);
        lexemes.next();
        const open = routine.language === "BASIC" ? "(" : "[";
        const close = routine.language === "BASIC" ? ")" : "]";
        if (lexemes.get() && lexemes.get()?.content === open) {
          if (variable.isArray) {
            lexemes.next();
            while (lexemes.get() && lexemes.get()?.content !== close) {
              // expecting integer expression for the element index
              let exp = expression(lexemes, routine);
              exp = typeCheck(routine.language, exp, "integer");
              variableValue.indexes.push(exp);
              if (routine.language === "BASIC" || routine.language === "Pascal") {
                // maybe move past comma
                if (lexemes.get()?.content === ",") {
                  lexemes.next();
                  // check for trailing comma
                  if (lexemes.get()?.content === close) {
                    throw new CompilerError(
                      "Trailing comma at the end of array indexes.",
                      lexemes.get(-1)
                    );
                  }
                }
              } else {
                // maybe move past "]["
                if (lexemes.get()?.content === close && lexemes.get(1)?.content === open) {
                  lexemes.next();
                  lexemes.next();
                }
              }
            }
            // check we came out of the loop above for the right reason
            if (!lexemes.get()) {
              throw new CompilerError(
                `Closing bracket "${close}" needed after array indexes.`,
                lexemes.get(-1)
              );
            }
            // move past the closing bracket
            lexemes.next();
          } else if (variable.type === "string") {
            lexemes.next();
            // expecting integer expression for the character index
            exp = expression(lexemes, routine);
            exp = typeCheck(routine.language, exp, "integer");
            if (routine.language === "Python" && lexemes.get()?.content === ":") {
              lexemes.next();
              // expecting integer expression for the character index
              let exp2 = expression(lexemes, routine);
              exp2 = typeCheck(routine.language, exp2, "integer");
              variableValue.slice = [exp, exp2];
            } else {
              variableValue.indexes.push(exp);
            }
            // expecting closing bracket
            if (!lexemes.get() || lexemes.get()?.content !== close) {
              throw new CompilerError(
                `Closing bracket "${close}" missing after string variable index.`,
                exp.lexeme
              );
            }
            lexemes.next();
          } else {
            throw new CompilerError("{lex} is not a string or array variable.", lexeme);
          }
        }
        // check the right number of array variable indexes have been given
        if (variable.isArray) {
          const allowedIndexes =
            variable.type === "string"
              ? variable.arrayDimensions.length + 1 // one more for characters within strings
              : variable.arrayDimensions.length;
          if (variableValue.indexes.length > allowedIndexes) {
            throw new CompilerError("Too many indexes for array variable {lex}.", lexeme);
          }
        }
        // check for method call "." afterwards
        if (lexemes.get()?.content === ".") {
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
          return methodFunctionCall(methodLexeme, lexemes, routine, method, variableValue);
        }
        // return the variable value
        return variableValue;
      }

      // look for a predefined colour constant
      const colour = find.colour(routine, lexeme.value);
      if (colour) {
        lexemes.next();
        return new ColourValue(lexeme, colour);
      }

      // look for a command
      const command = find.command(routine, lexeme.value);
      if (command) {
        lexemes.next();
        return functionCall(lexeme, lexemes, routine, command);
      }

      // if none of those were found, throw an error
      throw new CompilerError("{lex} is not defined.", lexeme);
    }

    // everything else
    default: {
      // type casting in C and Java
      if (
        (routine.language === "C" || routine.language === "Java") &&
        lexemes.get()?.content === "(" &&
        lexemes.get(1)?.type === "type"
      ) {
        lexemes.next();
        const typeLexeme = lexemes.get() as TypeLexeme;
        const type = typeLexeme.subtype;
        if (type === null) {
          throw new CompilerError("Expression cannot be cast as void.", typeLexeme);
        }
        lexemes.next();
        if (lexemes.get()?.content !== ")") {
          throw new CompilerError(
            'Type in type cast expression must be followed by a closing bracket ")".',
            typeLexeme
          );
        }
        lexemes.next();
        exp = expression(lexemes, routine);
        if (type !== exp.type) {
          if (type === "boolean" && exp.type === "character") {
            throw new CompilerError("Characters cannot be cast as booleans.", typeLexeme);
          }
          if (type === "boolean" && exp.type === "string") {
            throw new CompilerError("Strings cannot be cast as booleans.", typeLexeme);
          }
          if (type === "string" && exp.type === "boolean") {
            throw new CompilerError("Booleans cannot be cast as strings.", typeLexeme);
          }
          if (type === "character" && exp.type === "boolean") {
            throw new CompilerError("Booleans cannot be cast as characters.", typeLexeme);
          }
          if (type === "character" && exp.type === "string") {
            throw new CompilerError("Strings cannot be cast as characters.", typeLexeme);
          }
          exp = new CastExpression(typeLexeme, type, exp);
        }
        return exp;
      }

      // bracketed expression
      else if (lexemes.get()?.content === "(") {
        // what follows should be an expression
        lexemes.next();
        exp = expression(lexemes, routine);

        // now check for a closing bracket
        if (lexemes.get() && lexemes.get()?.content === ")") {
          lexemes.next();
          return exp;
        } else {
          throw new CompilerError("Closing bracket missing after expression.", exp.lexeme);
        }
      }

      // anything else is an error
      else {
        throw new CompilerError("Expression cannot begin with {lex}.", lexeme);
      }
    }
  }
}
