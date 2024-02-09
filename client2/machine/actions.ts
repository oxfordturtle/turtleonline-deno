import type { State } from "./types.ts";
import * as canvas from "./canvas.ts";
import colours from "../constants/colours.ts";
import hex from "../tools/hex.ts";
import * as systemState from "../tools/hub.ts";
import * as memory from "./memory.ts";
import { mixBytes } from "./misc.ts";
import { turtle, turtleX, turtleY, virtualCoords } from "./turtle.ts";
import type { ActionResult } from "./types.ts";

export const doNothing = (state: State): ActionResult => ({
  state,
  drawn: false,
  halted: false,
});

export const notImplemented = (state: State): ActionResult => {
  return {
    state,
    error:
      "File processing has not yet been implemented in the online Turtle System. We are working on introducing this very soon. In the meantime, please run this program using the downloable system.",
  };
};

export const duplicate = (state: State): ActionResult => {
  const n1 = state.memory.stack.pop();
  if (n1 === undefined) {
    return {
      state,
      error: "Stack operation called on empty stack.",
    };
  }
  state.memory.stack.push(n1, n1);
  return { state };
};

export const swap = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 === undefined || n2 === undefined) {
    return {
      state,
      error: "Stack operation called on empty stack.",
    };
  }
  state.memory.stack.push(n2, n1);
  return { state };
};

export const rotate = (state: State): ActionResult => {
  const n3 = state.memory.stack.pop();
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 === undefined || n2 === undefined || n3 === undefined) {
    return {
      state,
      error: "Stack operation called on empty stack.",
    };
  }
  state.memory.stack.push(n2, n3, n1);
  return { state };
};

export const incr = (state: State): ActionResult => {
  const n1 = state.memory.stack.pop();
  if (n1 === undefined) {
    return {
      state,
      error: "Stack operation called on empty stack.",
    };
  }
  state.memory.stack.push(n1 + 1);
  return { state };
};

export const decr = (state: State): ActionResult => {
  const n1 = state.memory.stack.pop();
  if (n1 === undefined) {
    return {
      state,
      error: "Stack operation called on empty stack.",
    };
  }
  state.memory.stack.push(n1 - 1);
  return { state };
};

export const mxin = (state: State): ActionResult => {
  state.memory.stack.push(Math.pow(2, 31) - 1);
  return { state };
};

export const rand = (state: State): ActionResult => {
  const n1 = state.memory.stack.pop();
  if (n1 === undefined) {
    return {
      state,
      error: "Stack operation called on empty stack.",
    };
  }
  const n2 = Math.sin(state.seed++) * 10000;
  const n3 = n2 - Math.floor(n2);
  state.memory.stack.push(Math.floor(n3 * Math.abs(n1)));
  return { state };
};

export const hstr = (state: State): ActionResult => {
  const n1 = state.memory.stack.pop();
  if (n1 === undefined) {
    return {
      state,
      error: "Stack operation called on empty stack.",
    };
  }
  const s1 = memory.getHeapString(state.memory, n1);
  memory.makeHeapString(state.memory, s1);
  return { state };
};

export const ctos = (state: State): ActionResult => {
  const n1 = state.memory.stack.pop();
  if (n1 === undefined) {
    return {
      state,
      error: "Stack operation called on empty stack.",
    };
  }
  memory.makeHeapString(state.memory, String.fromCharCode(n1));
  return { state };
};

export const sasc = (state: State): ActionResult => {
  const n1 = state.memory.stack.pop();
  if (n1 === undefined) {
    return {
      state,
      error: "Stack operation called on empty stack.",
    };
  }
  const s1 = memory.getHeapString(state.memory, n1);
  if (s1.length === 0) {
    state.memory.stack.push(0);
  } else {
    state.memory.stack.push(s1.charCodeAt(0));
  }
  return { state };
};

export const itos = (state: State): ActionResult => {
  const n1 = state.memory.stack.pop();
  if (n1 === undefined) {
    return {
      state,
      error: "Stack operation called on empty stack.",
    };
  }
  memory.makeHeapString(state.memory, n1.toString(10));
  return { state };
};

export const hexs = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 === undefined || n2 === undefined) {
    return {
      state,
      error: "Stack operation called on empty stack.",
    };
  }
  let s1 = n1.toString(16).toUpperCase();
  while (s1.length < n2) {
    s1 = "0" + s1;
  }
  memory.makeHeapString(state.memory, s1);
  return { state };
};

export const sval = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 === undefined || n2 === undefined) {
    return {
      state,
      error: "Stack operation called on empty stack.",
    };
  }
  const s1 = memory.getHeapString(state.memory, n1);
  let n3;
  if (s1[0] === "#") {
    n3 = isNaN(parseInt(s1.slice(1), 16)) ? n2 : parseInt(s1.slice(1), 16);
  } else {
    n3 = isNaN(parseInt(s1, 10)) ? n2 : parseInt(s1, 10);
  }
  state.memory.stack.push(n3);
  return { state };
};

export const qtos = (state: State): ActionResult => {
  const n4 = state.memory.stack.pop();
  const n3 = state.memory.stack.pop();
  const n2 = state.memory.stack.pop();
  if (n2 === undefined || n3 === undefined || n4 === undefined) {
    return {
      state,
      error: "Stack operation called on empty stack.",
    };
  }
  const n1 = n2 / n3;
  memory.makeHeapString(state.memory, n1.toFixed(n4));
  return { state };
};

export const qval = (state: State): ActionResult => {
  const n3 = state.memory.stack.pop();
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 === undefined || n2 === undefined || n3 === undefined) {
    return { state, error: "Stack operation called on empty stack." };
  }
  const s1 = memory.getHeapString(state.memory, n1);
  const n4 = isNaN(parseFloat(s1)) ? n3 : parseFloat(s1);
  state.memory.stack.push(Math.round(n4 * n2));
  return { state };
};

// 0x10s - Boolean operators, integer operators
export const not = (state: State): ActionResult => {
  const n1 = state.memory.stack.pop();
  if (n1 === undefined) {
    return { state, error: "Stack operation called on empty stack." };
  }
  state.memory.stack.push(~n1);
  return { state };
};

export const and = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 === undefined || n2 === undefined) {
    return { state, error: "Stack operation called on empty stack." };
  }
  state.memory.stack.push(n1 & n2);
  return { state };
};

export const or = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 === undefined || n2 === undefined) {
    return { state, error: "Stack operation called on empty stack." };
  }
  state.memory.stack.push(n1 | n2);
  return { state };
};

export const xor = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 === undefined || n2 === undefined) {
    return { state, error: "Stack operation called on empty stack." };
  }
  state.memory.stack.push(n1 ^ n2);
  return { state };
};

export const andl = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 === undefined || n2 === undefined) {
    return { state, error: "Stack operation called on empty stack." };
  }
  state.memory.stack.push(n1 && n2);
  return { state };
};

export const orl = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 === undefined || n2 === undefined) {
    return { state, error: "Stack operation called on empty stack." };
  }
  state.memory.stack.push(n1 || n2);
  return { state };
};

export const shft = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 === undefined || n2 === undefined) {
    return { state, error: "Stack operation called on empty stack." };
  }
  state.memory.stack.push(n2 < 0 ? n1 << -n2: n1 >> n2);
  return { state };
};

export const neg = (state: State): ActionResult => {
  const n1 = state.memory.stack.pop();
  if (n1 === undefined) {
    return { state, error: "Stack operation called on empty stack." };
  }
  state.memory.stack.push(-n1);
  return { state };
};

export const abs = (state: State): ActionResult => {
  const n1 = state.memory.stack.pop();
  if (n1 === undefined) {
    return { state, error: "Stack operation called on empty stack." };
  }
  state.memory.stack.push(Math.abs(n1));
  return { state };
};

export const sign = (state: State): ActionResult => {
  const n1 = state.memory.stack.pop();
  if (n1 === undefined) {
    return { state, error: "Stack operation called on empty stack." };
  }
  state.memory.stack.push(Math.sign(n1));
  return { state };
};

export const plus = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 === undefined || n2 === undefined) {
    return { state, error: "Stack operation called on empty stack." };
  }
  state.memory.stack.push(n1 + n2);
  return { state };
};

export const subt = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 === undefined || n2 === undefined) {
    return { state, error: "Stack operation called on empty stack." };
  }
  state.memory.stack.push(n1 - n2);
  return { state };
};

export const mult = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 === undefined || n2 === undefined) {
    return { state, error: "Stack operation called on empty stack." };
  }
  state.memory.stack.push(n1 * n2);
  return { state };
};

export const divr = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 === undefined || n2 === undefined) {
    return { state, error: "Stack operation called on empty stack." };
  }
  if (n2 === 0) {
    return { state, error: "Cannot divide by zero." };
  }
  const n3 = n1 / n2;
  state.memory.stack.push(Math.round(n3));
  return { state };
};

export const div = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 === undefined || n2 === undefined) {
    return { state, error: "Stack operation called on empty stack." };
  }
  if (n2 === 0) {
    return { state, error: "Cannot divide by zero." };
  }
  const n3 = n1 / n2;
  state.memory.stack.push(n3 > 0 ? Math.floor(n3) : Math.ceil(n3));
  return { state };
};

export const mod = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 === undefined || n2 === undefined) {
    return { state, error: "Stack operation called on empty stack." };
  }
  state.memory.stack.push(n1 % n2);
  return { state };
};

// 0x20s - comparison operators
export const eqal = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined) {
    state.memory.stack.push(n1 === n2 ? -1 : 0);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const noeq = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined) {
    state.memory.stack.push(n1 !== n2 ? -1 : 0);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const less = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined) {
    state.memory.stack.push(n1 < n2 ? -1 : 0);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const more = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined) {
    state.memory.stack.push(n1 > n2 ? -1 : 0);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const lseq = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined) {
    state.memory.stack.push(n1 <= n2 ? -1 : 0);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const mreq = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined) {
    state.memory.stack.push(n1 >= n2 ? -1 : 0);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const maxi = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined) {
    state.memory.stack.push(Math.max(n1, n2));
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const mini = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined) {
    state.memory.stack.push(Math.min(n1, n2));
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const seql = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined) {
    const s2 = memory.getHeapString(state.memory, n2);
    const s1 = memory.getHeapString(state.memory, n1);
    state.memory.stack.push(s1 === s2 ? -1 : 0);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const sneq = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined) {
    const s2 = memory.getHeapString(state.memory, n2);
    const s1 = memory.getHeapString(state.memory, n1);
    state.memory.stack.push(s1 !== s2 ? -1 : 0);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const sles = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined) {
    const s2 = memory.getHeapString(state.memory, n1);
    const s1 = memory.getHeapString(state.memory, n2);
    state.memory.stack.push(s1 < s2 ? -1 : 0);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const smor = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined) {
    const s2 = memory.getHeapString(state.memory, n2);
    const s1 = memory.getHeapString(state.memory, n1);
    state.memory.stack.push(s1 > s2 ? -1 : 0);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const sleq = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined) {
    const s2 = memory.getHeapString(state.memory, n2);
    const s1 = memory.getHeapString(state.memory, n1);
    state.memory.stack.push(s1 <= s2 ? -1 : 0);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const smeq = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined) {
    const s2 = memory.getHeapString(state.memory, n2);
    const s1 = memory.getHeapString(state.memory, n1);
    state.memory.stack.push(s1 >= s2 ? -1 : 0);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const smax = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined) {
    const s2 = memory.getHeapString(state.memory, n2);
    const s1 = memory.getHeapString(state.memory, n1);
    memory.makeHeapString(state.memory, s2 > s1 ? s2 : s1);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const smin = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined) {
    const s2 = memory.getHeapString(state.memory, n2);
    const s1 = memory.getHeapString(state.memory, n1);
    memory.makeHeapString(state.memory, s2 < s1 ? s2 : s1);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

// 0x30s - pseudo-real operators
export const divm = (state: State): ActionResult => {
  const n3 = state.memory.stack.pop();
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined && n3 !== undefined) {
    state.memory.stack.push(Math.round((n1 / n2) * n3));
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const sqrt = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined) {
    state.memory.stack.push(Math.round(Math.sqrt(n1) * n2));
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const hyp = (state: State): ActionResult => {
  const n3 = state.memory.stack.pop();
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined && n3 !== undefined) {
    state.memory.stack.push(Math.round(Math.sqrt(n1 * n1 + n2 * n2) * n3));
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const root = (state: State): ActionResult => {
  const n4 = state.memory.stack.pop();
  const n3 = state.memory.stack.pop();
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined && n3 !== undefined && n4 !== undefined) {
    state.memory.stack.push(Math.round(Math.pow(n1 / n2, 1 / n3) * n4));
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const powr = (state: State): ActionResult => {
  const n4 = state.memory.stack.pop();
  const n3 = state.memory.stack.pop();
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined && n3 !== undefined && n4 !== undefined) {
    state.memory.stack.push(Math.round(Math.pow(n1 / n2, n3) * n4));
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const log = (state: State): ActionResult => {
  const n3 = state.memory.stack.pop();
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined && n3 !== undefined) {
    state.memory.stack.push(Math.round((Math.log(n1 / n2) / Math.LN10) * n3));
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const alog = (state: State): ActionResult => {
  const n3 = state.memory.stack.pop();
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined && n3 !== undefined) {
    state.memory.stack.push(Math.round(Math.pow(10, n1 / n2) * n3));
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const ln = (state: State): ActionResult => {
  const n3 = state.memory.stack.pop();
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined && n3 !== undefined) {
    state.memory.stack.push(Math.round(Math.log(n1 / n2) * n3));
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const exp = (state: State): ActionResult => {
  const n3 = state.memory.stack.pop();
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined && n3 !== undefined) {
    state.memory.stack.push(Math.round(Math.exp(n1 / n2) * n3));
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const sin = (state: State): ActionResult => {
  const n4 = state.memory.stack.pop();
  const n3 = state.memory.stack.pop();
  const n2 = state.memory.stack.pop();
  if (n2 !== undefined && n3 !== undefined && n4 !== undefined) {
    const n1 = ((n2 / n3) * (2 * Math.PI)) / memory.getTurtA(state.memory);
    state.memory.stack.push(Math.round(Math.sin(n1) * n4));
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const cos = (state: State): ActionResult => {
  const n4 = state.memory.stack.pop();
  const n3 = state.memory.stack.pop();
  const n2 = state.memory.stack.pop();
  if (n2 !== undefined && n3 !== undefined && n4 !== undefined) {
    const n1 = ((n2 / n3) * (2 * Math.PI)) / memory.getTurtA(state.memory);
    state.memory.stack.push(Math.round(Math.cos(n1) * n4));
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const tan = (state: State): ActionResult => {
  const n4 = state.memory.stack.pop();
  const n3 = state.memory.stack.pop();
  const n2 = state.memory.stack.pop();
  if (n2 !== undefined && n3 !== undefined && n4 !== undefined) {
    const n1 = ((n2 / n3) * (2 * Math.PI)) / memory.getTurtA(state.memory);
    state.memory.stack.push(Math.round(Math.tan(n1) * n4));
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const asin = (state: State): ActionResult => {
  const n4 = state.memory.stack.pop();
  const n3 = state.memory.stack.pop();
  const n2 = state.memory.stack.pop();
  if (n2 !== undefined && n3 !== undefined && n4 !== undefined) {
    const n1 = memory.getTurtA(state.memory) / (2 * Math.PI);
    state.memory.stack.push(Math.round(Math.asin(n2 / n3) * n4 * n1));
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const acos = (state: State): ActionResult => {
  const n4 = state.memory.stack.pop();
  const n3 = state.memory.stack.pop();
  const n2 = state.memory.stack.pop();
  if (n2 !== undefined && n3 !== undefined && n4 !== undefined) {
    const n1 = memory.getTurtA(state.memory) / (2 * Math.PI);
    state.memory.stack.push(Math.round(Math.acos(n2 / n3) * n4 * n1));
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const atan = (state: State): ActionResult => {
  const n4 = state.memory.stack.pop();
  const n3 = state.memory.stack.pop();
  const n2 = state.memory.stack.pop();
  if (n2 !== undefined && n3 !== undefined && n4 !== undefined) {
    const n1 = memory.getTurtA(state.memory) / (2 * Math.PI);
    state.memory.stack.push(Math.round(Math.atan2(n2, n3) * n4 * n1));
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const pi = (state: State): ActionResult => {
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined) {
    state.memory.stack.push(Math.round(Math.PI * n1));
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

// 0x40s - string operators
export const scat = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined) {
    const s2 = memory.getHeapString(state.memory, n2);
    const s1 = memory.getHeapString(state.memory, n1);
    memory.makeHeapString(state.memory, s1 + s2);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const slen = (state: State): ActionResult => {
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined) {
    state.memory.stack.push(state.memory.main[n1]);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const stringCase = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined) {
    let s1 = memory.getHeapString(state.memory, n1);
    switch (n2) {
      case 1:
        // lowercase
        memory.makeHeapString(state.memory, s1.toLowerCase());
        break;
      case 2:
        // uppercase
        memory.makeHeapString(state.memory, s1.toUpperCase());
        break;
      case 3:
        // capitalise first letter
        if (s1.length > 0) {
          memory.makeHeapString(state.memory, s1[0].toUpperCase() + s1.slice(1));
        } else {
          memory.makeHeapString(state.memory, s1);
        }
        break;
      case 4:
        // capitalise first letter of each word (and make the rest lowercase)
        s1 = s1
          .split(" ")
          .map((x) => x[0].toUpperCase() + x.slice(1).toLowerCase())
          .join(" ");
        memory.makeHeapString(state.memory, s1);
        break;
      case 5:
        // swap case
        s1 = s1
          .split("")
          .map((x) => (x === x.toLowerCase() ? x.toUpperCase() : x.toLowerCase()))
          .join("");
        memory.makeHeapString(state.memory, s1);
        break;
      default:
        // this should be impossible
        memory.makeHeapString(state.memory, s1);
        break;
    }
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const copy = (state: State): ActionResult => {
  const n3 = state.memory.stack.pop();
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined && n3 !== undefined) {
    const s1 = memory.getHeapString(state.memory, n1);
    memory.makeHeapString(state.memory, s1.substr(n2 - 1, n3));
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const dels = (state: State): ActionResult => {
  const n4 = state.memory.stack.pop();
  const n3 = state.memory.stack.pop();
  const n2 = state.memory.stack.pop();
  if (n2 !== undefined && n3 !== undefined && n4 !== undefined) {
    const s2 = memory.getHeapString(state.memory, n2);
    const s1 = s2.substr(0, n3 - 1) + s2.substr(n3 - 1 + n4);
    memory.makeHeapString(state.memory, s1);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const inss = (state: State): ActionResult => {
  const n4 = state.memory.stack.pop();
  const n3 = state.memory.stack.pop();
  const n2 = state.memory.stack.pop();
  if (n2 !== undefined && n3 !== undefined && n4 !== undefined) {
    const s3 = memory.getHeapString(state.memory, n3);
    const s2 = memory.getHeapString(state.memory, n2);
    const s1 = s3.substr(0, n4 - 1) + s2 + s3.substr(n4 - 1);
    memory.makeHeapString(state.memory, s1);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const poss = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined) {
    const s2 = memory.getHeapString(state.memory, n2);
    const s1 = memory.getHeapString(state.memory, n1);
    state.memory.stack.push(s2.indexOf(s1) + 1);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const repl = (state: State): ActionResult => {
  let n4 = state.memory.stack.pop();
  const n3 = state.memory.stack.pop();
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined && n3 !== undefined && n4 !== undefined) {
    const s3 = memory.getHeapString(state.memory, n3);
    const s2 = memory.getHeapString(state.memory, n2);
    let s1 = memory.getHeapString(state.memory, n1);
    if (n4 > 0) {
      while (n4 > 0) {
        s1 = s1.replace(s2, s3);
        n4 = n4 - 1;
      }
      memory.makeHeapString(state.memory, s1);
    } else {
      memory.makeHeapString(state.memory, s1.replace(new RegExp(s2, "g"), s3));
    }
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const spad = (state: State): ActionResult => {
  const n3 = state.memory.stack.pop();
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined && n3 !== undefined) {
    const s2 = memory.getHeapString(state.memory, n2);
    let s1 = memory.getHeapString(state.memory, n1);
    while (s1.length + s2.length <= Math.abs(n3)) {
      if (n3 < 0) {
        s1 = s1 + s2;
      } else {
        s1 = s2 + s1;
      }
    }
    memory.makeHeapString(state.memory, s1);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const trim = (state: State): ActionResult => {
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined) {
    const s1 = memory.getHeapString(state.memory, n1);
    memory.makeHeapString(state.memory, s1.trim());
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

// 0x50s - turtle settings and movement
export const home = (state: State): ActionResult => {
  const n1 = state.virtualCanvas.startx + state.virtualCanvas.sizex / 2;
  const n2 = state.virtualCanvas.starty + state.virtualCanvas.sizey / 2;
  memory.setTurtX(state.memory, Math.round(n1));
  memory.setTurtY(state.memory, Math.round(n2));
  memory.setTurtD(state.memory, 0);
  send("turtxChanged", memory.getTurtX(state.memory));
  send("turtyChanged", memory.getTurtY(state.memory));
  send("turtdChanged", memory.getTurtD(state.memory));
  state.memory.coords.push([memory.getTurtX(state.memory), memory.getTurtY(state.memory)]);
};

export const setx = (state: State): ActionResult => {
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined) {
    memory.setTurtX(state.memory, n1);
    send("turtxChanged", n1);
    state.memory.coords.push([memory.getTurtX(state.memory), memory.getTurtY(state.memory)]);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const sety = (state: State): ActionResult => {
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined) {
    memory.setTurtY(state.memory, n1);
    send("turtyChanged", n1);
    state.memory.coords.push([memory.getTurtX(state.memory), memory.getTurtY(state.memory)]);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const setd = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  if (n2 !== undefined) {
    const n1 = n2 % memory.getTurtA(state.memory);
    memory.setTurtD(state.memory, n1);
    send("turtdChanged", n1);
  }
};

export const angl = (state: State): ActionResult => {
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined) {
    if (memory.getTurtA(state.memory) === 0) {
      // this should only happen at the start of the program before angles is set for the first time
      memory.setTurtA(state.memory, n1);
    }
    if (n1 === 0) {
      // never let angles be set to zero
      return { state, error: "Angles cannot be set to zero." };
    }
    const n2 = Math.round(
      n1 + (memory.getTurtD(state.memory) * n1) / memory.getTurtA(state.memory)
    );
    memory.setTurtD(state.memory, n2 % n1);
    memory.setTurtA(state.memory, n1);
    send("turtdChanged", n2 % n1);
    send("turtaChanged", n1);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const thik = (state: State): ActionResult => {
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined) {
    const n2 = Math.abs(n1);
    const bool1 = n1 < 0;
    const bool2 = memory.getTurtT(state.memory) < 0;
    if (bool1) {
      // reverse pen status
      memory.setTurtT(state.memory, bool2 ? n2 : -n2);
    } else {
      // leave pen status as it is
      memory.setTurtT(state.memory, bool2 ? -n2 : n2);
    }
    send("turttChanged", memory.getTurtT(state.memory));
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const colr = (state: State): ActionResult => {
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined) {
    memory.setTurtC(state.memory, n1);
    send("turtcChanged", hex(n1));
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const pen = (state: State): ActionResult => {
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined) {
    const bool1 = n1 !== 0; // pen up or down
    const n2 = Math.abs(memory.getTurtT(state.memory)); // current thickness
    const n3 = bool1 ? n2 : -n2; // positive or negative depending on whether pen is down or up
    memory.setTurtT(state.memory, n3);
    send("turttChanged", n3);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const toxy = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined) {
    memory.setTurtX(state.memory, n1);
    memory.setTurtY(state.memory, n2);
    send("turtxChanged", n1);
    send("turtyChanged", n2);
    state.memory.coords.push([n1, n2]);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const mvxy = (state: State): ActionResult => {
  let n2 = state.memory.stack.pop();
  let n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined) {
    n2 += memory.getTurtY(state.memory);
    n1 += memory.getTurtX(state.memory);
    memory.setTurtX(state.memory, n1);
    memory.setTurtY(state.memory, n2);
    send("turtxChanged", n1);
    send("turtyChanged", n2);
    state.memory.coords.push([n1, n2]);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const drxy = (state: State): ActionResult => {
  let n2 = state.memory.stack.pop();
  let n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined) {
    n2 += memory.getTurtY(state.memory);
    n1 += memory.getTurtX(state.memory);
    if (memory.getTurtT(state.memory) > 0) {
      send("line", {
        turtle: turtle(state.memory, state.virtualCanvas),
        x: turtx(state.virtualCanvas, n1),
        y: turty(state.virtualCanvas, n2),
      });
      let drawn = state.update;
    }
    memory.setTurtX(state.memory, n1);
    memory.setTurtY(state.memory, n2);
    send("turtxChanged", n1);
    send("turtyChanged", n2);
    state.memory.coords.push([n1, n2]);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const fwrd = (state: State): ActionResult => {
  const n3 = state.memory.stack.pop(); // distance
  if (n3 !== undefined) {
    const n4 = memory.getTurtD(state.memory); // turtle direction
    // work out final y coordinate
    let n2 = Math.cos((n4 * Math.PI) / (memory.getTurtA(state.memory) / 2));
    n2 = -Math.round(n2 * n3);
    n2 += memory.getTurtY(state.memory);
    // work out final x coordinate
    let n1 = Math.sin((n4 * Math.PI) / (memory.getTurtA(state.memory) / 2));
    n1 = Math.round(n1 * n3);
    n1 += memory.getTurtX(state.memory);
    if (memory.getTurtT(state.memory) > 0) {
      send("line", {
        turtle: turtle(state.memory, state.virtualCanvas),
        x: turtx(state.virtualCanvas, n1),
        y: turty(state.virtualCanvas, n2),
      });
      let drawn = state.update;
    }
    memory.setTurtX(state.memory, n1);
    memory.setTurtY(state.memory, n2);
    send("turtxChanged", n1);
    send("turtyChanged", n2);
    state.memory.coords.push([n1, n2]);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const back = (state: State): ActionResult => {
  const n3 = state.memory.stack.pop(); // distance
  if (n3 !== undefined) {
    const n4 = memory.getTurtD(state.memory); // turtle direction
    // work out final y coordinate
    let n2 = Math.cos((n4 * Math.PI) / (memory.getTurtA(state.memory) / 2));
    n2 = Math.round(n2 * n3);
    n2 += memory.getTurtY(state.memory);
    // work out final x coordinate
    let n1 = Math.sin((n4 * Math.PI) / (memory.getTurtA(state.memory) / 2));
    n1 = -Math.round(n1 * n3);
    n1 += memory.getTurtX(state.memory);
    if (memory.getTurtT(state.memory) > 0) {
      send("line", {
        turtle: turtle(state.memory, state.virtualCanvas),
        x: turtx(state.virtualCanvas, n1),
        y: turty(state.virtualCanvas, n2),
      });
      let drawn = state.update;
    }
    memory.setTurtX(state.memory, n1);
    memory.setTurtY(state.memory, n2);
    send("turtxChanged", n1);
    send("turtyChanged", n2);
    state.memory.coords.push([n1, n2]);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const left = (state: State): ActionResult => {
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined) {
    const n2 = (memory.getTurtD(state.memory) - n1) % memory.getTurtA(state.memory);
    memory.setTurtD(state.memory, n2);
    send("turtdChanged", n2);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const rght = (state: State): ActionResult => {
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined) {
    const n2 = (memory.getTurtD(state.memory) + n1) % memory.getTurtA(state.memory);
    memory.setTurtD(state.memory, n2);
    send("turtdChanged", n2);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const turn = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined) {
    let n3;
    if (Math.abs(n2) >= Math.abs(n1)) {
      n3 = Math.atan(-n1 / n2);
      if (n2 > 0) {
        n3 += Math.PI;
      } else if (n1 < 0) {
        n3 += 2;
        n3 *= Math.PI;
      }
    } else {
      n3 = Math.atan(n2 / n1);
      if (n1 > 0) {
        n3 += Math.PI;
      } else {
        n3 += 3;
        n3 *= Math.PI;
      }
      n3 /= 2;
    }
    n3 =
      Math.round((n3 * memory.getTurtA(state.memory)) / Math.PI / 2) %
      memory.getTurtA(state.memory);
    memory.setTurtD(state.memory, n3);
    send("turtdChanged", n1);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

// 0x60s - colour operators, shapes and fills
export const blnk = (state: State): ActionResult => {
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined) {
    send("blank", hex(n1));
    let drawn = state.update;
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const rcol = (state: State): ActionResult => {
  const n3 = state.memory.stack.pop();
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined && n3 !== undefined) {
    send("flood", {
      x: turtx(state.virtualCanvas, n1),
      y: turty(state.virtualCanvas, n2),
      c1: n3,
      c2: 0,
      boundary: false,
    });
    let drawn = state.update;
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const fill = (state: State): ActionResult => {
  const n4 = state.memory.stack.pop();
  const n3 = state.memory.stack.pop();
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined && n3 !== undefined && n4 !== undefined) {
    send("flood", {
      x: turtx(state.virtualCanvas, n1),
      y: turty(state.virtualCanvas, n2),
      c1: n3,
      c2: n4,
      boundary: true,
    });
    let drawn = state.update;
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const pixc = (state: State): ActionResult => {
  const n3 = state.memory.stack.pop();
  const n2 = state.memory.stack.pop();
  if (n2 !== undefined && n3 !== undefined) {
    const image = state.context.getImageData(
      turtx(state.virtualCanvas, n2),
      turty(state.virtualCanvas, n3),
      1,
      1
    );
    state.memory.stack.push(image.data[0] * 65536 + image.data[1] * 256 + image.data[2]);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const pixs = (state: State): ActionResult => {
  const n3 = state.memory.stack.pop();
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined && n3 !== undefined) {
    send("pixset", {
      x: turtx(state.virtualCanvas, n1),
      y: turty(state.virtualCanvas, n2),
      c: n3,
      doubled: state.virtualCanvas.doubled,
    });
    let drawn = state.update;
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const rgb = (state: State): ActionResult => {
  let n1 = state.memory.stack.pop();
  if (n1 !== undefined) {
    n1 = n1 % 50;
    if (n1 <= 0) {
      n1 += 50;
    }
    n1 = colours[n1 - 1].value;
    state.memory.stack.push(n1);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const mixc = (state: State): ActionResult => {
  const n4 = state.memory.stack.pop(); // second proportion
  const n3 = state.memory.stack.pop(); // first proportion
  const n2 = state.memory.stack.pop(); // second colour
  const n1 = state.memory.stack.pop(); // first colour
  if (n1 !== undefined && n2 !== undefined && n3 !== undefined && n4 !== undefined) {
    const r = mixBytes(Math.floor(n1 / 0x10000), Math.floor(n2 / 0x10000), n3, n4); // red byte
    const g = mixBytes(
      Math.floor((n1 & 0xff00) / 0x100),
      Math.floor((n2 & 0xff00) / 0x100),
      n3,
      n4
    ); // green byte
    const b = mixBytes(n1 & 0xff, n2 & 0xff, n3, n4); // blue byte
    state.memory.stack.push(r * 0x10000 + g * 0x100 + b);
  }
};

export const rmbr = (state: State): ActionResult => {
  state.memory.coords.push([memory.getTurtX(state.memory), memory.getTurtY(state.memory)]);
};

export const frgt = (state: State): ActionResult => {
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined) {
    state.memory.coords.length -= n1;
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const poly = (state: State): ActionResult => {
  const n3 = state.memory.stack.pop();
  if (n3 !== undefined) {
    const n2 = state.memory.coords.length;
    const n1 = n3 > n2 ? 0 : n2 - n3;
    send("poly", {
      turtle: turtle(state.memory, state.virtualCanvas),
      coords: state.memory.coords
        .slice(n1, n2)
        .map((coords) => vcoords(state.virtualCanvas, coords)),
      fill: false,
    });
    let drawn = state.update;
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const pfil = (state: State): ActionResult => {
  const n3 = state.memory.stack.pop();
  if (n3 !== undefined) {
    const n2 = state.memory.coords.length;
    const n1 = n3 > n2 ? 0 : n2 - n3;
    send("poly", {
      turtle: turtle(state.memory, state.virtualCanvas),
      coords: state.memory.coords
        .slice(n1, n2)
        .map((coords) => vcoords(state.virtualCanvas, coords)),
      fill: true,
    });
    let drawn = state.update;
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const circ = (state: State): ActionResult => {
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined) {
    send("arc", {
      turtle: turtle(state.memory, state.virtualCanvas),
      x: turtx(state.virtualCanvas, n1 + state.virtualCanvas.startx),
      y: turty(state.virtualCanvas, n1 + state.virtualCanvas.starty),
      fill: false,
    });
    let drawn = state.update;
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const blot = (state: State): ActionResult => {
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined) {
    send("arc", {
      turtle: turtle(state.memory, state.virtualCanvas),
      x: turtx(state.virtualCanvas, n1 + state.virtualCanvas.startx),
      y: turty(state.virtualCanvas, n1 + state.virtualCanvas.starty),
      fill: true,
    });
    let drawn = state.update;
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const elps = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined) {
    send("arc", {
      turtle: turtle(state.memory, state.virtualCanvas),
      x: turtx(state.virtualCanvas, n1 + state.virtualCanvas.startx),
      y: turty(state.virtualCanvas, n2 + state.virtualCanvas.starty),
      fill: false,
    });
    let drawn = state.update;
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const eblt = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined) {
    send("arc", {
      turtle: turtle(state.memory, state.virtualCanvas),
      x: turtx(state.virtualCanvas, n1 + state.virtualCanvas.startx),
      y: turty(state.virtualCanvas, n2 + state.virtualCanvas.starty),
      fill: true,
    });
    let drawn = state.update;
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const box = (state: State): ActionResult => {
  const n4 = state.memory.stack.pop();
  const n3 = state.memory.stack.pop();
  let n2 = state.memory.stack.pop();
  let n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined && n3 !== undefined && n4 !== undefined) {
    const bool1 = n4 !== 0;
    n2 += memory.getTurtY(state.memory);
    n1 += memory.getTurtX(state.memory);
    send("box", {
      turtle: turtle(state.memory, state.virtualCanvas),
      x: turtx(state.virtualCanvas, n1),
      y: turty(state.virtualCanvas, n2),
      fill: hex(n3),
      border: bool1,
    });
    let drawn = state.update;
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

// 0x70s - loading from stack, storing from stack, pointer and array operations
export const ldin = (state: State): ActionResult => {
  const n1 = state.pcode[state.line][state.code + 1];
  state.memory.stack.push(n1);
  state.code += 1;
};

export const ldvg = (state: State): ActionResult => {
  const n1 = state.pcode[state.line][state.code + 1];
  state.memory.stack.push(memory.peek(state.memory, n1));
  state.code += 1;
};

export const ldvv = (state: State): ActionResult => {
  const n1 = state.pcode[state.line][state.code + 1];
  const n2 = state.pcode[state.line][state.code + 2];
  state.memory.stack.push(state.memory.main[state.memory.main[n1] + n2]);
  state.code += 2;
};

export const ldvr = (state: State): ActionResult => {
  const n1 = state.pcode[state.line][state.code + 1];
  const n2 = state.pcode[state.line][state.code + 2];
  state.memory.stack.push(state.memory.main[state.memory.main[state.memory.main[n1] + n2]]);
  state.code += 2;
};

export const ldag = (state: State): ActionResult => {
  const n1 = state.pcode[state.line][state.code + 1];
  state.memory.stack.push(n1);
  state.code += 1;
};

export const ldav = (state: State): ActionResult => {
  const n1 = state.pcode[state.line][state.code + 1];
  const n2 = state.pcode[state.line][state.code + 2];
  state.memory.stack.push(state.memory.main[n1] + n2);
  state.code += 2;
};

export const lstr = (state: State): ActionResult => {
  state.code += 1;
  const n1 = state.pcode[state.line][state.code]; // length of the string
  const n2 = state.code + n1; // end of the string
  let s1 = "";
  while (state.code < n2) {
    state.code += 1;
    s1 += String.fromCharCode(state.pcode[state.line][state.code]);
  }
  memory.makeHeapString(state.memory, s1);
};

export const stvg = (state: State): ActionResult => {
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined) {
    state.memory.main[state.pcode[state.line][state.code + 1]] = n1;
    state.code += 1;
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const stvv = (state: State): ActionResult => {
  const n1 = state.pcode[state.line][state.code + 1];
  const n2 = state.pcode[state.line][state.code + 2];
  const n3 = state.memory.stack.pop();
  if (n3 !== undefined) {
    state.memory.main[state.memory.main[n1] + n2] = n3;
    state.code += 2;
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const stvr = (state: State): ActionResult => {
  const n1 = state.pcode[state.line][state.code + 1];
  const n2 = state.pcode[state.line][state.code + 2];
  const n3 = state.memory.stack.pop();
  if (n3 !== undefined) {
    state.memory.main[state.memory.main[state.memory.main[n1] + n2]] = n3;
    state.code += 2;
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const lptr = (state: State): ActionResult => {
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined) {
    state.memory.stack.push(state.memory.main[n1]);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const sptr = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined) {
    state.memory.main[n2] = n1;
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const zptr = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined) {
    memory.zero(state.memory, n1, n2);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const cptr = (state: State): ActionResult => {
  const n3 = state.memory.stack.pop(); // length
  const n2 = state.memory.stack.pop(); // target
  const n1 = state.memory.stack.pop(); // source
  if (n1 !== undefined && n2 !== undefined && n3 !== undefined) {
    memory.copy(state.memory, n1, n2, n3);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const cstr = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop(); // target
  const n1 = state.memory.stack.pop(); // source
  if (n1 !== undefined && n2 !== undefined) {
    const n4 = state.memory.main[n2 - 1]; // maximum length of target
    const n3 = state.memory.main[n1]; // length of source
    memory.copy(state.memory, n1, n2, Math.min(n3, n4) + 1);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const test = (state: State): ActionResult => {
  const n2 = state.memory.stack[state.memory.stack.length - 1]; // leave the stack unchanged
  const n1 = state.memory.stack[state.memory.stack.length - 2];
  if (n1 !== undefined && n2 !== undefined) {
    if (n1 < 0 || n1 > state.memory.main[n2]) {
      // TODO: make range check a runtime option
      throw new MachineError(`Array index out of range (${state.line}, ${state.code}).`);
    }
  }
};

// 0x80s - flow control, memory control
export const jump = (state: State): ActionResult => {
  state.line = state.pcode[state.line][state.code + 1] - 1;
  state.code = -1;
};

export const ifno = (state: State): ActionResult => {
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined) {
    if (n1 === 0) {
      state.line = state.pcode[state.line][state.code + 1] - 1;
      state.code = -1;
    } else {
      state.code += 1;
    }
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const halt = (state: State): ActionResult => {
  return { state, halted: true };
};

export const subr = (state: State): ActionResult => {
  if (memory.getHeapGlobal(state.memory) === -1) {
    memory.setHeapGlobal(state.memory, memory.getHeapPerm(state.memory));
  }
  state.memory.returnStack.push(state.line + 1);
  state.line = state.pcode[state.line][state.code + 1] - 1;
  state.code = -1;
};

export const retn = (state: State): ActionResult => {
  const n1 = state.memory.returnStack.pop();
  if (n1 !== undefined) {
    state.line = n1;
    state.code = -1;
  } else {
    return { state, error: "RETN called on empty return stack." };
  }
};

export const pssr = (state: State): ActionResult => {
  state.memory.subroutineStack.push(state.pcode[state.line][state.code + 1]);
  state.code += 1;
};

export const plsr = (state: State): ActionResult => {
  state.memory.subroutineStack.pop();
};

export const psrj = (state: State): ActionResult => {
  state.memory.stack.push(state.line + 1);
};

export const plrj = (state: State): ActionResult => {
  state.memory.returnStack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined) {
    state.line = n1 - 1;
    state.code = -1;
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const ldmt = (state: State): ActionResult => {
  state.memory.stack.push(state.memory.memoryStack.length - 1);
};

export const stmt = (state: State): ActionResult => {
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined) {
    state.memory.memoryStack.push(n1);
    memory.setStackTop(state.memory, n1);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const memc = (state: State): ActionResult => {
  const n1 = state.pcode[state.line][state.code + 1];
  const n2 = state.pcode[state.line][state.code + 2];
  const n3 = state.memory.memoryStack.pop();
  if (n3 !== undefined) {
    // heap overflow check
    if (n3 + n2 > state.options.stackSize) {
      throw new MachineError(
        "Memory stack has overflowed into memory heap. Probable cause is unterminated recursion."
      );
    }
    state.memory.memoryStack.push(state.memory.main[n1]);
    memory.setStackTop(state.memory, state.memory.main[n1]);
    state.memory.main[n1] = n3;
    state.memory.memoryStack.push(n3 + n2);
    memory.setStackTop(state.memory, n3 + n2);
    state.code += 2;
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const memr = (state: State): ActionResult => {
  state.memory.memoryStack.pop();
  const n1 = state.pcode[state.line][state.code + 1];
  const n2 = state.memory.memoryStack.pop();
  if (n2 !== undefined) {
    state.memory.memoryStack.push(state.memory.main[n1]);
    memory.setStackTop(state.memory, state.memory.main[n1]);
    state.memory.main[n1] = n2;
    state.code += 2;
  } else {
    return { state, error: "MEMR called on empty memory stack." };
  }
};

export const hfix = (state: State): ActionResult => {
  memory.heapFix(state.memory);
};

export const hclr = (state: State): ActionResult => {
  memory.heapClear(state.memory);
};

export const hrst = (state: State): ActionResult => {
  memory.heapReset(state.memory);
};

// 0x90s - runtime variables, debugging
export const canv = (state: State): ActionResult => {
  const n4 = state.memory.stack.pop();
  const n3 = state.memory.stack.pop();
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined && n3 !== undefined && n4 !== undefined) {
    state.virtualCanvas.sizey = n4;
    state.virtualCanvas.sizex = n3;
    state.virtualCanvas.starty = n2;
    state.virtualCanvas.startx = n1;
    send("canvas", state.virtualCanvas);
    memory.setTurtX(
      state.memory,
      Math.round(state.virtualCanvas.startx + state.virtualCanvas.sizex / 2)
    );
    memory.setTurtY(
      state.memory,
      Math.round(state.virtualCanvas.starty + state.virtualCanvas.sizey / 2)
    );
    memory.setTurtD(state.memory, 0);
    send("turtxChanged", memory.getTurtX(state.memory));
    send("turtyChanged", memory.getTurtY(state.memory));
    send("turtdChanged", memory.getTurtD(state.memory));
    state.memory.coords.push([memory.getTurtX(state.memory), memory.getTurtY(state.memory)]);
    let drawCount = state.options.drawCountMax; // force update
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const reso = (state: State): ActionResult => {
  let n2 = state.memory.stack.pop();
  let n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined) {
    if (Math.min(n1, n2) <= state.options.smallSize) {
      n1 *= 2;
      n2 *= 2;
      state.virtualCanvas.doubled = true;
    } else {
      state.virtualCanvas.doubled = false;
    }
    state.virtualCanvas.width = n1;
    state.virtualCanvas.height = n2;
    send("resolution", { width: n1, height: n2 });
    send("blank", "#FFFFFF");
    let drawCount = state.options.drawCountMax; // force update
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const udat = (state: State): ActionResult => {
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined) {
    const bool1 = n1 !== 0;
    state.update = bool1;
    if (bool1) {
      let drawCount = state.options.drawCountMax; // force update
    }
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const seed = (state: State): ActionResult => {
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined) {
    if (n1 === 0) {
      state.memory.stack.push(state.seed);
    } else {
      state.seed = n1;
      state.memory.stack.push(n1);
    }
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const trac = (state: State): ActionResult => {
  // not implemented -
  // just pop the top off the stack
  state.memory.stack.pop();
};

export const memw = (state: State): ActionResult => {
  // not implemented -
  // just pop the top off the stack
  state.memory.stack.pop();
};

export const dump = (state: State): ActionResult => {
  send("memoryDumped", memory.dump(state.memory));
  if (state.options.showMemoryOnDump) {
    systemState.send("selectTab", "memory");
  }
};

export const peek = (state: State): ActionResult => {
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined) {
    state.memory.stack.push(state.memory.main[n1]);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const poke = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined) {
    state.memory.main[n1] = n2;
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

// 0xA0s - text output, timing
export const stat = (state: State): ActionResult => {
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined) {
    if (-11 <= n1 && n1 < 0) {
      // lookup query value
      state.memory.stack.push(state.memory.query[-n1]);
    } else if (0 < n1 && n1 < 256) {
      // lookup key value
      state.memory.stack.push(state.memory.keys[n1]);
    } else {
      // return 0 for anything outside the range
      state.memory.stack.push(0);
    }
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const iclr = (state: State): ActionResult => {
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined) {
    if (-11 <= n1 && n1 < 0) {
      // reset query value
      state.memory.query[-n1] = -1;
    } else if (n1 === 0) {
      // reset keybuffer
      state.memory.main[state.memory.main[1] + 1] = state.memory.main[1] + 3;
      state.memory.main[state.memory.main[1] + 2] = state.memory.main[1] + 3;
    } else if (0 < n1 && n1 < 256) {
      // reset key value
      state.memory.keys[n1] = -1;
    } else if (n1 === 256) {
      // reset everything
      state.memory.keys.fill(-1);
      state.memory.query.fill(-1);
    } else {
      // for any value outside the range (-11, 256) we don't do anything
    }
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const bufr = (state: State): ActionResult => {
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined) {
    if (n1 > 0) {
      const n2 = memory.getHeapTemp(state.memory) + 3;
      state.memory.stack.push(memory.getHeapTemp(state.memory) + 1);
      state.memory.main[memory.getHeapTemp(state.memory) + 1] = n1 + n2;
      state.memory.main[memory.getHeapTemp(state.memory) + 2] = n2 + 1;
      state.memory.main[memory.getHeapTemp(state.memory) + 3] = n2 + 1;
      state.memory.main.fill(0, n2 + 1, n2 + n1);
      memory.setHeapTemp(state.memory, n2 + n1);
      memory.setHeapMax(state.memory, memory.getHeapTemp(state.memory));
    }
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const read = (state: State): ActionResult => {
  const n1 = state.memory.stack.pop(); // maximum number of characters to read
  const n2 = state.memory.main[1]; // the address of the buffer
  const n3 = state.memory.main[state.memory.main[1]]; // the address of the end of the buffer
  let s1 = ""; // the string read from the buffer
  let r = state.memory.main[n2 + 1];
  const g = state.memory.main[n2 + 2];
  if (n1 !== undefined) {
    if (n1 === 0) {
      while (r !== g) {
        s1 += String.fromCharCode(state.memory.main[r]);
        r = r < n3 ? r + 1 : n3 + 3; // loop back to the start
      }
    } else {
      while (r !== g && s1.length <= n1) {
        s1 += String.fromCharCode(state.memory.main[r]);
        if (r < n3) {
          r += 1;
        } else {
          r = n3 + 3; // loop back to the start
        }
      }
      state.memory.main[n2 + 1] = r;
    }
    memory.makeHeapString(state.memory, s1);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const rdln = (state: State): ActionResult => {
  const n1 = Math.pow(2, 31) - 1; // as long as possible
  state.code += 1;
  if (state.code === state.pcode[state.line].length) {
    state.line += 1;
    state.code = 0;
  }
  // state.readlineTimeoutID = setTimeout(execute, n1);
  // addEventListener("keyup", handlers.readline.bind(null, state));
  return;
};

export const kech = (state: State): ActionResult => {
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined) {
    const bool1 = n1 !== 0;
    state.keyecho = bool1;
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const outp = (state: State): ActionResult => {
  const n3 = state.memory.stack.pop();
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined && n3 !== undefined) {
    const bool2 = n3 !== 0;
    const bool1 = n1 !== 0;
    state.output.style.background = hex(n2);
    if (bool1) {
      state.output.innerHTML = "";
    }
    if (bool2) {
      systemState.send("selectTab", "output");
    } else {
      systemState.send("selectTab", "canvas");
    }
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const cons = (state: State): ActionResult => {
  const n3 = state.memory.stack.pop();
  const n2 = state.memory.stack.pop();
  if (n2 !== undefined && n3 !== undefined) {
    const bool1 = n2 !== 0;
    if (bool1) {
      state.console.innerHTML = "";
    }
    state.console.style.background = hex(n3);
  }
};

export const prnt = (state: State): ActionResult => {
  const n3 = state.memory.stack.pop();
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined && n3 !== undefined) {
    const s1 = memory.getHeapString(state.memory, n1);
    send("print", {
      turtle: turtle(state.memory, state.virtualCanvas),
      string: s1,
      font: n2,
      size: n3,
    });
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const writ = (state: State): ActionResult => {
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined) {
    const s1 = memory.getHeapString(state.memory, n1);
    state.output.innerHTML += s1;
    state.console.innerHTML += s1;
    state.console.scrollTop = state.console.scrollHeight;
    if (state.options.showOutputOnWrite) {
      systemState.send("selectTab", "output");
    }
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const newl = (state: State): ActionResult => {
  state.output.innerHTML += "\n";
  state.console.innerHTML += "\n";
  state.console.scrollTop = state.console.scrollHeight;
};

export const curs = (state: State): ActionResult => {
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined) {
    send("cursor", n1);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const time = (state: State): ActionResult => {
  const n1 = Date.now() - state.startTime;
  state.memory.stack.push(n1);
};

export const tset = (state: State): ActionResult => {
  const n1 = Date.now();
  const n2 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined) {
    state.startTime = n1 - n2;
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
};

export const wait = (state: State): ActionResult => {
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined) {
    state.code += 1;
    if (state.code === state.pcode[state.line].length) {
      state.line += 1;
      state.code = 0;
    }
    // setTimeout(execute, n1);
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
  return;
};

export const tdet = (state: State): ActionResult => {
  const n2 = state.memory.stack.pop();
  const n1 = state.memory.stack.pop();
  if (n1 !== undefined && n2 !== undefined) {
    if (-11 <= n1 && n1 < 256) {
      state.memory.stack.push(0);
      state.code += 1;
      if (state.code === state.pcode[state.line].length) {
        state.line += 1;
        state.code = 0;
      }
      state.detectInputcode = n1;
      const n3 = n2 === 0 ? Math.pow(2, 31) - 1 : n2; // 0 means "as long as possible"
      //   state.detectTimeoutID = setTimeout(execute, n3);
      //   addEventListener("keyup", handlers.detect.bind(null, state));
      //   addEventListener("mouseup", handlers.detect.bind(null, state));
    }
  } else {
    return { state, error: "Stack operation called on empty stack." };
  }
  return;
};
