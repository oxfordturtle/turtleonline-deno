import type { Command } from "../constants/commands.ts";
import type { Language } from "../constants/languages.ts";
import PCode from "../constants/pcodes.ts";
import Program from "../parser/definitions/program.ts";

const command = (command: Command, program: Program): number[] => {
  switch (command.id) {
    case "oldTurtle":
      return [PCode.ldin, program.turtleAddress, PCode.ldin, 0, PCode.sptr];
    case "parseInt":
      return [PCode.ldin, hexPrefix[program.language], ...command.code];
    case "parseIntDef":
      return [PCode.ldin, hexPrefix[program.language], ...command.code];
    default:
      // copy the code so it can't be modified later
      return [...command.code];
  }
};

// 0 = "#", 1 = "$", 2 = "&", 3 = "0x"
const hexPrefix: Record<Language, number> = {
  BASIC: 1,
  C: 3,
  Java: 3,
  Pascal: 2,
  Python: 3,
  TypeScript: 3,
};

export default command;
