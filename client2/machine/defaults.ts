import type { Memory, Options, State, VirtualCanvas } from "./types.ts";

export const initialState = (pCode: number[][], options: Options): State => ({
  // fixed state
  options,
  pCode,
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
  detectInputCode: 0,
  detectTimeoutID: 0,
  readlineTimeoutID: 0,
  startTime: Date.now(),
  update: true,
  keyEcho: true,
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
  startX: 0,
  startY: 0,
  sizeX: 1000,
  sizeY: 1000,
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
  activateHeapClear: true,
  preventStackCollision: true,
  rangeCheckArrays: true,
};
