import { integerLexeme, operatorLexeme, type KeywordLexeme } from "../../../lexer/lexeme.ts";
import { token } from "../../../tokenizer/token.ts";
import { CompilerError } from "../../../tools/error.ts";
import {
  variableValue as _variableValue,
  compoundExpression,
  integerValue,
  type Expression,
} from "../../definitions/expression.ts";
import type Lexemes from "../../definitions/lexemes.ts";
import { type Routine } from "../../definitions/routine.ts";
import {
  forStatement as _forStatement,
  variableAssignment as _variableAssignment,
  type ForStatement,
  type VariableAssignment,
} from "../../definitions/statement.ts";
import { variable as _variable } from "../../definitions/variable.ts";
import evaluate from "../../evaluate.ts";
import { expression, typeCheck } from "../../expression.ts";
import * as find from "../../find.ts";
import parseBlock from "./block.ts";

export default (forLexeme: KeywordLexeme, lexemes: Lexemes, routine: Routine): ForStatement => {
  // expecting an integer variable
  const variableLexeme = lexemes.get();
  if (!variableLexeme) {
    throw new CompilerError('"for" must be followed by an integer variable.', lexemes.get(-1));
  }
  if (variableLexeme.type !== "identifier") {
    throw new CompilerError("{lex} is not a valid variable name.", lexemes.get());
  }
  let variable = find.variable(routine, lexemes.get()?.content as string);
  if (!variable) {
    // create the variable now
    variable = _variable(lexemes.get()?.content as string, routine);
    variable.type = "integer";
    variable.typeIsCertain = true;
    routine.variables.push(variable);
  }
  if (!variable.typeIsCertain) {
    variable.type = "integer";
    variable.typeIsCertain = true;
  }
  if (variable.type !== "integer") {
    throw new CompilerError("Loop variable must be an integer.", lexemes.get());
  }
  lexemes.next();

  // expecting 'in'
  if (!lexemes.get()) {
    throw new CompilerError('"for <variable>" must be followed by "in".', lexemes.get(-1));
  }
  if (lexemes.get()?.content !== "in") {
    throw new CompilerError('"for <variable>" must be followed by "in".', lexemes.get());
  }
  lexemes.next();

  // expecting 'range'
  if (!lexemes.get()) {
    throw new CompilerError(
      '"for <variable> in" must be followed by a range specification.',
      lexemes.get(-1)
    );
  }
  if (lexemes.get()?.content !== "range") {
    throw new CompilerError(
      '"for <variable> in" must be followed by a range specification.',
      lexemes.get()
    );
  }
  lexemes.next();

  // expecting a left bracket
  if (!lexemes.get()) {
    throw new CompilerError('"range" must be followed by an opening bracket.', lexemes.get(-1));
  }
  if (lexemes.get()?.content !== "(") {
    throw new CompilerError('"range" must be followed by an opening bracket.', lexemes.get());
  }
  lexemes.next();

  // expecting an integer expression
  if (!lexemes.get()) {
    throw new CompilerError('Missing first argument to the "range" function.', lexemes.get(-1));
  }
  const providedValues: [Expression, Expression?, Expression?] = [
    typeCheck(routine.language, expression(lexemes, routine), "integer"),
  ];

  // expecting a comma or closing bracket
  if (!lexemes.get()) {
    throw new CompilerError("Argument must be followed by a comma.", lexemes.get(-1));
  }
  if (lexemes.get()?.content !== ")" && lexemes.get()?.content !== ",") {
    throw new CompilerError(
      "Argument must be followed by a comma or a closing bracket.",
      lexemes.get()
    );
  }

  // second argument allowed here
  if (lexemes.get()?.content === ",") {
    lexemes.next();
    if (!lexemes.get()) {
      throw new CompilerError('Too few arguments for "range" function.', lexemes.get(-1));
    }
    providedValues.push(typeCheck(routine.language, expression(lexemes, routine), "integer"));
  }

  // expecting a comma or closing bracket
  if (!lexemes.get()) {
    throw new CompilerError("Argument must be followed by a comma.", lexemes.get(-1));
  }
  if (lexemes.get()?.content !== ")" && lexemes.get()?.content !== ",") {
    throw new CompilerError(
      "Argument must be followed by a comma or a closing bracket.",
      lexemes.get()
    );
  }

  // third argument allowed here
  if (lexemes.get()?.content === ",") {
    lexemes.next();
    if (!lexemes.get()) {
      throw new CompilerError('Too few arguments for "range" function.', lexemes.get(-1));
    }
    providedValues.push(typeCheck(routine.language, expression(lexemes, routine), "integer"));
  }

  // the things we want to know
  let initialisation: VariableAssignment;
  let condition: Expression;
  let change: VariableAssignment;

  // some dummy things we need to create the things we want to know
  const zeroToken = token("decimal", "0", forLexeme.line, -1);
  const zeroLexeme = integerLexeme(zeroToken, 10);
  const zero = integerValue(zeroLexeme);
  const oneToken = token("decimal", "1", forLexeme.line, -1);
  const oneLexeme = integerLexeme(oneToken, 10);
  const one = integerValue(oneLexeme);
  const assignmentToken = token("operator", "=", forLexeme.line, -1);
  const assignmentLexeme = operatorLexeme(assignmentToken, "Python");
  const left = _variableValue(variableLexeme, variable);
  const plusToken = token("operator", "+", forLexeme.line, -1);
  const lessToken = token("operator", "<", forLexeme.line, -1);
  const moreToken = token("operator", ">", forLexeme.line, -1);
  const plusLexeme = operatorLexeme(plusToken, "Python");
  const lessLexeme = operatorLexeme(lessToken, "Python");
  const moreLexeme = operatorLexeme(moreToken, "Python");

  // the values of the things we need to know depend on how many arguments were provided
  switch (providedValues.length) {
    case 1:
      // initial value is zero
      initialisation = _variableAssignment(assignmentLexeme, variable, [], zero);
      // change is +1
      change = _variableAssignment(
        assignmentLexeme,
        variable,
        [],
        compoundExpression(plusLexeme, left, one, "plus")
      );
      // termination condition is < providedValues[0]
      condition = compoundExpression(lessLexeme, left, providedValues[0], "less");
      break;
    case 2:
      // initial value is providedValues[0]
      initialisation = _variableAssignment(assignmentLexeme, variable, [], providedValues[0]);
      // change is +1
      change = _variableAssignment(
        assignmentLexeme,
        variable,
        [],
        compoundExpression(plusLexeme, left, one, "plus")
      );
      // termination condition is < providedValues[1]
      condition = compoundExpression(lessLexeme, left, providedValues[1]!, "less");
      break;
    case 3: {
      // initial value is providedValues[0]
      initialisation = _variableAssignment(assignmentLexeme, variable, [], providedValues[0]);
      // change is +/- providedValues[1]
      const stepValue = evaluate(providedValues[2]!, "Python", "step") as number;
      change = _variableAssignment(
        assignmentLexeme,
        variable,
        [],
        compoundExpression(plusLexeme, left, providedValues[2]!, "plus")
      );
      // termination condition is >/< providedValues[2]
      condition =
        stepValue < 0
          ? compoundExpression(moreLexeme, left, providedValues[1]!, "more")
          : compoundExpression(lessLexeme, left, providedValues[1]!, "less");
      break;
    }
  }

  // expecting a closing bracket
  if (!lexemes.get()) {
    throw new CompilerError(
      'Closing bracket needed after "range" function arguments.',
      lexemes.get(-1)
    );
  }
  if (lexemes.get()?.content === ",") {
    throw new CompilerError('Too many arguments for "range" function.', lexemes.get());
  }
  if (lexemes.get()?.content !== ")") {
    throw new CompilerError(
      'Closing bracket needed after "range" function arguments.',
      lexemes.get()
    );
  }
  lexemes.next();

  // expecting a colon
  if (!lexemes.get()) {
    throw new CompilerError(
      '"for <variable> in range(...)" must be followed by a colon.',
      lexemes.get(-1)
    );
  }
  if (lexemes.get()?.content !== ":") {
    throw new CompilerError(
      '"for <variable> in range(...)" must be followed by a colon.',
      lexemes.get()
    );
  }
  lexemes.next();

  // expecting newline
  if (!lexemes.get()) {
    throw new CompilerError(
      'No statements found after "for <variable> in range(...):".',
      lexemes.get(-1)
    );
  }
  if (lexemes.get()?.type !== "newline") {
    throw new CompilerError(
      'Statements following "for <variable> in range(...):" must be on a new line.',
      lexemes.get()
    );
  }
  lexemes.next();

  // create the for statement
  const forStatement = _forStatement(forLexeme, initialisation, condition, change);

  // expecting indent
  if (!lexemes.get()) {
    throw new CompilerError(
      'No statements found after "for <variable> in range(...):".',
      lexemes.get(-1)
    );
  }
  if (lexemes.get()?.type !== "indent") {
    throw new CompilerError(
      'Statements following "for <variable> in range(...):" must be indented.',
      lexemes.get()
    );
  }
  lexemes.next();

  // now expecting a block of statements
  if (!lexemes.get()) {
    throw new CompilerError(
      'No statements found after "for <variable> in range(...):',
      lexemes.get(-1)
    );
  }
  forStatement.statements.push(...parseBlock(lexemes, routine));

  // now we have everything we need
  return forStatement;
};
