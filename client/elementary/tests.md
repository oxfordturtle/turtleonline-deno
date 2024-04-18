# Tests

## Hubs and Events

1. Create a hub, attach an event handler, and send an event. Check the event handler is called.
2. Send an event with no handler. Check a warning is logged.
3. Create a second hub, attach an event handler with the same name as the first hub. Send the event. Check the second handler is called and the first one isn't.
4. Create two hubs with the same ID. Check a warning is logged.
5. Clean up all the hubs. Send an event from one of them. Check the handler isn't called.

## Hubs and the DOM

1. Create a hub and attach an event handler.
2. Create a button with `data-send`. Click the button. Check the event handler is called.
3. Create an input with `data-send`. Change the input. Check the event handler is called.
4. Create a button with a different `data-on`. Trigger the event. Check the handler is called.
5. Create a div with `data-get`. Check the div is updated when the event is sent.
6. Create an input with `data-get`. Check the input is updated when the event is sent.
7. Create two named hubs with overlapping event handlers. Create buttons for each and check they work (and don't overlap). Create a button with no hub and check both handlers are called.

## Managing State

1. Create a stateful hub.
2. Send an event and check the state is updated.
3. Update the state and check the event is sent.

## Manipulating the DOM

This should all be covered by the other tests.
