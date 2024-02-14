import type { Language } from "../../constants/languages.ts";
import PCode from "../../constants/pcodes.ts";
import type Program from "../../parser/definitions/program.ts";
import type Variable from "../../parser/definitions/variable.ts";
import type { Options } from "../options.ts";

export default (program: Program, _options: Options): number[][] => {
  const trueValue: Record<Language, number> = {
    BASIC: -1,
    C: -1,
    Java: -1,
    Pascal: -1,
    Python: 1,
    TypeScript: 1,
  };

  // initialise start code
  const pcode = [
    // line 1: global memory
    [
      PCode.ldin,
      program.turtleAddress,
      PCode.dupl,
      PCode.dupl,
      PCode.ldin,
      0, // address of the turtle pointer
      PCode.sptr,
      PCode.ldin,
      program.turtleVariables.length,
      PCode.swap,
      PCode.sptr,
      PCode.incr,
      PCode.ldin,
      program.memoryNeeded + program.turtleVariables.length,
      PCode.zptr,
      PCode.ldin,
      program.turtleAddress + program.memoryNeeded + program.turtleVariables.length,
      PCode.stmt,
    ],
    // line 2: turtle and keybuffer setup
    [
      PCode.true,
      trueValue[program.language],
      PCode.home,
      PCode.ldin,
      2,
      PCode.thik,
      PCode.ldin,
      360,
      PCode.angl,
      PCode.ldin,
      32,
      PCode.bufr,
      PCode.ldin,
      1, // address of the keybuffer pointer
      PCode.sptr,
      PCode.hfix,
      PCode.ldin,
      0,
      PCode.dupl,
      PCode.ldin,
      1000,
      PCode.dupl,
      PCode.dupl,
      PCode.dupl,
      PCode.reso,
      PCode.canv,
    ],
  ];

  // next: setup variables
  for (const variable of program.variables) {
    const setup = setupGlobalVariable(variable);
    if (setup.length > 0) {
      pcode.push(...setup);
    }
  }

  return pcode;
};

const setupGlobalVariable = (variable: Variable): number[][] => {
  const pcode: number[][] = [];

  if (variable.isArray) {
    pcode.push([
      PCode.ldag,
      variable.lengthByteAddress,
      PCode.stvg,
      variable.address,
      PCode.ldin,
      variable.elementCount,
      PCode.stvg,
      variable.lengthByteAddress,
    ]);
    for (const subVariable of variable.subVariables) {
      const subPcode = setupGlobalVariable(subVariable);
      if (subPcode.length > 0) {
        pcode.push(...subPcode);
      }
    }
  } else if (variable.type === "string") {
    pcode.push([
      PCode.ldag,
      variable.lengthByteAddress + 1,
      PCode.stvg,
      variable.address,
      PCode.ldin,
      variable.stringLength + 1, // +1 for the actual length byte (??)
      PCode.stvg,
      variable.lengthByteAddress,
    ]);
  }

  return pcode;
};
