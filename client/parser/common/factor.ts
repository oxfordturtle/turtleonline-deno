import type { Lexeme, TypeLexeme } from "../../lexer/lexeme.ts";
import { CompilerError } from "../../tools/error.ts";
import parseFunctionCall, { parseMethodFunctionCall } from "./functionCall.ts";
import { getType, type Expression } from "../definitions/expression.ts";
import makeCastExpression from "../definitions/expressions/castExpression.ts";
import makeColourValue from "../definitions/expressions/colourValue.ts";
import makeCompoundExpression from "../definitions/expressions/compoundExpression.ts";
import makeConstantValue from "../definitions/expressions/constantValue.ts";
import makeInputValue from "../definitions/expressions/inputValue.ts";
import makeIntegerValue from "../definitions/expressions/integerValue.ts";
import makeStringValue from "../definitions/expressions/stringValue.ts";
import makeVariableAddress from "../definitions/expressions/variableAddress.ts";
import makeVariableValue from "../definitions/expressions/variableValue.ts";
import { type Lexemes } from "../definitions/lexemes.ts";
import type { Routine } from "../definitions/routine.ts";
import { isArray } from "../definitions/variable.ts";
import parseExpression from "./expression.ts";
import * as find from "./find.ts";
import typeCheck from "./typeCheck.ts";

const parseFactor = (lexemes: Lexemes, routine: Routine): Expression => {
  const lexeme = lexemes.get() as Lexeme;
  let exp: Expression;

  switch (lexeme.type) {
    // operators
    case "operator":
      switch (lexeme.subtype) {
        case "subt":
          lexemes.next();
          exp = parseFactor(lexemes, routine);
          exp = typeCheck(routine.language, exp, "integer");
          return makeCompoundExpression(lexeme, null, exp, "neg");

        case "not":
          lexemes.next();
          exp = parseFactor(lexemes, routine);
          exp = typeCheck(routine.language, exp, "boolint");
          return makeCompoundExpression(lexeme, null, exp, "not");

        case "and": {
          if (routine.language !== "C") {
            throw new CompilerError("Expression cannot begin with {lex}.", lexemes.get());
          }
          lexemes.next();
          exp = parseFactor(lexemes, routine);
          if (exp.expressionType !== "variable") {
            throw new CompilerError('Address operator "&" must be followed by a variable.', lexeme);
          }
          const variableAddress = makeVariableAddress(exp.lexeme, exp.variable);
          variableAddress.indexes.push(...exp.indexes);
          return variableAddress;
        }

        default:
          throw new CompilerError("Expression cannot begin with {lex}.", lexeme);
      }

    // literal values
    case "literal":
      lexemes.next();
      return lexeme.subtype === "string" ? makeStringValue(lexeme) : makeIntegerValue(lexeme);

    // input codes
    case "input": {
      const input = find.input(routine, lexeme.value);
      if (input) {
        lexemes.next();
        return makeInputValue(lexeme, input);
      }
      throw new CompilerError("{lex} is not a valid input code.", lexeme);
    }

    // identifiers
    case "identifier": {
      // look for a constant
      const constant = find.constant(routine, lexeme.value);
      if (constant) {
        const constantValue = makeConstantValue(lexeme, constant);
        lexemes.next();
        // check for reference to a character
        const open = routine.language === "BASIC" ? "(" : "[";
        const close = routine.language === "BASIC" ? ")" : "]";
        if (lexemes.get() && lexemes.get()?.content === open) {
          if (constant.type === "string") {
            lexemes.next();
            // expecting an integer expression for the character index
            let exp = parseExpression(lexemes, routine);
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
        const variableValue = makeVariableValue(lexeme, variable);
        lexemes.next();
        const open = routine.language === "BASIC" ? "(" : "[";
        const close = routine.language === "BASIC" ? ")" : "]";
        if (lexemes.get() && lexemes.get()?.content === open) {
          if (isArray(variable)) {
            lexemes.next();
            while (lexemes.get() && lexemes.get()?.content !== close) {
              // expecting integer expression for the element index
              let exp = parseExpression(lexemes, routine);
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
            exp = parseExpression(lexemes, routine);
            exp = typeCheck(routine.language, exp, "integer");
            if (routine.language === "Python" && lexemes.get()?.content === ":") {
              lexemes.next();
              // expecting integer expression for the character index
              let exp2 = parseExpression(lexemes, routine);
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
        if (isArray(variable)) {
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
          return parseMethodFunctionCall(methodLexeme, lexemes, routine, method, variableValue);
        }
        // return the variable value
        return variableValue;
      }

      // look for a predefined colour constant
      const colour = find.colour(routine, lexeme.value);
      if (colour) {
        lexemes.next();
        return makeColourValue(lexeme, colour);
      }

      // look for a command
      const command = find.command(routine, lexeme.value);
      if (command) {
        lexemes.next();
        return parseFunctionCall(lexeme, lexemes, routine, command);
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
        exp = parseExpression(lexemes, routine);
        const expType = getType(exp);
        if (type !== expType) {
          if (type === "boolean" && expType === "character") {
            throw new CompilerError("Characters cannot be cast as booleans.", typeLexeme);
          }
          if (type === "boolean" && expType === "string") {
            throw new CompilerError("Strings cannot be cast as booleans.", typeLexeme);
          }
          if (type === "string" && expType === "boolean") {
            throw new CompilerError("Booleans cannot be cast as strings.", typeLexeme);
          }
          if (type === "character" && expType === "boolean") {
            throw new CompilerError("Booleans cannot be cast as characters.", typeLexeme);
          }
          if (type === "character" && expType === "string") {
            throw new CompilerError("Strings cannot be cast as characters.", typeLexeme);
          }
          exp = makeCastExpression(typeLexeme, type, exp);
        }
        return exp;
      }

      // bracketed expression
      else if (lexemes.get()?.content === "(") {
        // what follows should be an expression
        lexemes.next();
        exp = parseExpression(lexemes, routine);

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

export default parseFactor;
