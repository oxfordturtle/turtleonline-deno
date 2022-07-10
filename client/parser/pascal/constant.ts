import identifier from './identifier.ts'
import { semicolon } from './statement.ts'
import type Lexemes from '../definitions/lexemes.ts'
import { Constant } from '../definitions/constant.ts'
import type Program from '../definitions/program.ts'
import { expression } from '../expression.ts'
import evaluate from '../evaluate.ts'
import { CompilerError } from '../../tools/error.ts'

/** parses lexemes as constant definitions (after "const") */
export default function constant (lexemes: Lexemes, routine: Program): Constant {
  // expecting constant name
  const name = identifier(lexemes, routine)

  // expecting '='
  if (!lexemes.get() || lexemes.get()?.content !== '=') {
    throw new CompilerError('Constant must be assigned a value.', lexemes.get(-1))
  }
  lexemes.next()

  // expecting an expression
  let exp = expression(lexemes, routine)
  const value = evaluate(exp, 'Pascal', 'constant')

  // create the constant
  const foo = new Constant('Pascal', name, value)

  // expecting a semicolon
  semicolon(lexemes, true, 'constant definition')

  // return the constant
  return foo
}
