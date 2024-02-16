import type { Command } from "../../../constants/commands.ts";
import type { IdentifierLexeme } from "../../../lexer/lexeme.ts";
import type { Type } from "../../../lexer/types.ts";
import { makeExpression, type Expression, type ExpressionCommon } from "../expression.ts";
import { getResultType, type Subroutine } from "../routines/subroutine.ts";

export interface FunctionCall extends ExpressionCommon {
  readonly expressionType: "function";
  readonly lexeme: IdentifierLexeme;
  readonly command: Subroutine | Command;
  readonly type: Type;
  readonly arguments: Expression[];
}

const makeFunctionCall = (
  lexeme: IdentifierLexeme,
  command: Subroutine | Command
): FunctionCall => ({
  ...makeExpression(),
  expressionType: "function",
  lexeme,
  command,
  type: command.__ === "Command" ? command.returns! : getResultType(command)!, // function calls should only ever be created with functions
  arguments: [],
});

export default makeFunctionCall;
