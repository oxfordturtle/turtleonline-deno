import { getDefaultEventType, getHub, getValue, setValue } from "./element.ts";
import type { Dictionary, EventDetail, Handler, Handlers, Hub } from "./types.ts";

export const createHub = <Values extends Dictionary>(id = crypto.randomUUID()): Hub<Values> => {
  // warn in case of duplicate id
  if (hubIds.includes(id)) {
    console.warn(`Elementary: Duplicate hub ID "${id}".`);
  }

  // create the `send` function for triggering events
  const send = <Key extends keyof Values>(
    key: Key,
    value: Values[Key] = undefined as Values[Key],
    element?: Element
  ): void => {
    // create and dispatch the event
    const event = new CustomEvent<EventDetail<Values>>(elementary, {
      detail: { key, value, element, hub: id },
    });
    dispatchEvent(event);

    // warn if there are no handlers for this event
    if (handlers[key] === undefined || handlers[key].length === 0) {
      console.warn(`Elementary: No handlers registered for message "${key.toString()}".`);
    }
  };

  // create the `on` function for registering event handlers
  const on = <Key extends keyof Values>(key: Key, handler: Handler<Values[Key]>): void => {
    if (!handlers[key]) {
      // initialise the array of handlers for this event
      handlers[key] = [];

      if (typeof key === "string") {
        // initialise any DOM elements that should send this event
        document
          .querySelectorAll(`[data-send="${key}"],[data-bind="${key}"]`)
          .forEach((element) => {
            initialiseSender(element, id, handlers, sendCustomEvent);
          });
      }
    }

    // add the handler to the array
    handlers[key].push(handler as Handler<Values[keyof Values]>);
  };

  // create the `cleanup` function for removing event listeners
  const cleanup = () => {
    // remove the main event listener
    removeEventListener(elementary, customEventHandler);

    // disconnect the mutation observer
    mutationObserver.disconnect();

    // remove all event listeners from elements
    document.querySelectorAll("[data-send],[data-bind]").forEach((element) => {
      if (element instanceof HTMLElement) {
        const on = getDefaultEventType(element);
        element.removeEventListener(on, sendCustomEvent);
      }
    });
  };

  // define local variables
  const handlers: Handlers<Values> = {};
  const customEventHandler = createCustomEventHandler(id, handlers);
  const sendCustomEvent = createCustomEventSender(send);
  const mutationObserver = createMutationObserver(id, handlers, sendCustomEvent);

  // add the main event listener
  addEventListener(elementary, customEventHandler);

  // observe the document for changes
  mutationObserver.observe(document.body, { attributes: true, childList: true, subtree: true });

  // return the exposed functions
  return { cleanup, id, on, send };
};

// event type for custom events
const elementary = "elementary";

// array of hub IDs to warn in case of duplicates
const hubIds: string[] = [];

const createCustomEventHandler =
  <Values extends Dictionary>(hub: string, handlers: Handlers<Values>) =>
  (event: Event) => {
    if (event instanceof CustomEvent && event.type === elementary) {
      // get custom event detail
      const { detail } = event as CustomEvent<EventDetail<Values>>;

      // if the hub matches and there are handlers for this event, call them
      if (detail.hub === hub && handlers[detail.key]) {
        for (const handler of handlers[detail.key]) {
          handler(detail.value, detail.element);
        }
      }

      // for string keys...
      if (typeof detail.key === "string") {
        // for primitive values...
        if (
          typeof detail.value === "boolean" ||
          typeof detail.value === "number" ||
          typeof detail.value === "string"
        ) {
          // update the value of element get/bind elements
          document
            .querySelectorAll(`[data-get="${detail.key}"],[data-bind="${detail.key}"]`)
            .forEach((element) => {
              if (getHub(element) === hub || getHub(element) === undefined) {
                setValue(element, detail.value as boolean | number | string);
              }
            });
        }
      }
    }
  };

const createCustomEventSender =
  <Values extends Dictionary>(send: Hub<Values>["send"]) =>
  (event: Event): void => {
    const element = event.currentTarget;
    if (element instanceof HTMLElement) {
      const key = element.dataset.send || element.dataset.bind;
      if (key) {
        const value = getValue(element);
        send(key, value as Values[keyof Values], element);
      }
    }
  };

const initialiseSender = <Values extends Dictionary>(
  element: Element,
  hub: string,
  handlers: Handlers<Values>,
  sendCustomEvent: (event: Event) => void
) => {
  if (
    element instanceof HTMLElement &&
    (getHub(element) === hub || getHub(element) === undefined)
  ) {
    const key = element.dataset.send || element.dataset.bind;
    if (key !== undefined && handlers[key]) {
      const on = getDefaultEventType(element);
      element.addEventListener(on, sendCustomEvent);
    }
  }
};

const createMutationObserver = <Values extends Dictionary>(
  hub: string,
  handlers: Handlers<Values>,
  sendCustomEvent: (event: Event) => void
) =>
  new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "attributes" && mutation.target instanceof HTMLElement) {
        switch (mutation.attributeName) {
          case "data-send":
            if (handlers[mutation.target.dataset.send!]) {
              const on = getDefaultEventType(mutation.target);
              mutation.target.removeEventListener(on, sendCustomEvent);
              initialiseSender(mutation.target, hub, handlers, sendCustomEvent);
            }
            break;
          case "data-bind":
            if (handlers[mutation.target.dataset.bind!]) {
              const on = getDefaultEventType(mutation.target);
              mutation.target.removeEventListener(on, sendCustomEvent);
              initialiseSender(mutation.target, hub, handlers, sendCustomEvent);
            }
            break;
          case "data-on":
            if (mutation.target.dataset.send) {
              if (mutation.oldValue) {
                mutation.target.removeEventListener(mutation.oldValue, sendCustomEvent);
              }
              initialiseSender(mutation.target, hub, handlers, sendCustomEvent);
            }
            break;
        }
      } else if (mutation.type === "childList") {
        mutation.addedNodes.forEach((element) => {
          if (element instanceof Element) {
            initialiseSender(element, hub, handlers, sendCustomEvent);
            element.querySelectorAll("[data-send],[data-bind]").forEach((element) => {
              initialiseSender(element, hub, handlers, sendCustomEvent);
            });
          }
        });
      }
    });
  });
