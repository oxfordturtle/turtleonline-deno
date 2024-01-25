import type { Memory, Options, State, VirtualCanvas } from "./types.ts";

export const initialState = (pcode: number[][], options: Options): State => ({
  // fixed state
  options,
  pcode,
  // runtime state
  running: true,
  paused: false,
  line: 0,
  code: 0,
  memory: initialMemory(options),
  virtualCanvas: { ...initialVirtualCanvas },
  canvas: document.querySelector('[data-component="canvas"]')!,
  context: (
    document.querySelector('[data-component="canvas"]') as HTMLCanvasElement
  ).getContext("2d")!,
  console: document.querySelector('[data-component="console"]')!,
  output: document.querySelector('[data-component="output"]')!,
  detectInputcode: 0,
  detectTimeoutID: 0,
  readlineTimeoutID: 0,
  startTime: Date.now(),
  update: true,
  keyecho: true,
  seed: Date.now(),
});

export const initialMemory = (options: Options): Memory => ({
  main: Array(0x200000).fill(0),
  keys: Array(0x100).fill(-1),
  query: Array(0x10).fill(-1),
  coords: [],
  stack: [],
  memoryStack: [],
  returnStack: [],
  subroutineStack: [],
  stackTop: 0,
  heapGlobal: -1,
  heapBase: options.stackSize - 1,
  heapPerm: options.stackSize - 1,
  heapTemp: options.stackSize - 1,
  heapMax: options.stackSize - 1,
  heapClearPending: false,
});

export const initialVirtualCanvas: Readonly<VirtualCanvas> = {
  startx: 0,
  starty: 0,
  sizex: 1000,
  sizey: 1000,
  width: 1000,
  height: 1000,
  doubled: false,
};

export const defaultOptions: Readonly<Options> = {
  showCanvasOnRun: true,
  showOutputOnWrite: false,
  showMemoryOnDump: true,
  drawCountMax: 4,
  codeCountMax: 100000,
  smallSize: 60,
  stackSize: 50000,
  traceOnRun: false,
  activateHCLR: true,
  preventStackCollision: true,
  rangeCheckArrays: true,
};
