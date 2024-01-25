import type { Memory, Turtle, VirtualCanvas } from "./types.ts";
import hex from "../tools/hex.ts";
import { getTurtA, getTurtC, getTurtD, getTurtT, getTurtX, getTurtY } from "./memory.ts";

export const turtle = (memory: Memory, virtualCanvas: VirtualCanvas): Turtle => ({
  x: turtx(virtualCanvas, getTurtX(memory)),
  y: turty(virtualCanvas, getTurtY(memory)),
  d: getTurtD(memory),
  a: getTurtA(memory),
  p: turtt(virtualCanvas, getTurtT(memory)),
  c: hex(getTurtC(memory)),
});

/** converts turtx to virtual canvas coordinate */
export const turtx = (virtualCanvas: VirtualCanvas, x: number): number => {
  const exact =
    ((x - virtualCanvas.startx) * virtualCanvas.width) / virtualCanvas.sizex;
  return virtualCanvas.doubled ? Math.round(exact) + 1 : Math.round(exact);
};

/** converts turty to virtual canvas coordinate */
export const turty = (virtualCanvas: VirtualCanvas, y: number): number => {
  const exact =
    ((y - virtualCanvas.starty) * virtualCanvas.height) / virtualCanvas.sizey;
  return virtualCanvas.doubled ? Math.round(exact) + 1 : Math.round(exact);
};

/** converts turtt to virtual canvas thickness */
export const turtt = (virtualCanvas: VirtualCanvas, t: number): number => {
  return virtualCanvas.doubled ? t * 2 : t;
};

/** maps turtle coordinates to virtual turtle coordinates */
export const vcoords = (
  virtualCanvas: VirtualCanvas,
  coords: [number, number]
): [number, number] => [
  turtx(virtualCanvas, coords[0]),
  turty(virtualCanvas, coords[1]),
];

/** converts x to virtual canvas coordinate */
export const virtx = (
  canvas: HTMLCanvasElement,
  virtualCanvas: VirtualCanvas,
  x: number
): number => {
  const { left, width } = canvas.getBoundingClientRect();
  const exact =
    ((x - left) * virtualCanvas.sizex) / width + virtualCanvas.startx;
  return Math.floor(exact);
};

/** converts y to virtual canvas coordinate */
export const virty = (
  canvas: HTMLCanvasElement,
  virtualCanvas: VirtualCanvas,
  y: number
): number => {
  const { height, top } = canvas.getBoundingClientRect();
  const exact =
    ((y - top) * virtualCanvas.sizey) / height + virtualCanvas.starty;
  return Math.floor(exact);
};
