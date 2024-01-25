import type { Memory, Options } from "./types.ts";

// offsets for turtle properties
const turtxIndex = 1;
const turtyIndex = 2;
const turtdIndex = 3;
const turtaIndex = 4;
const turttIndex = 5;
const turtcIndex = 6;

/** initialises the machine memory */
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

/** returns the value at the given address in main memory */
export const peek = (memory: Memory, address: number): number => {
  return memory.main[address];
};

/** writes the given value at the given address in main memory */
export const poke = (memory: Memory, address: number, value: number): void => {
  memory.main[address] = value;
};

/** returns the value at the address stored at the given address */
export const peekAddress = (memory: Memory, address: number): number => {
  return memory.main[memory.main[address]];
};

/** writes the given value at the address stored at the given address */
export const pokeAddress = (
  memory: Memory,
  address: number,
  value: number
): void => {
  memory.main[memory.main[address]] = value;
};

/** returns the value at the address stored at the given address with offset */
export const peekAddressOffset = (
  memory: Memory,
  address: number,
  offset: number
): number => {
  return memory.main[memory.main[address] + offset];
};

/** writes the given value at the address stored at the given address with offset */
export const pokeAddressOffset = (
  memory: Memory,
  address: number,
  offset: number,
  value: number
): void => {
  memory.main[memory.main[address] + offset] = value;
};

/** returns the value at the given address in the keys array */
export const peekKeys = (memory: Memory, address: number): number => {
  return memory.keys[address];
};

/** writes the given value at the given address in the keys array */
export const pokeKeys = (
  memory: Memory,
  address: number,
  value: number
): void => {
  memory.keys[address] = value;
};

/** returns the value at the given address in the query array */
export const peekQuery = (memory: Memory, address: number): number => {
  return memory.query[address];
};

/** writes the given value at the given address in the query array */
export const pokeQuery = (
  memory: Memory,
  address: number,
  value: number
): void => {
  memory.query[address] = value;
};

/** gets the turtx value */
export const getTurtX = (memory: Memory): number => {
  return peekAddressOffset(memory, 0, turtxIndex);
};

/** gets the turty value */
export const getTurtY = (memory: Memory): number => {
  return peekAddressOffset(memory, 0, turtyIndex);
};

/** gets the turtd value */
export const getTurtD = (memory: Memory): number => {
  return peekAddressOffset(memory, 0, turtdIndex);
};

/** gets the turta value */
export const getTurtA = (memory: Memory): number => {
  return peekAddressOffset(memory, 0, turtaIndex);
};

/** gets the turtx value */
export const getTurtT = (memory: Memory): number => {
  return peekAddressOffset(memory, 0, turttIndex);
};

/** gets the turtc value */
export const getTurtC = (memory: Memory): number => {
  return peekAddressOffset(memory, 0, turtcIndex);
};

/** sets the turtx value */
export const setTurtX = (memory: Memory, turtx: number) => {
  pokeAddressOffset(memory, 0, turtxIndex, turtx);
};

/** sets the turty value */
export const setTurtY = (memory: Memory, turty: number) => {
  pokeAddressOffset(memory, 0, turtyIndex, turty);
};

/** sets the turtd value */
export const setTurtD = (memory: Memory, turtd: number) => {
  pokeAddressOffset(memory, 0, turtdIndex, turtd);
};

/** sets the turta value */
export const setTurtA = (memory: Memory, turta: number) => {
  pokeAddressOffset(memory, 0, turtaIndex, turta);
};

/** sets the turtx value */
export const setTurtT = (memory: Memory, turtt: number) => {
  pokeAddressOffset(memory, 0, turttIndex, turtt);
};

/** sets the turtc value */
export const setTurtC = (memory: Memory, turtc: number) => {
  pokeAddressOffset(memory, 0, turtcIndex, turtc);
};

/** gets all Turtle properties */
export const getTurtle = (memory: Memory) => {
  return {
    x: getTurtX(memory),
    y: getTurtY(memory),
    d: getTurtD(memory),
    a: getTurtA(memory),
    t: getTurtT(memory),
    c: getTurtC(memory),
  };
};

/** gets the heap global */
export const getHeapGlobal = (memory: Memory): number => {
  return memory.heapGlobal;
};

/** sets the heap global */
export const setHeapGlobal = (memory: Memory, value: number): void => {
  memory.heapGlobal = value;
};

/** gets the heap perm */
export const getHeapPerm = (memory: Memory): number => {
  return memory.heapPerm;
};

/** sets the stack top */
export const setStackTop = (memory: Memory, value: number): void => {
  memory.stackTop = Math.max(value, memory.stackTop);
};

/** gets the heap temp value */
export const getHeapTemp = (memory: Memory): number => {
  return memory.heapTemp;
};

/** sets the heap temp value */
export const setHeapTemp = (memory: Memory, value: number): void => {
  memory.heapTemp = value;
};

/** sets the heap max value */
export const setHeapMax = (memory: Memory, value: number): void => {
  Math.max(value, memory.heapMax);
};

/** fixes the top of the heap */
export const heapFix = (memory: Memory): void => {
  memory.heapPerm = memory.heapTemp;
};

/** clears the heap */
export const heapClear = (memory: Memory): void => {
  if (memory.stack.length === 0) {
    // to avoid the problem of e.g.
    memory.heapTemp = memory.heapPerm; // pending string concatenation
  } else {
    memory.heapClearPending = true;
  }
};

/** executes a delayed heap clear (called at the start of each cycle) */
export const delayedHeapClear = (memory: Memory): void => {
  if (memory.heapClearPending) {
    memory.heapClearPending = false;
    heapClear(memory);
  }
};

/** resets the heap */
export const heapReset = (memory: Memory): void => {
  if (memory.heapGlobal > -1) {
    memory.heapTemp = memory.heapGlobal;
    memory.heapPerm = memory.heapGlobal;
  }
};

/** makes a string on the heap */
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

/** gets a string from the heap */
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

/** fills a chunk of main memory with zeros */
export const zero = (memory: Memory, start: number, length: number): void => {
  if (length > 0) {
    memory.main[start] = 0;
    zero(memory, start + 1, length - 1);
  }
};

/** copies one chunk of memory into another */
export const copy = (
  memory: Memory,
  source: number,
  target: number,
  length: number
): void => {
  if (length > 0) {
    memory.main[target] = memory.main[source];
    copy(memory, source + 1, target + 1, length - 1);
  }
};

/** exports the contents of the main memory (for display) */
export const dump = (
  memory: Memory
): { stack: number[]; heap: number[]; heapBase: number } => {
  const stack = memory.main.slice(0, memory.stackTop + 1);
  const heap = memory.main.slice(memory.heapBase + 1, memory.heapMax + 1);
  return { stack, heap, heapBase: memory.heapBase + 1 };
};
