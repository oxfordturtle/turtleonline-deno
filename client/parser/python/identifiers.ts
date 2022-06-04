import identifier from './identifier.ts'
import Lexemes from '../definitions/lexemes.ts'
import Program from '../definitions/program.ts'
import { Subroutine } from '../definitions/subroutine.ts'
import { CompilerError } from '../../tools/error.ts'

/** parses lexemes as a comma-separated list of identifiers, and returns the names */
export default function identifiers (lexemes: Lexemes, routine: Program|Subroutine, context: 'global'|'nonlocal'): string[] {
  const names: string[] = []

  // expecting identifier
  names.push(identifier(lexemes, routine, false))

  // expecting semicolon or new line, or a comma
  if (lexemes.get()?.content === ',') {
    lexemes.next()
    // push more identifiers recursively
    names.push(...identifiers(lexemes, routine, context))
  } else if (lexemes.get()?.type === 'identifier') {
    throw new CompilerError(`Comma missing between ${context} variable declarations.`, lexemes.get(-1))
  }

  return names
}
