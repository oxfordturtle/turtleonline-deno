import PCode from "../../constants/pcodes.ts";
import { variableValue as _variableValue } from "../../parser/definitions/expression.ts";
import type { Program, Subroutine } from "../../parser/definitions/routine.ts";
import type { VariableAssignment } from "../../parser/definitions/statement.ts";
import { isArray } from "../../parser/definitions/variable.ts";
import { subroutineAddress, turtleAddress, variableAddress } from "../addresses.ts";
import expression from "../expression.ts";
import merge from "../merge.ts";
import type { Options } from "../options.ts";

export default (
  stmt: VariableAssignment,
  program: Program,
  _startLine: number,
  options: Options
): number[][] => {
  if (stmt.variable.turtle) {
    return turtleVariableAssignment(stmt, program, options);
  }

  if (stmt.variable.isGlobal) {
    return globalVariableAssignment(stmt, program, options);
  }

  if (stmt.variable.isPointer) {
    return pointerVariableAssignment(stmt, program, options);
  }

  if (
    stmt.variable.isReferenceParameter &&
    !isArray(stmt.variable) &&
    stmt.variable.type !== "string"
  ) {
    return referenceVariableAssignment(stmt, program, options);
  }

  return localVariableAssignment(stmt, program, options);
};

const turtleVariableAssignment = (
  stmt: VariableAssignment,
  program: Program,
  options: Options
): number[][] => {
  const pcode = expression(stmt.value, program, options);

  // TODO: after NEWTURTLE??
  merge(pcode, [[PCode.stvg, turtleAddress(program) + (stmt.variable.turtle as number)]]);

  return pcode;
};

const globalVariableAssignment = (
  stmt: VariableAssignment,
  program: Program,
  options: Options
): number[][] => {
  const pcode = expression(stmt.value, program, options);

  // global array
  if (isArray(stmt.variable) || (stmt.variable.type === "string" && stmt.indexes.length > 0)) {
    const exp = _variableValue(stmt.lexeme, stmt.variable);
    exp.indexes.push(...stmt.indexes);
    const element = expression(exp, program, options);
    const lastLine = element[element.length - 1];
    if (isArray(stmt.variable) && stmt.variable.type === "string") {
      lastLine.push(PCode.cstr);
    } else {
      lastLine[lastLine.length - 1] = PCode.sptr; // change LPTR to SPTR
    }
    merge(pcode, element);
  }

  // global string
  else if (stmt.variable.type === "string") {
    merge(pcode, [[PCode.ldvg, variableAddress(stmt.variable), PCode.cstr]]);
  }

  // global boolean/character/integer
  else {
    merge(pcode, [[PCode.stvg, variableAddress(stmt.variable)]]);
  }

  return pcode;
};

const pointerVariableAssignment = (
  stmt: VariableAssignment,
  program: Program,
  options: Options
): number[][] => {
  const variableValue = _variableValue(stmt.lexeme, stmt.variable);
  const pcode = expression(variableValue, program, options);
  pcode[pcode.length - 1].pop(); // pop off PCode.peek

  merge(pcode, expression(stmt.value, program, options));

  if (stmt.variable.type === "string") {
    merge(pcode, [[PCode.cstr]]);
  } else {
    merge(pcode, [[PCode.poke]]);
  }

  return pcode;
};

const referenceVariableAssignment = (
  stmt: VariableAssignment,
  program: Program,
  options: Options
): number[][] => {
  const pcode = expression(stmt.value, program, options);

  merge(pcode, [
    [PCode.stvr, subroutineAddress(stmt.variable.routine as Subroutine), variableAddress(stmt.variable)],
  ]);

  return pcode;
};

const localVariableAssignment = (
  stmt: VariableAssignment,
  program: Program,
  options: Options
): number[][] => {
  const pcode = expression(stmt.value, program, options);

  // local array
  if (isArray(stmt.variable) || (stmt.variable.type === "string" && stmt.indexes.length > 0)) {
    const exp = _variableValue(stmt.lexeme, stmt.variable);
    exp.indexes.push(...stmt.indexes);
    const element = expression(exp, program, options);
    const lastLine = element[element.length - 1];
    if (isArray(stmt.variable) && stmt.variable.type === "string") {
      lastLine.push(PCode.cstr);
    } else {
      lastLine[lastLine.length - 1] = PCode.sptr; // change LPTR to SPTR
    }
    merge(pcode, element);
  }

  // local string
  else if (stmt.variable.type === "string") {
    merge(pcode, [
      [
        PCode.ldvv,
        subroutineAddress(stmt.variable.routine as Subroutine),
        variableAddress(stmt.variable),
        PCode.cstr,
      ],
    ]);
  }

  // local boolean/character/integer
  else {
    merge(pcode, [
      [PCode.stvv, subroutineAddress(stmt.variable.routine as Subroutine), variableAddress(stmt.variable)],
    ]);
  }

  return pcode;
};
