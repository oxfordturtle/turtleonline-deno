import type { Memory, Turtle, VirtualCanvas } from "./types.ts";
import {
  getTurtleA,
  getTurtleC,
  getTurtleD,
  getTurtleT,
  getTurtleX,
  getTurtleY,
} from "./memory.ts";

export const turtle = (memory: Memory, virtualCanvas: VirtualCanvas): Turtle => ({
  x: turtleX(virtualCanvas, getTurtleX(memory)),
  y: turtleY(virtualCanvas, getTurtleY(memory)),
  d: getTurtleD(memory),
  a: getTurtleA(memory),
  p: turtleT(virtualCanvas, getTurtleT(memory)),
  c: `#${getTurtleC(memory).toString(16).padStart(6, "0")}`,
});

export const turtleX = (virtualCanvas: VirtualCanvas, x: number): number => {
  const exact = ((x - virtualCanvas.startX) * virtualCanvas.width) / virtualCanvas.sizeX;
  return virtualCanvas.doubled ? Math.round(exact) + 1 : Math.round(exact);
};

export const turtleY = (virtualCanvas: VirtualCanvas, y: number): number => {
  const exact = ((y - virtualCanvas.startY) * virtualCanvas.height) / virtualCanvas.sizeY;
  return virtualCanvas.doubled ? Math.round(exact) + 1 : Math.round(exact);
};

export const turtleT = (virtualCanvas: VirtualCanvas, t: number): number => {
  return virtualCanvas.doubled ? t * 2 : t;
};

export const virtualCoords = (
  virtualCanvas: VirtualCanvas,
  coords: [number, number]
): [number, number] => [turtleX(virtualCanvas, coords[0]), turtleY(virtualCanvas, coords[1])];

export const virtualX = (
  canvas: HTMLCanvasElement,
  virtualCanvas: VirtualCanvas,
  x: number
): number => {
  const { left, width } = canvas.getBoundingClientRect();
  const exact = ((x - left) * virtualCanvas.sizeX) / width + virtualCanvas.startX;
  return Math.floor(exact);
};

export const virtualY = (
  canvas: HTMLCanvasElement,
  virtualCanvas: VirtualCanvas,
  y: number
): number => {
  const { height, top } = canvas.getBoundingClientRect();
  const exact = ((y - top) * virtualCanvas.sizeY) / height + virtualCanvas.startY;
  return Math.floor(exact);
};
