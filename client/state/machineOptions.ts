import { createState } from "../elementary/index.ts";

const initialState = {
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

const sessionKeys = Object.keys(initialState) as (keyof typeof initialState)[];

const state = createState(initialState, { sessionKeys });

export default state;
