import PCode from "../../constants/pcodes.ts";
import { VariableValue } from "../../parser/definitions/expression.ts";
import type Program from "../../parser/definitions/program.ts";
import { VariableAssignment } from "../../parser/definitions/statement.ts";
import type { Subroutine } from "../../parser/definitions/subroutine.ts";
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
    !stmt.variable.isArray &&
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
  if (stmt.variable.isArray || (stmt.variable.type === "string" && stmt.indexes.length > 0)) {
    const exp = new VariableValue(stmt.lexeme as any, stmt.variable);
    exp.indexes.push(...stmt.indexes);
    const element = expression(exp, program, options);
    const lastLine = element[element.length - 1];
    if (stmt.variable.isArray && stmt.variable.type === "string") {
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
  const variableValue = new VariableValue(stmt.lexeme as any, stmt.variable);
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
  if (stmt.variable.isArray || (stmt.variable.type === "string" && stmt.indexes.length > 0)) {
    const exp = new VariableValue(stmt.lexeme as any, stmt.variable);
    exp.indexes.push(...stmt.indexes);
    const element = expression(exp, program, options);
    const lastLine = element[element.length - 1];
    if (stmt.variable.isArray && stmt.variable.type === "string") {
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
