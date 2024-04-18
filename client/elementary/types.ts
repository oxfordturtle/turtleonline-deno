export type Dictionary<Type = unknown> = Record<PropertyKey, Type>;

export type Child = Element | string;

export type EventDetail<Values extends Dictionary> = {
  key: keyof Values;
  value: Values[keyof Values];
  element: Element | undefined;
  hub: string;
};

export type Handler<Value> = (value: Value, element?: Element) => void | Promise<void>;

export type Handlers<Values extends Dictionary> = Dictionary<Handler<Values[keyof Values]>[]>;

export type Hub<Values extends Dictionary> = {
  readonly cleanup: () => void;
  readonly id: string;
  readonly on: <Key extends keyof Values>(key: Key, handler: Handler<Values[Key]>) => void;
  readonly send: <Key extends keyof Values>(key: Key, value: Values[Key], element?: Element) => void;
};

export type StatefulHub<State extends Dictionary> = State & Hub<State>;

export type StateOptions<State extends Dictionary> = {
  id?: string;
  sessionKeys?: (keyof State & string)[];
  localKeys?: (keyof State & string)[];
};
