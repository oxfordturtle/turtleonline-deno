import type { Memory, Options } from "./types.ts";

const turtleXIndex = 1;
const turtleYIndex = 2;
const turtleDIndex = 3;
const turtleAIndex = 4;
const turtleTIndex = 5;
const turtleCIndex = 6;

export const init = (memory: Memory, options: Options): void => {
  // set up the memory arrays
  memory.main.length = 0x200000;
  memory.keys.length = 0x100;
  memory.query.length = 0x10;
  memory.main.fill(0);
  memory.keys.fill(-1);
  memory.query.fill(-1);
  // setup the memory stacks
  memory.coords.length = 0;
  memory.stack.length = 0;
  memory.memoryStack.length = 0;
  memory.returnStack.length = 0;
  memory.subroutineStack.length = 0;
  // set up stack top and markers.heapBase markers
  memory.stackTop = 0;
  memory.heapGlobal = -1;
  memory.heapBase = options.stackSize - 1;
  memory.heapTemp = memory.heapBase;
  memory.heapPerm = memory.heapTemp;
  memory.heapMax = memory.heapTemp;
};

export const peek = (memory: Memory, address: number): number => {
  return memory.main[address];
};

export const poke = (memory: Memory, address: number, value: number): void => {
  memory.main[address] = value;
};

export const peekAddress = (memory: Memory, address: number): number => {
  return memory.main[memory.main[address]];
};

export const pokeAddress = (memory: Memory, address: number, value: number): void => {
  memory.main[memory.main[address]] = value;
};

export const peekAddressOffset = (memory: Memory, address: number, offset: number): number => {
  return memory.main[memory.main[address] + offset];
};

export const pokeAddressOffset = (
  memory: Memory,
  address: number,
  offset: number,
  value: number
): void => {
  memory.main[memory.main[address] + offset] = value;
};

export const peekKeys = (memory: Memory, address: number): number => {
  return memory.keys[address];
};

export const pokeKeys = (memory: Memory, address: number, value: number): void => {
  memory.keys[address] = value;
};

export const peekQuery = (memory: Memory, address: number): number => {
  return memory.query[address];
};

export const pokeQuery = (memory: Memory, address: number, value: number): void => {
  memory.query[address] = value;
};

export const getTurtleX = (memory: Memory): number => {
  return peekAddressOffset(memory, 0, turtleXIndex);
};

export const getTurtleY = (memory: Memory): number => {
  return peekAddressOffset(memory, 0, turtleYIndex);
};

export const getTurtleD = (memory: Memory): number => {
  return peekAddressOffset(memory, 0, turtleDIndex);
};

export const getTurtleA = (memory: Memory): number => {
  return peekAddressOffset(memory, 0, turtleAIndex);
};

export const getTurtleT = (memory: Memory): number => {
  return peekAddressOffset(memory, 0, turtleTIndex);
};

export const getTurtleC = (memory: Memory): number => {
  return peekAddressOffset(memory, 0, turtleCIndex);
};

export const setTurtleX = (memory: Memory, turtleX: number) => {
  pokeAddressOffset(memory, 0, turtleXIndex, turtleX);
};

export const setTurtleY = (memory: Memory, turtleY: number) => {
  pokeAddressOffset(memory, 0, turtleYIndex, turtleY);
};

export const setTurtleD = (memory: Memory, turtleD: number) => {
  pokeAddressOffset(memory, 0, turtleDIndex, turtleD);
};

export const setTurtleA = (memory: Memory, turtleA: number) => {
  pokeAddressOffset(memory, 0, turtleAIndex, turtleA);
};

export const setTurtleT = (memory: Memory, turtleT: number) => {
  pokeAddressOffset(memory, 0, turtleTIndex, turtleT);
};

export const setTurtleC = (memory: Memory, turtleC: number) => {
  pokeAddressOffset(memory, 0, turtleCIndex, turtleC);
};

export const getTurtle = (memory: Memory) => {
  return {
    x: getTurtleX(memory),
    y: getTurtleY(memory),
    d: getTurtleD(memory),
    a: getTurtleA(memory),
    t: getTurtleT(memory),
    c: getTurtleC(memory),
  };
};

export const getHeapGlobal = (memory: Memory): number => {
  return memory.heapGlobal;
};

export const setHeapGlobal = (memory: Memory, value: number): void => {
  memory.heapGlobal = value;
};

export const getHeapPerm = (memory: Memory): number => {
  return memory.heapPerm;
};

export const setStackTop = (memory: Memory, value: number): void => {
  memory.stackTop = Math.max(value, memory.stackTop);
};

export const getHeapTemp = (memory: Memory): number => {
  return memory.heapTemp;
};

export const setHeapTemp = (memory: Memory, value: number): void => {
  memory.heapTemp = value;
};

export const setHeapMax = (memory: Memory, value: number): void => {
  Math.max(value, memory.heapMax);
};

export const heapFix = (memory: Memory): void => {
  memory.heapPerm = memory.heapTemp;
};

export const heapClear = (memory: Memory): void => {
  if (memory.stack.length === 0) {
    // to avoid the problem of e.g.
    memory.heapTemp = memory.heapPerm; // pending string concatenation
  } else {
    memory.heapClearPending = true;
  }
};

export const delayedHeapClear = (memory: Memory): void => {
  if (memory.heapClearPending) {
    memory.heapClearPending = false;
    heapClear(memory);
  }
};

export const heapReset = (memory: Memory): void => {
  if (memory.heapGlobal > -1) {
    memory.heapTemp = memory.heapGlobal;
    memory.heapPerm = memory.heapGlobal;
  }
};

export const makeHeapString = (memory: Memory, string: string): void => {
  const stringArray = Array.from(string).map((c) => c.charCodeAt(0));
  memory.stack.push(memory.heapTemp + 1);
  memory.heapTemp += 1;
  memory.main[memory.heapTemp] = string.length;
  for (const code of stringArray) {
    memory.heapTemp += 1;
    memory.main[memory.heapTemp] = code;
  }
  memory.heapMax = Math.max(memory.heapTemp, memory.heapMax);
};

export const getHeapString = (memory: Memory, address: number): string => {
  // TODO: throw error (or something) in case there is no string at the given
  // address on the heap
  const length = memory.main[address];
  const start = address + 1;
  const charArray = memory.main.slice(start, start + length);
  const string = charArray.map((c) => String.fromCharCode(c)).join("");
  if (address + length + 1 > memory.heapPerm) {
    memory.heapTemp = address + length;
  }
  return string;
};

export const zero = (memory: Memory, start: number, length: number): void => {
  if (length > 0) {
    memory.main[start] = 0;
    zero(memory, start + 1, length - 1);
  }
};

export const copy = (memory: Memory, source: number, target: number, length: number): void => {
  if (length > 0) {
    memory.main[target] = memory.main[source];
    copy(memory, source + 1, target + 1, length - 1);
  }
};

export const dump = (memory: Memory): { stack: number[]; heap: number[]; heapBase: number } => {
  const stack = memory.main.slice(0, memory.stackTop + 1);
  const heap = memory.main.slice(memory.heapBase + 1, memory.heapMax + 1);
  return { stack, heap, heapBase: memory.heapBase + 1 };
};
