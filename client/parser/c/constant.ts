import type from './type.ts'
import identifier from './identifier.ts'
import Lexemes from '../definitions/lexemes.ts'
import { Constant, IntegerConstant, StringConstant } from '../definitions/constant.ts'
import Program from '../definitions/program.ts'
import { Subroutine } from '../definitions/subroutine.ts'
import { expression, typeCheck } from '../expression.ts'
import evaluate from '../evaluate.ts'
import { CompilerError } from '../../tools/error.ts'

/** parses lexemes as a constant definition, and returns the constant */
export default function constant (lexemes: Lexemes, routine: Program|Subroutine): Constant {
  // expecting type specification
  const [constantType, stringSize] = type(lexemes)
  if (constantType === null) {
    throw new CompilerError('Constant type cannot be void (expected "bool", "char", "int", or "string").', lexemes.get())
  }

  // expecting identifier
  const name = identifier(lexemes, routine)

  // expecting "="
  if (!lexemes.get()) {
    throw new CompilerError(`Constant ${name} must be assigned a value.`, lexemes.get(-1))
  }
  if (lexemes.get()?.content === '[') {
    throw new CompilerError('Constant cannot be an array.', lexemes.get(-1))
  }
  if (lexemes.get()?.content !== '=') {
    throw new CompilerError(`Constant ${name} must be assigned a value.`, lexemes.get())
  }
  lexemes.next()

  // expecting value expression
  const exp = expression(lexemes, routine)
  typeCheck(exp, constantType)
  const value = evaluate(exp, 'C', 'constant')

  // create and return the constant
  return (typeof value === 'string')
    ? new StringConstant('C', name, value)
    : new IntegerConstant('C', name, value)
}
