import { createState } from "../elementary/index.ts";

const initialState = {
  canvasStartSize: 1000,
  setupDefaultKeyBuffer: true,
  turtleAttributesAsGlobals: true,
  initialiseLocals: true,
  allowCSTR: true,
  separateReturnStack: true,
  separateMemoryControlStack: true,
  separateSubroutineRegisterStack: true,
};

const sessionKeys = Object.keys(initialState) as (keyof typeof initialState)[];

const state = createState(initialState, { sessionKeys });

export default state;
