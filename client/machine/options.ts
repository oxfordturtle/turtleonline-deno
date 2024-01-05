import type { Options } from "./types.ts";
import { defaults } from "../constants/properties.ts";

export const defaultOptions: Options = {
  showCanvasOnRun: defaults.showCanvasOnRun,
  showOutputOnWrite: defaults.showOutputOnWrite,
  showMemoryOnDump: defaults.showMemoryOnDump,
  drawCountMax: defaults.drawCountMax,
  codeCountMax: defaults.codeCountMax,
  smallSize: defaults.smallSize,
  stackSize: defaults.stackSize,
  traceOnRun: defaults.traceOnRun,
  activateHCLR: defaults.activateHCLR,
  preventStackCollision: defaults.preventStackCollision,
  rangeCheckArrays: defaults.rangeCheckArrays,
};
