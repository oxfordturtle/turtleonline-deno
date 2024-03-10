import { type Lexeme } from "../../../lexer/lexeme.ts";
import { CompilerError } from "../../../tools/error.ts";
import type { Lexemes } from "../../definitions/lexemes.ts";
import { type Subroutine } from "../../definitions/routines/subroutine.ts";
import { type Statement } from "../../definitions/statement.ts";
import parseStatement from "../statement.ts";

const parseBlock = (lexemes: Lexemes, routine: Subroutine): Statement[] => {
  const statements: Statement[] = [];

  // loop through until the end of the block (or we run out of lexemes)
  while (lexemes.get() && lexemes.get()?.content !== "}") {
    statements.push(parseStatement(lexemes.get() as Lexeme, lexemes, routine));
  }

  // check we came out of the loop for the right reason
  if (lexemes.get()?.content === "}") {
    lexemes.next();
  } else {
    throw new CompilerError('Closing bracket "}" missing after statement block.', lexemes.get(-1));
  }

  return statements;
};

export default parseBlock;
