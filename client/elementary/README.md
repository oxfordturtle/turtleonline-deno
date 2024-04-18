# Elementary

Elementary is a very small and simple JavaScript/TypeScript library for managing UI events and state.
You might like it if:

- React, Solid, Angular, Vue, etc. are overkill for your project;
- you want low-level control over your frontend code;
- but you're not so crazy that you want to be writing `document.createElement` and `document.addEventListener` all the time.

## Contents

1. [The Basics](#the-basics)
2. [API Specification](#api-specification)
3. [Further Details](#further-details)
4. [License](#license)

## The Basics

### Hubs and Events

Elementary uses custom events with a straightforward publish/subscribe model.
Start by calling `createHub()` to get a hub object with `on` and `send` functions.
If you're using TypeScript, you can define the names of the events and their payloads while you're at it:

```typescript
const hub = createHub<{
  log: string;
  colour: string;
}>();
```

Now you can register event handlers with `hub.on`, and dispatch events with `hub.send`:

```typescript
hub.on("log", (payload) => {
  console.log(payload)
});
hub.on("colour", (payload) => {
  document.body.style.backgroundColor = payload
});

hub.send("log", "Hello, world!"); // logs "Hello, world!" to the console
hub.send("color", "blue"); // changes the background colour of the page to blue
```

TypeScript will give you an error if you try to dispatch an event with an incorrect name, or send/handle an event with a payload of the wrong type.
You'll also get a warning in the console if you dispatch an event that has no handlers registered for it.

### Stateful Hubs

Hubs are stateless by default.
When you need to keep state values around in memory, use the `createState` function instead:

```typescript
const state = createState({
  colour: "red",
  count: 0,
});
```

Stateful hubs have an `on` function just like regular hubs.
They also have all the other properties you define in your initial state object, and these properties are automatically kept in sync with hub events.

They have no `send` function, because you should update state values directly instead.
When you do, the hub will automatically trigger the corresponding event with the new value as the payload.

You can store objects and arrays inside a state objects, but mutating these values directly won't trigger the corresponding hub event.
Instead, you should treat them as immutable and replace them with new objects or arrays when they need to change.

### Hubs and the DOM

Elementary provides a simple way to hook up hub events with the DOM.
You can set the `data-send` attribute of any DOM element to trigger an event of that name, with [the value of the element](#the-value-of-an-element) as its payload, whenever the element is interacted with:

```html
<!-- triggers a "log" event with "Hello, world!" when clicked -->
<button data-send="log" data-value="Hello, world!">Say Hello</button>

<!-- triggers a "colour" event with the selected value when changed -->
<select data-send="colour">
  <option value="red">red</option>
  <option value="green">green</option>
  <option value="blue">blue</option>
</select>
```

By default, Elementary listens for the _input_ event on `<input>`, `<select>`, and `<textarea>` elements, and the _click_ event on everything else.
You can override the default event type for an element by setting the `data-on` attribute:

```html
<!-- triggers a "log" event on mouseover instead of on click -->
<button data-on="mouseover" data-send="log" data-value="Hello, world!">Log</button>
```

You can also set the `data-get` attribute of an element to update [the value of that element](#the-value-of-an-element) whenever the corresponding event fires, or the `data-bind` attribute to set up a two-way binding:

```html
<!-- updates the content of the <span> element when the "colour" event fires -->
<p>Current colour: <span data-get="colour">red</span></p>

<!-- triggers a "colour" event with the selected value when changed
     AND updates to match the payload when a "colour" event is triggered -->
<select data-bind="colour">
  <option value="red">red</option>
  <option value="green">green</option>
  <option value="blue">blue</option>
</select>
```

### Manipulating the DOM

Elementary is _not_ a full UI library.
Beyond the basic `data-get`/`data-bind` shortcuts, it expects you to update the DOM manually in response to events.

In my experience, this is often not as hard as you might think - and if you have full control over it, it's usually easy do in a maximally efficient way.

That said, `document.createElement` is an absolute pain to use, because it doesn't let you set attributes and children in one function call.
So Elementary provides a few helper functions to make this easier:

- `createElement(tagName: string, attributes: Record<string, string>, ...children: (string | Element)[]): Element`

  A declarative alternative to `document.createElement`, `document.setAttribute`, and `document.appendChild`.
  Creates a new element with the given tag name, attributes, and children in one function call.

- `create.h1`, `create.div`, `create.span`, etc.

  Shorthands for `createElement('h1', ...)`, `createElement('div', ...)`, `createElement('span', ...)`, etc.

- `appendChildren(element: Element, ...children: (string | Element)[]): void`

  Appends one or more children to an element.

- `setChildren(element: Element, ...children: (string | Element)[]): void`

  Replaces all children of an element.

## API Specification

### Types

- ```typescript
  type Handler<Payload = unknown> = (payload: Payload, element?: Element) => void | Promise<void>;
  ```

- ```typescript
  type Child = Element | string;
  ```

- ```typescript
  type Hub<Payloads = Record<PropertyKey, unknown>> = {
    readonly cleanup: () => void;
    readonly id: string;
    readonly on: <Name extends keyof Payloads>(name: Name, handler: Handler<Payloads[Name]>) => void;
    readonly send: <Name extends keyof Payloads>(name: Name, payload: Payloads[Name], element?: Element) => void;
  };
  ```

- ```typescript
  type StatefulHub<State = Record<PropertyKey, unknown>> = State & Omit<Hub<State>, "send">;
  ```

- ```typescript
  type StateOptions<State = Record<PropertyKey, unknown>> = {
    id?: string;
    sessionKeys?: (keyof State & string)[];
    localKeys?: (keyof State & string)[];
  };
  ```

### Functions

- ```typescript
  createHub<Payloads = {}>(id?: string): Hub
  ```

- ```typescript
  createState<State = {}>(initialState: State, options?: StateOptions<State>): State & Hub<State>
  ```

- ```typescript
  createElement(tagName: string, attributes= {}, ...children: (Child | Child[])[]): Element
  ```

- ```typescript
  create[tagName](attributes = {}, ...children: (Child | Child[])[]): Element
  ```

- ```typescript
  appendChildren(element: Element, ...children: (Child | Child[])[]): void
  ```

- ```typescript
  setChildren(element: Element, ...children: (Child | Child[])[]): void
  ```

## Further Details

### Persistent State

`createState` takes an optional second argument.
You can use this to specify which properties of the state object should be stored in the browser's `sessionStorage` or `localStorage`:

```typescript
const initialState = {
  colour: "red",
  count: 0,
};

const { state, on, send } = createState(initialState, {
  sessionKeys: ["colour"],
  localKeys: ["count"],
});
```

The `sessionKeys` and `localKeys` properties should be arrays of strings, each string being the name of a property of the state object.
The values of these properties will be stored in the browser's `sessionStorage` or `localStorage` accordingly, and will be restored when the page is reloaded.

Values can be of any type that can be serialized to JSON.
They're passed through `JSON.stringify` on the way in and `JSON.parse` on the way out.

### Multiple Hubs and Hub IDs

You can create as many hubs / stateful hubs as you like.
Events dispatched from one hub will only ever be handled by handlers registered with the same hub, even if the event name coincides with one from another hub.

Internally, this works by attaching a unique (randomly generated) ID to each hub.

Sometimes you might need to know a hub's ID, notably if you need to hook up multiple hubs to the DOM (see later in this section).
You can access this ID as a property of the hub object:

```typescript
const hub = createHub<Payloads>();
hub.id; // e.g. "8f3216d2-f490-4c4e-a6cc-984ea2dd66fb"
```

Alternatively, you can pass an optional string argument to `createHub` to tell Elementary what its ID should be:

```typescript
const hub = createHub<Payloads>("foo");
hub.id; // "foo"
```

You'll get a warning in the console if you try to create a hub with an ID that's already in use.

For stateful hubs, you can specify the ID to use by passing a second `options` argument to `createState`:

```typescript
const state = createState(initialState, { id: "foo" });
```

By default, elements with `data-send`, `data-get`, or `data-bind` attributes will send/receive messages to/from _every_ hub with an event of that name.
If you have multiple hubs with overlapping event names, you can use the `data-hub` attribute to specify which hub an element should interact with:

```html
<!-- triggers a "log" event to the hub with ID "foo" -->
<button data-hub="foo" data-send="log" data-value="Hello, world!">Say Hello</button>
```

If an element doesn't have a `data-hub` attribute, Elementary will look for one on the element's parent, and so on up the DOM tree.

### Symbol Event Names

Event names don't have to be strings, they can be any value that can be used as a property key in JavaScript (i.e. a string, a number, or a symbol).

Using symbols as event names is a way of creating "private" events that can only be triggered from code that has access to the symbol.
You can't use them with `data-send`/`data-get`/`data-bind`.

### The Value of an Element

The three stateful HTML elements - `<input>`, `<select>`, and `<textarea>` - have a string `value` attribute that can be set and read.
So far so good.

But for inputs of type `"checkbox"` or `"radio"`, you care more about their Boolean `checked` attribute.
And actually, for `"radio"` inputs, what you really care about is the `value` attribute of the radio item that's checked.
And for `"number"` and `"range"` inputs, you want the value to be a number, not a string...
And for elements that aren't inputs, you want the value to be the `innerHTML` of the element (to work intuitively with `data-get`)...

Elementary abstracts all this away in what I hope is a natural way, so that you generally don't need to think about it.
As far as Elementary is concerned, the "value" of an element depends on its type and attributes:

- For `<input>` elements of type `"checkbox"`, the value is the `checked` attribute (a Boolean).
- For `<input>` elements of type `"radio"`, the value is the `value` attribute of whichever radio item in the same group (i.e. with the same `name`) is checked (a string).
- For `<input>` elements of type `"number"` or `"range"`, the value is the `value` attribute parsed as a float.
- For all other `<input>` elements, and for `<select>` and `<textarea>` elements, the value is the `value` attribute (a string).
- For all other elements, the value is the `innerHTML` of the element (a string).
- You can override all of the above by setting a `data-value` attribute on the element.

An element's value (in this sense) is what gets sent as the payload of a `data-send` event, and what gets updated in response to a `data-get` event.
Except for radio inputs, which are set to checked/unchecked depending on whether the element value matches the event payload.

### Cleaning Up

Hubs use an event listener on the window to call the appropriate handlers when events are dispatched, and attach event listeners to DOM elements to trigger events when users interact with the page.
They also use a mutation observer to ensure dynamically created or modified DOM elements work as expected.

Hubs include a `cleanup` function you can call to remove these event listeners and disconnect the mutation observer.
This is useful in the (rare) cases where you need to create and destroy hubs dynamically.

```typescript
// when you start
const hub = createHub<Payloads>();

// when you're done
hub.cleanup();
```

## License

Elementary is released under the [MIT license](LICENSE.md).
