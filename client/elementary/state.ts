import { createHub } from "./hub.ts";
import type { Dictionary, Hub, StatefulHub, StateOptions } from "./types.ts";

export const createState = <State extends Dictionary = Dictionary>(
  state: State,
  options: StateOptions<State> = {}
): StatefulHub<State> => {
  // extract the options / default options
  const { id, sessionKeys = [], localKeys = [] } = options;

  // restore any values from session/local storage
  restoreStateFromStorage(state, sessionKeys, localKeys);

  // create a hub for the state
  const hub = createHubForState<State>(state, id);

  Object.keys(state).forEach((key) => {
    // add listeners to update the state object when hub events are received
    hub.on(key, (value) => {
      setStateValue(state, key, value, sessionKeys, localKeys);
    });

    // send an initial event for each key - thanks to the hub, this will ensure the DOM
    // is updated to match the initial/restored state
    hub.send(key, state[key as keyof State]);
  });

  // create a reactive state object that sends hub events when values are set
  const reactiveState = new Proxy<State>(
    state,
    createProxyHandler(hub, sessionKeys, localKeys)
  ) as StatefulHub<State>;

  // return the hub and reactive state
  return reactiveState;
};

const createHubForState = <State extends Dictionary>(state: State, id?: string): Hub<State> => {
  // create a regular hub
  const hub = createHub<State>(id);

  // augment the basic `on` function to send setter events with the current value after the current event loop
  const on = <Key extends keyof State>(key: Key, handler: (value: State[Key]) => void) => {
    hub.on(key, handler);
    // note we don't want to call the handler right away, because it could legitimately reference
    // values in scope that are only initialised later in the script
    queueMicrotask(() => handler(state[key]));
  };

  // return the hub with the augmented `on` function
  return { ...hub, on };
};

const restoreStateFromStorage = <State extends Dictionary>(
  state: State,
  sessionKeys: (keyof State & string)[],
  localKeys: (keyof State & string)[]
) => {
  // restore from session state
  for (const sessionKey of sessionKeys) {
    const storedValue = sessionStorage.getItem(sessionKey);
    state[sessionKey] = storedValue !== null ? JSON.parse(storedValue) : state[sessionKey];
  }

  // restore from local state
  for (const localKey of localKeys) {
    const storedValue = localStorage.getItem(localKey);
    state[localKey] = storedValue !== null ? JSON.parse(storedValue) : state[localKey];
  }
};

const setStateValue = <State extends Dictionary>(
  state: State,
  key: keyof State & string,
  value: State[keyof State & string],
  sessionKeys: (keyof State & string)[],
  localKeys: (keyof State & string)[]
) => {
  // update the value
  state[key] = value;

  // maybe store the value in session/local storage
  if (sessionKeys.includes(key)) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }
  if (localKeys.includes(key)) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

const createProxyHandler = <State extends Dictionary>(
  hub: Hub<State>,
  sessionKeys: (keyof State & string)[],
  localKeys: (keyof State & string)[]
) => ({
  get(target: State, key: keyof State & Hub<State> & string) {
    // provide access to the hub properties (apart from `send`)
    const isHubProperty = key in hub;
    return isHubProperty ? hub[key as keyof Hub<State>] : target[key];
  },
  set(target: State, key: keyof State & string, value: State[keyof State & string]) {
    if (key in hub) {
      // prevent overwriting of hub properties
      console.warn(`Cannot set hub property: ${key}`);
      return false;
    } else {
      // update the value (and maybe store in session/local storage)...
      setStateValue(target, key, value, sessionKeys, localKeys);

      // send a corresponding hub event...
      hub.send(key, value);

      // return true to indicate success
      return true;
    }
  },
});
