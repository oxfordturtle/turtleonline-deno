import { type KeywordLexeme } from "../../../lexer/lexeme.ts";
import { CompilerError } from "../../../tools/error.ts";
import parseExpression from "../../common/expression.ts";
import typeCheck from "../../common/typeCheck.ts";
import type { Lexemes } from "../../definitions/lexemes.ts";
import { type Routine } from "../../definitions/routine.ts";
import makeIfStatement, { type IfStatement } from "../../definitions/statements/ifStatement.ts";
import parseBlock from "./block.ts";

const parseIfStatement = (
  ifLexeme: KeywordLexeme,
  lexemes: Lexemes,
  routine: Routine
): IfStatement => {
  // expecting a boolean expression
  if (!lexemes.get()) {
    throw new CompilerError(
      `"${ifLexeme.content}" must be followed by a Boolean expression.`,
      ifLexeme
    );
  }
  let condition = parseExpression(lexemes, routine);
  condition = typeCheck(routine.language, condition, "boolean");

  // expecting a colon
  if (!lexemes.get()) {
    throw new CompilerError(
      `"${ifLexeme.content} <expression>" must be followed by a colon.`,
      condition.lexeme
    );
  }
  lexemes.next();

  // expecting newline
  if (!lexemes.get()) {
    throw new CompilerError(
      `No statements found after "${ifLexeme.content} <expression>:".`,
      lexemes.get(-1)
    );
  }
  if (lexemes.get()?.type !== "newline") {
    throw new CompilerError(
      `Statements following "${ifLexeme.content} <expression>:" must be on a new line.`,
      lexemes.get()
    );
  }
  lexemes.next();

  // create the if statement
  const thisIfStatement = makeIfStatement(ifLexeme, condition);

  // expecting indent
  if (!lexemes.get()) {
    throw new CompilerError(
      `No statements found after "${ifLexeme.content} <expression>:".`,
      lexemes.get(-1)
    );
  }
  if (lexemes.get()?.type !== "indent") {
    throw new CompilerError(
      `Statements following "${ifLexeme.content} <expression>:" must be indented.`,
      lexemes.get()
    );
  }
  lexemes.next();

  // expecting some statements
  if (!lexemes.get()) {
    throw new CompilerError(
      `No statements found after "${ifLexeme.content} <expression>:".`,
      lexemes.get(-1)
    );
  }
  thisIfStatement.ifStatements.push(...parseBlock(lexemes, routine));

  // pass over any new lines
  while (lexemes.get()?.type === "newline") {
    lexemes.next();
  }

  // happy with an "else" or "elif" here (but it's optional)
  const nextLexeme = lexemes.get();
  if (nextLexeme) {
    if (nextLexeme.content === "elif") {
      lexemes.next();
      // expecting an if statement
      thisIfStatement.elseStatements.push(
        parseIfStatement(nextLexeme as KeywordLexeme, lexemes, routine)
      );
    } else if (nextLexeme.content === "else") {
      lexemes.next();

      // expecting a colon
      if (!lexemes.get()) {
        throw new CompilerError('"else" must be followed by a colon.', lexemes.get(-1));
      }
      if (lexemes.get()?.content !== ":") {
        throw new CompilerError('"else" must be followed by a colon.', lexemes.get());
      }
      lexemes.next();

      // expecting newline
      if (!lexemes.get()) {
        throw new CompilerError('No statements found after "else:".', lexemes.get(-1));
      }
      if (lexemes.get()?.type !== "newline") {
        throw new CompilerError(
          'Statements following "else:" must be on a new line.',
          lexemes.get()
        );
      }
      lexemes.next();

      // expecting indent
      if (!lexemes.get()) {
        throw new CompilerError('No statements found after "else:".', lexemes.get(-1));
      }
      if (lexemes.get()?.type !== "indent") {
        throw new CompilerError('Statements following "else:" must be indented.', lexemes.get());
      }
      lexemes.next();

      // expecting some statements
      if (!lexemes.get()) {
        throw new CompilerError('No statements found after "else:".', lexemes.get(-1));
      }
      thisIfStatement.elseStatements.push(...parseBlock(lexemes, routine));
    }
  }

  // now we have everything we need
  return thisIfStatement;
};

export default parseIfStatement;
