import type { DelimiterLexeme, IdentifierLexeme, Lexeme } from "../../lexer/lexeme.ts";
import { CompilerError } from "../../tools/error.ts";
import type { Expression } from "../definitions/expression.ts";
import makeColourValue from "../definitions/expressions/colourValue.ts";
import type { Lexemes } from "../definitions/lexemes.ts";
import type { Routine } from "../definitions/routine.ts";
import makeVariable from "../definitions/variable.ts";
import parseExpression from "./expression.ts";
import parseArrayLiteralValue from "./factor/arrayLiteralValue.ts";
import parseCastExpression from "./factor/castExpression.ts";
import parseConstantValue from "./factor/constantValue.ts";
import parseFunctionCall from "./factor/functionCall.ts";
import parseInputValue from "./factor/inputValue.ts";
import parseLiteralValue from "./factor/literalValue.ts";
import parseNegatedBoolean from "./factor/negatedBoolean.ts";
import parseNegativeInteger from "./factor/negativeInteger.ts";
import parseQueryValue from "./factor/queryValue.ts";
import parseVariableAddress from "./factor/variableAddress.ts";
import parseVariableValue from "./factor/variableValue.ts";
import * as find from "./find.ts";

const parseFactor = (lexeme: Lexeme, lexemes: Lexemes, routine: Routine): Expression => {
  switch (lexeme.type) {
    case "operator":
      switch (lexeme.subtype) {
        case "subt":
          return parseNegativeInteger(lexeme, lexemes, routine);
        case "not":
          return parseNegatedBoolean(lexeme, lexemes, routine);
        case "and": {
          if (routine.language === "C") {
            return parseVariableAddress(lexeme, lexemes, routine);
          }
          break;
        }
      }
      break;

    case "literal":
      return parseLiteralValue(lexeme, lexemes, routine);

    case "input":
      return parseInputValue(lexeme, lexemes, routine);

    case "query":
      return parseQueryValue(lexeme, lexemes, routine);

    case "identifier":
      return parseIdentifierExpression(lexeme, lexemes, routine);

    case "delimiter":
      return parseDelimiterExpression(lexeme, lexemes, routine);
  }

  throw new CompilerError("Expression cannot begin with {lex}.", lexeme);
};

export default parseFactor;

const parseIdentifierExpression = (
  lexeme: IdentifierLexeme,
  lexemes: Lexemes,
  routine: Routine
): Expression => {
  // look for a constant
  const constant = find.constant(routine, lexeme.content);
  if (constant) {
    return parseConstantValue(lexeme, lexemes, routine, constant);
  }

  // look for a variable
  const variable = find.variable(routine, lexeme.content);
  if (variable) {
    return parseVariableValue(lexeme, lexemes, routine, variable);
  }

  // look for a predefined colour constant
  const colour = find.colour(routine, lexeme.content);
  if (colour) {
    lexemes.next();
    return makeColourValue(lexeme, colour);
  }

  // look for a command
  const command = find.command(routine, lexeme.content);
  if (command) {
    lexemes.next();
    return parseFunctionCall(lexeme, lexemes, routine, command);
  }

  // in Python, if all else fails, just create a variable and then try again
  if (routine.language === "Python") {
    const variable = makeVariable(lexeme.content, routine);
    routine.variables.push(variable);
    return parseIdentifierExpression(lexeme, lexemes, routine);
  }

  // otherwise, throw an error
  throw new CompilerError("{lex} is not defined.", lexeme);
};

const parseDelimiterExpression = (
  lexeme: DelimiterLexeme,
  lexemes: Lexemes,
  routine: Routine
): Expression => {
  // square brackets (list literals)
  if (lexeme.content === "[") {
    return parseArrayLiteralValue(lexeme, lexemes, routine);
  }

  // regular brackets (cast expressions or bracketed expressions)
  if (lexeme.content === "(") {
    const nextLexeme = lexemes.get(1);
    if ((routine.language === "C" || routine.language === "Java") && nextLexeme?.type === "type") {
      return parseCastExpression(nextLexeme, lexemes, routine);
    }
    // what follows should be an expression
    lexemes.next();
    const expression = parseExpression(lexemes, routine);

    // now check for a closing bracket
    if (lexemes.get() && lexemes.get()?.content === ")") {
      lexemes.next();
      return expression;
    } else {
      throw new CompilerError("Opening bracket without corresponding closing bracket.", lexeme);
    }
  }

  // every other delimiter is an error
  throw new CompilerError("Expression cannot begin with {lex}.", lexeme);
};
