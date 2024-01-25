import type { Options } from "./types.ts";
import { defaultOptions, initialState, initialVirtualCanvas } from "./defaults.ts";
import { send } from "./hub.ts";
import * as memory from "./memory.ts";
import * as handlers from "./handlers.ts";
import executeCode from "./execute.ts";
import { MachineError } from "../tools/error.ts";
import * as systemState from "../tools/hub.ts";
import { PCode } from "../constants/pcodes.ts";

let state = initialState([], defaultOptions);

export const resetDomElements = () => {
  // reset the virtual canvas
  state.virtualCanvas = initialVirtualCanvas;
  // send reset machine components signals
  send("resolution", { width: 1000, height: 1000 });
  send("console", { clear: true, colour: "#FFFFFF" });
  send("output", { clear: true, colour: "#FFFFFF" });
  send("turtxChanged", 500);
  send("turtyChanged", 500);
  send("turtdChanged", 0);
  send("turtaChanged", 360);
  send("turttChanged", 2);
  send("turtcChanged", "#000");
  send("canvas", state.canvas);
};

export const run = (pcode: number[][], options: Options) => {
  // initialise the machine state
  state = initialState(pcode, options);

  // reset the DOM elements
  resetDomElements();

  // optionally show the canvas
  if (options.showCanvasOnRun) {
    systemState.send("selectTab", "canvas");
  }

  // add event listeners
  globalThis.addEventListener("keydown", boundHandlers.storeKey);
  globalThis.addEventListener("keyup", boundHandlers.releaseKey);
  globalThis.addEventListener("keypress", boundHandlers.putInBuffer);
  state.canvas.addEventListener("contextmenu", boundHandlers.preventDefault);
  state.canvas.addEventListener("mousemove", boundHandlers.storeMouseXY);
  state.canvas.addEventListener("touchmove", boundHandlers.preventDefault);
  state.canvas.addEventListener("touchmove", boundHandlers.storeMouseXY);
  state.canvas.addEventListener("mousedown", boundHandlers.preventDefault);
  state.canvas.addEventListener("mousedown", boundHandlers.storeClickXY);
  state.canvas.addEventListener("touchstart", boundHandlers.storeClickXY);
  state.canvas.addEventListener("mouseup", boundHandlers.releaseClickXY);
  state.canvas.addEventListener("touchend", boundHandlers.releaseClickXY);

  // send the started signal (via the main state module)
  systemState.send("played");

  // execute the first block of code (which will in turn trigger execution of the next block)
  execute();
};

export const halt = () => {
  if (state.running) {
    // remove event listeners
    removeEventListener("keydown", boundHandlers.storeKey);
    removeEventListener("keyup", boundHandlers.releaseKey);
    removeEventListener("keypress", boundHandlers.putInBuffer);
    removeEventListener("keyup", boundHandlers.detect);
    removeEventListener("mouseup", boundHandlers.detect);
    removeEventListener("keyup", boundHandlers.readline);
    state.canvas.removeEventListener("contextmenu", boundHandlers.preventDefault);
    state.canvas.removeEventListener("mousemove", boundHandlers.storeMouseXY);
    state.canvas.removeEventListener("touchmove", boundHandlers.preventDefault);
    state.canvas.removeEventListener("touchmove", boundHandlers.storeMouseXY);
    state.canvas.removeEventListener("mousedown", boundHandlers.preventDefault);
    state.canvas.removeEventListener("mousedown", boundHandlers.storeClickXY);
    state.canvas.removeEventListener("touchstart", boundHandlers.storeClickXY);
    state.canvas.removeEventListener("mouseup", boundHandlers.releaseClickXY);
    state.canvas.removeEventListener("touchend", boundHandlers.releaseClickXY);
    // reset the canvas cursor
    send("cursor", 1);
    // reset the machine status
    state.running = false;
    state.paused = false;
    // send the stopped signal
    send("halted");
  }
};

export const isRunning = () => state.running;

export const isPaused = () => state.paused;

export const play = () => {
  state.paused = false;
  send("unpaused");
};

export const pause = () => {
  state.paused = true;
  send("paused");
};

const boundHandlers = {
  preventDefault: (event: UIEvent) => {
    event.preventDefault();
  },
  storeKey: (event: KeyboardEvent) => {
    state.memory = handlers.storeKey(state.keyecho, state.memory, event);
  },
  releaseKey: (event: KeyboardEvent) => {
    state.memory = handlers.releaseKey(state.memory, event);
  },
  putInBuffer: (event: KeyboardEvent) => {
    state.memory = handlers.putInBuffer(state.keyecho, state.memory, event);
  },
  storeMouseXY: (event: MouseEvent | TouchEvent) => {
    state.memory = handlers.storeMouseXY(state.canvas, state.virtualCanvas, state.memory, event);
  },
  storeClickXY: (event: MouseEvent | TouchEvent) => {
    state.memory = handlers.storeClickXY(state.canvas, state.virtualCanvas, state.memory, event);
  },
  releaseClickXY: (event: MouseEvent | TouchEvent) => {
    state.memory = handlers.releaseClickXY(state.memory, event);
  },
  detect: (event: KeyboardEvent | MouseEvent) => {
    if (handlers.rightThingPressed(state.detectInputcode, event)) {
      state.memory = handlers.detect(state.detectInputcode, state.memory);
      clearTimeout(state.detectTimeoutID);
      execute();
    }
  },
  readline: (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      state.memory = handlers.readline(state.memory);
      clearTimeout(state.readlineTimeoutID);
      execute();
    }
  },
};

const execute = (): void => {
  // don't do anything if we're not running
  if (!state.running) {
    return;
  }

  // try again in 1 millisecond if the machine is paused
  if (state.paused) {
    setTimeout(() => execute(), 1);
    return;
  }

  // in case of detect or readline, remove the event listeners the first time we carry on with the
  // program execution after they have been called
  removeEventListener("keyup", boundHandlers.detect);
  removeEventListener("mouseup", boundHandlers.detect);
  removeEventListener("keyup", boundHandlers.readline);

  // execute any delayed heap clear calls
  memory.delayedHeapClear(state.memory);

  // execute as much code as possible
  let drawCount = 0;
  let codeCount = 0;
  try {
    while (
      drawCount < state.options.drawCountMax &&
      codeCount <= state.options.codeCountMax
    ) {
      const code = state.pcode[state.line][state.code] as PCode;
      const { state: nextState, drawn, halted } = executeCode[code](state);

      if (halted) {
        halt();
        return;
      }

      state = nextState;
      codeCount += 1;
      drawCount += drawn ? 1 : 0;
      state.code += 1;
      if (!state.pcode[state.line]) {
        throw new MachineError(
          "The program has tried to jump to a line that does not exist. This is either a bug in our compiler, or in your assembled code."
        );
      }
      if (state.code === state.pcode[state.line].length) {
        // line wrap
        state.line += 1;
        state.code = 0;
      }
    }
  } catch (error) {
    halt();
    systemState.send("error", error);
  }
  // setTimeout (with no delay) instead of direct recursion means the function will return and the
  // canvas will be updated
  setTimeout(execute, 0);
};
