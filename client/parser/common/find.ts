import colours, { type Colour } from "../../constants/colours.ts";
import commands, { type Command } from "../../constants/commands.ts";
import inputs, { type Input } from "../../constants/inputs.ts";
import type { Constant } from "../definitions/constant.ts";
import { type Routine } from "../definitions/routine.ts";
import { getTurtleVariables } from "../definitions/routines/program.ts";
import { getProgram, type Subroutine } from "../definitions/routines/subroutine.ts";
import type { Variable } from "../definitions/variable.ts";

export const constant = (routine: Routine, name: string): Constant | undefined => {
  const searchName = routine.language === "Pascal" ? name.toLowerCase() : name;
  const match = routine.constants.find((x) => x.name === searchName);
  if (match) {
    return match;
  }
  if (routine.__ === "Subroutine") {
    return constant(routine.parent, name);
  }
};

export const colour = (routine: Routine, name: string): Colour | undefined => {
  const tempName = routine.language === "Pascal" ? name.toLowerCase() : name;
  const searchName = tempName.replace(/gray$/, "grey").replace(/GRAY$/, "GREY"); // allow American spelling
  return colours.find((x) => x.names[routine.language] === searchName);
};

export const input = (routine: Routine, name: string): Input | undefined => {
  const searchName = routine.language === "Pascal" ? name.toLowerCase() : name;
  return inputs.find((x) => x.name === searchName);
};

export const variable = (routine: Routine, name: string): Variable | undefined => {
  const searchName = routine.language === "Pascal" ? name.toLowerCase() : name;

  // look for turtle variable first
  const turtleVariables =
    routine.__ === "Program"
      ? getTurtleVariables(routine)
      : getTurtleVariables(getProgram(routine));
  const turtleVariable = turtleVariables.find((x) => x.name === searchName);
  if (turtleVariable) {
    return turtleVariable;
  }

  // for Python subroutines, look up global variables if the name is declared as global
  if (routine.language === "Python" && routine.__ === "Subroutine") {
    const isGlobal = routine.globals.indexOf(name) > -1;
    if (isGlobal) {
      return variable(getProgram(routine), name);
    }
  }

  // otherwise search this routine, then its ancestors recursively
  let match = routine.variables.find((x) => x.name === name);
  if (match === undefined && routine.__ === "Subroutine") {
    match = variable(routine.parent, name);
  }
  if (match) {
    if (match.private && match.private !== routine) {
      // only return private variables if this is their routine (BASIC only)
      return undefined;
    }
    return match;
  }
};

export const isDuplicate = (routine: Routine, name: string): boolean => {
  const searchName = routine.language === "Pascal" ? name.toLowerCase() : name;
  if (routine.constants.some((x) => x.name === searchName)) return true;
  if (routine.language === "Python" && routine.__ === "Subroutine") {
    if (routine.globals.some((x) => x === searchName)) return true;
    if (routine.nonlocals.some((x) => x === searchName)) return true;
  }
  if (routine.variables.some((x) => x.name === searchName)) return true;
  if (routine.subroutines.some((x) => x.name === searchName)) return true;
  return false;
};

export const subroutine = (routine: Routine, name: string): Subroutine | undefined => {
  const searchName = routine.language === "Pascal" ? name.toLowerCase() : name;
  // search this routine's subroutines
  const match = routine.subroutines.find((x) => x.name === searchName);
  if (match) {
    return match;
  }
  // if this is a subroutine...
  if (routine.__ === "Subroutine") {
    // check for a recursive self-reference
    // N.B. this clause is only necessary for the sake of Pascal, where
    // recursive self-references occur before the subroutine has been added to
    // its parent routine; in other languages the subroutine is added on the
    // first pass, and the self-reference checked on the second pass
    if (routine.name === searchName) {
      return routine;
    }
    // otherwise search its parents recursively
    return subroutine(routine.parent, searchName);
  }
};

export const nativeCommand = (routine: Routine, name: string): Command | undefined => {
  const searchName = routine.language === "Pascal" ? name.toLowerCase() : name;
  return commands.find((x) => x.names[routine.language] === searchName);
};

export const command = (routine: Routine, name: string): Command | Subroutine | undefined =>
  // N.B. custom subroutines have priority
  subroutine(routine, name) || nativeCommand(routine, name);
