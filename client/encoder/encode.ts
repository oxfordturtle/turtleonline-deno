import PCode, { pcodeArgs } from "../constants/pcodes.ts";
import type Program from "../parser/definitions/program.ts";
import type { Subroutine } from "../parser/definitions/subroutine.ts";
import type { Options } from "./options.ts";
import { defaultOptions } from "./options.ts";
import programStart from "./program/programStart.ts";
import statements from "./program/statements.ts";
import subroutines from "./program/subroutines.ts";

export default (program: Program, options: Options = defaultOptions): number[][] => {
  // get start code and end code
  const startCode = programStart(program, options);

  // calculate the start line of the first subroutine
  const subroutinesStartLine =
    program.allSubroutines.length > 0
      ? startCode.length + 2 // + 1 for jump line past subroutines
      : startCode.length + 1;

  // get the pcode for all (any) subroutines
  // N.B. this also saves the start line of each subroutine, required for
  // back-patching BASIC programs below
  const subroutinesCode = subroutines(program.allSubroutines, subroutinesStartLine, options);

  // calculate the start line of the main program
  const programStartLine = subroutinesStartLine + subroutinesCode.length;

  // generate the pcode for the main program
  const innerCode = statements(program, programStartLine, options);

  // stitch the program and subroutines pcode together
  const jumpLine = [[PCode.jump, startCode.length + subroutinesCode.length + 2]];
  const pcode =
    subroutinesCode.length > 1
      ? startCode.concat(jumpLine).concat(subroutinesCode).concat(innerCode)
      : startCode.concat(innerCode);

  // backpatch subroutine jump codes
  backpatchSubroutineCalls(program, pcode);

  // add call to the "main" subroutine for C and Java
  if (program.language === "C" || program.language === "Java") {
    // we know the main routine exists at this stage; parser1 for C will have
    // thrown an error if it doesn't
    const main = program.subroutines.find((x) => x.name === "main") as Subroutine;
    pcode.push([PCode.subr, main.startLine]);
  }

  // add HCLR codes where necessary
  addHCLR(pcode);

  // add final HALT command
  pcode.push([PCode.halt]);

  // return the pcode
  return pcode;
};

const backpatchSubroutineCalls = (program: Program, pcode: number[][]): void => {
  for (let i = 0; i < pcode.length; i += 1) {
    for (let j = 0; j < pcode[i].length; j += 1) {
      if (pcode[i][j - 1] && pcode[i][j - 1] === PCode.subr) {
        const subroutine = program.allSubroutines.find((x) => x.index === pcode[i][j]);
        if (subroutine) {
          pcode[i][j] = subroutine.startLine;
        }
      }
    }
  }
};

const addHCLR = (pcode: number[][]): void => {
  for (const line of pcode) {
    let heapStringMade = false;
    let heapStringNeeded = false;
    let lastJumpIndex: number | null = null;
    let i = 0;
    while (i < line.length) {
      if (heapStringCodes.indexOf(line[i]) >= 0) {
        heapStringMade = true;
      }
      if (line[i] === PCode.subr) {
        // maybe more cases will be needed
        heapStringNeeded = true;
      }
      if (line[i] === PCode.jump || line[i] === PCode.ifno) {
        lastJumpIndex = i;
      }
      const args = pcodeArgs(line[i]);
      i += args === -1 ? line[i + 1] + 2 : args + 1;
    }
    if (heapStringMade && !heapStringNeeded) {
      if (lastJumpIndex !== null) {
        line.splice(lastJumpIndex, 0, PCode.hclr);
      } else if (line[line.length - 1] !== PCode.hclr) {
        line.push(PCode.hclr);
      }
    }
  }
};

const heapStringCodes = [
  PCode.hstr,
  PCode.ctos,
  PCode.itos,
  PCode.hexs,
  PCode.qtos,
  PCode.smax,
  PCode.smin,
  PCode.scat,
  PCode.case,
  PCode.copy,
  PCode.dels,
  PCode.inss,
  PCode.repl,
  PCode.spad,
  PCode.lstr,
  PCode.read,
  PCode.rdln,
  PCode.frds,
  PCode.frln,
  PCode.ffnd,
  PCode.fdir,
  PCode.fnxt,
];
