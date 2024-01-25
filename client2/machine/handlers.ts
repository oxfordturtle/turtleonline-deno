import type { Memory, VirtualCanvas } from "./types.ts";
import { send } from "./hub.ts";
import { makeHeapString } from "./memory.ts";
import { virtx, virty } from "./turtle.ts";

/** stores a key press */
export const storeKey = (
  keyecho: boolean,
  memory: Memory,
  event: KeyboardEvent
): Memory => {
  // backspace
  if (event.key === "Backspace") {
    event.preventDefault(); // don't go back a page in the browser!
    const buffer = memory.main[1];
    if (buffer > 0) {
      // there is a keybuffer
      if (memory.main[buffer + 1] !== memory.main[buffer + 2]) {
        // the keybuffer has something in it
        if (memory.main[buffer + 2] === buffer + 3) {
          memory.main[buffer + 2] = memory.main[buffer]; // go "back" to the end
        } else {
          memory.main[buffer + 2] -= 1; // go back one
        }
        if (keyecho) {
          send("backspace");
        }
      }
      // put buffer length in keys array
      if (memory.main[buffer + 2] >= memory.main[buffer + 1]) {
        memory.keys[0] = memory.main[buffer + 2] - memory.main[buffer + 1];
      } else {
        memory.keys[0] =
          memory.main[buffer + 2] -
          memory.main[buffer + 1] +
          memory.main[buffer] -
          buffer -
          2;
      }
    }
  }
  // arrow keys
  if (
    event.key === "ArrowUp" ||
    event.key === "ArrowDown" ||
    event.key === "ArrowLeft" ||
    event.key === "ArrowRight"
  ) {
    event.preventDefault(); // don't scroll the page
  }
  // normal case
  const keycode = event.keyCode; // inputcodeFromKey(event.key)
  memory.query[9] = keycode;
  memory.query[10] = 128;
  memory.query[11] = keycode;
  if (event.shiftKey) {
    memory.query[10] += 8;
  }
  if (event.altKey) {
    memory.query[10] += 16;
  }
  if (event.ctrlKey) {
    memory.query[10] += 32;
  }
  memory.keys[keycode] = memory.query[10];

  return memory;
};

/** stores that a key has been released */
export const releaseKey = (memory: Memory, event: KeyboardEvent): Memory => {
  const keycode = event.keyCode; // inputcodeFromKey(event.key)
  // keyup should set positive value to negative; use Math.abs to ensure the result is negative,
  // in case two keydown events fire close together, before the first keyup event fires
  memory.query[9] = -Math.abs(memory.query[9]);
  memory.query[10] = -Math.abs(memory.query[10]);
  memory.keys[keycode] = -Math.abs(memory.keys[keycode]);

  return memory;
};

/** puts a key in the keybuffer */
export const putInBuffer = (
  keyecho: boolean,
  memory: Memory,
  event: KeyboardEvent
): Memory => {
  const keycode = event.keyCode; // inputcodeFromKey(event.key)
  const buffer = memory.main[1];
  if (buffer > 0) {
    // there is a keybuffer
    let next = 0;
    if (memory.main[buffer + 2] === memory.main[buffer]) {
      next = buffer + 3; // loop back round to the start
    } else {
      next = memory.main[buffer + 2] + 1;
    }
    if (next !== memory.main[buffer + 1]) {
      memory.main[memory.main[buffer + 2]] = keycode;
      memory.main[buffer + 2] = next;
      // put buffer length in keys array
      if (memory.main[buffer + 2] >= memory.main[buffer + 1]) {
        memory.keys[0] = memory.main[buffer + 2] - memory.main[buffer + 1];
      } else {
        memory.keys[0] =
          memory.main[buffer + 2] -
          memory.main[buffer + 1] +
          memory.main[buffer] -
          buffer -
          2;
      }
      // maybe show in the console
      if (keyecho) {
        send("log", String.fromCharCode(keycode));
      }
    }
  }

  return memory;
};

/** stores mouse coordinates in virtual memory */
export const storeMouseXY = (
  canvas: HTMLCanvasElement,
  virtualCanvas: VirtualCanvas,
  memory: Memory,
  event: MouseEvent | TouchEvent
): Memory => {
  if (event instanceof MouseEvent && event.type === "mousemove") {
    memory.query[7] = virtx(canvas, virtualCanvas, event.clientX);
    memory.query[8] = virty(canvas, virtualCanvas, event.clientY);
  }
  if (
    event instanceof TouchEvent &&
    (event.type === "touchmove" || event.type === "touchstart")
  ) {
    memory.query[7] = virtx(canvas, virtualCanvas, event.touches[0].clientX);
    memory.query[8] = virty(canvas, virtualCanvas, event.touches[0].clientY);
  }

  return memory;
};

/** stores mouse click coordinates in virtual memory */
export const storeClickXY = (
  canvas: HTMLCanvasElement,
  virtualCanvas: VirtualCanvas,
  memory: Memory,
  event: MouseEvent | TouchEvent
): Memory => {
  const now = Date.now();
  memory.query[4] = 128;
  if (event.shiftKey) {
    memory.query[4] += 8;
  }
  if (event.altKey) {
    memory.query[4] += 16;
  }
  if (event.ctrlKey) {
    memory.query[4] += 32;
  }
  if (now - memory.query[11] < 300) {
    memory.query[4] += 64; // double-click
  }
  memory.query[11] = now; // save to check for next double-click
  if (event instanceof MouseEvent && event.type === "mousedown") {
    memory.query[5] = virtx(canvas, virtualCanvas, event.clientX);
    memory.query[6] = virty(canvas, virtualCanvas, event.clientY);
    switch (event.button) {
      case 0:
        memory.query[4] += 1;
        memory.query[1] = memory.query[4];
        memory.query[2] = -1;
        memory.query[3] = -1;
        memory.query[11] = 1; // 1 for lmouse
        break;

      case 1:
        memory.query[4] += 4;
        memory.query[1] = -1;
        memory.query[2] = -1;
        memory.query[3] = memory.query[4];
        memory.query[11] = 3; // 3 for rmouse
        break;

      case 2:
        memory.query[4] += 2;
        memory.query[1] = -1;
        memory.query[2] = memory.query[4];
        memory.query[3] = -1;
        memory.query[11] = 2; // 2 for rmouse
        break;
    }
  } else if (event instanceof TouchEvent && event.type === "touchstart") {
    memory.query[5] = virtx(canvas, virtualCanvas, event.touches[0].clientX);
    memory.query[6] = virty(canvas, virtualCanvas, event.touches[0].clientY);
    memory.query[4] += 1;
    memory.query[1] = memory.query[4];
    memory.query[2] = -1;
    memory.query[3] = -1;
    memory = storeMouseXY(canvas, virtualCanvas, memory, event);
  }
  return memory;
};

/** stores mouse release coordinates in virtual memory */
export const releaseClickXY = (
  memory: Memory,
  event: MouseEvent | TouchEvent
): Memory => {
  memory.query[4] = -memory.query[4];
  if (event instanceof MouseEvent && event.type === "mouseup") {
    switch (event.button) {
      case 0:
        memory.query[1] = -memory.query[1];
        break;

      case 1:
        memory.query[3] = -memory.query[3];
        break;

      case 2:
        memory.query[2] = -memory.query[2];
        break;
    }
  } else if (event instanceof TouchEvent && event.type === "touchend") {
    memory.query[1] = -memory.query[1];
  }

  return memory;
};

export const rightThingPressed = (
  detectInputcode: number,
  event: KeyboardEvent | MouseEvent
): boolean => {
  // -11 is \mousekey - returns whatever was clicked/pressed
  if (detectInputcode === -11) {
    return true;
  }

  // -10 and -9 return for any key (not for mouse)
  if (
    (detectInputcode === -9 || detectInputcode === -10) &&
    event instanceof KeyboardEvent
  ) {
    return true;
  }

  // -8 to -4 - returns for any mouse click
  if (
    -8 <= detectInputcode &&
    detectInputcode <= -4 &&
    event instanceof MouseEvent
  ) {
    return true;
  }

  // specific mouse button cases
  if (event instanceof MouseEvent) {
    if (detectInputcode === -3 && event.button == 1) return true;
    if (detectInputcode === -2 && event.button == 2) return true;
    if (detectInputcode === -1 && event.button == 0) return true;
  }

  // keybuffer
  if (detectInputcode === 0 && event instanceof KeyboardEvent) {
    return true;
  }

  // otherwise return if the key pressed matches the detectInputcode
  if (event instanceof KeyboardEvent && event.keyCode === detectInputcode) {
    return true;
  }

  return false;
};

/** breaks out of DETECT loop and resumes program execution if the right key/button is pressed */
export const detect = (detectInputcode: number, memory: Memory): Memory => {
  const returnValue =
    detectInputcode < 0
      ? memory.query[-detectInputcode]
      : memory.keys[detectInputcode];
  memory.stack.pop();
  // the event listener that negates the input (onkeyup or onmouseup) is called first, so by the
  // time this listener is called it will be negative - but for consistency with the downloadable
  // system we want it to be positive
  memory.stack.push(Math.abs(returnValue));
  return memory;
};

/** breaks out of READLINE loop and resumes program execution if ENTER is pressed */
export const readline = (memory: Memory): Memory => {
  // get heap string from the buffer, up to the first ENTER
  const bufferAddress = memory.main[1];
  const bufferEndAddress = memory.main[memory.main[1]];
  let string = "";
  let readNextAddress = memory.main[bufferAddress + 1];
  const readLastAddress = memory.main[bufferAddress + 2];
  while (
    readNextAddress !== readLastAddress &&
    memory.main[readNextAddress] !== 13
  ) {
    string += String.fromCharCode(memory.main[readNextAddress]);
    readNextAddress =
      readNextAddress < bufferEndAddress
        ? readNextAddress + 1
        : bufferEndAddress + 3; // loop back to the start
  }
  // move past the ENTER
  memory.main[bufferAddress + 1] =
    readNextAddress < bufferEndAddress
      ? readNextAddress + 1
      : bufferEndAddress + 3; // loop back to the start
  // put the string on the heap
  makeHeapString(memory, string);
  return memory;
};

/** gets an inputcode from a KeyboardEvent.key property */
const inputcodeFromKey = (key: string): number => {
  switch (key) {
    case "Backspace":
      return 8;
    case "Tab":
      return 9;
    case "Enter":
      return 13;
    case "Shift":
      return 16;
    case "Control":
      return 17;
    case "Alt":
      return 18;
    case "Pause":
      return 19;
    case "CapsLock":
      return 20;
    case "Escape":
      return 27;
    case " ": // space
      return 32;
    case "PageUp":
      return 33;
    case "PageDown":
      return 34;
    case "End":
      return 35;
    case "Home":
      return 36;
    case "ArrowLeft":
      return 37;
    case "ArrowUp":
      return 38;
    case "ArrowRight":
      return 39;
    case "ArrowDown":
      return 40;
    case "Insert":
      return 45;
    case "Delete":
      return 46;
    case "0":
      return 48;
    case "1":
      return 49;
    case "2":
      return 50;
    case "3":
      return 51;
    case "4":
      return 52;
    case "5":
      return 53;
    case "6":
      return 54;
    case "7":
      return 55;
    case "8":
      return 56;
    case "9":
      return 57;
    case "Meta":
      return 91;
    case "*": //check
      return 106;
    case "+": //check
      return 107;
    case "-": //check
      return 109;
    case ".": //check
      return 110;
    case "/": //check
      return 111;
    case "F1":
      return 112;
    case "F2":
      return 113;
    case "F3":
      return 114;
    case "F4":
      return 115;
    case "F5":
      return 116;
    case "F6":
      return 117;
    case "F7":
      return 118;
    case "F8":
      return 119;
    case "F9":
      return 120;
    case "F10":
      return 121;
    case "F11":
      return 122;
    case "F12":
      return 123;
    case "NumLock":
      return 144;
    case "ScrollLock":
      return 145;
    case ";":
      return 186;
    case "=":
      return 187;
    case ",":
      return 188;
    //case '-':
    //  return 189
    //case '.':
    //  return 190
    //case '/':
    //  return 191
    case "'":
      return 192;
    case "[":
      return 219;
    //case '/':
    //  return 220
    case "]":
      return 221;
    case "#":
      return 222;
    case "`":
      return 223;
    default:
      return key.charCodeAt(0);
  }
}
