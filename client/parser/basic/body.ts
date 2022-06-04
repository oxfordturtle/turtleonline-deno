import { statement } from './statement.ts'
import Program from '../definitions/program.ts'
import type { Subroutine } from '../definitions/subroutine.ts'
import type { Lexeme } from '../../lexer/lexeme.ts'
import type Lexemes from '../definitions/lexemes.ts'

/** parses the body of a routine */
export default function body (lexemes: Lexemes, routine: Program|Subroutine): void {
  lexemes.index = routine.start
  while (lexemes.index < routine.end) {
    routine.statements.push(statement(lexemes.get() as Lexeme, lexemes, routine))
  }
}
