import type { Example } from "../../constants/examples.ts";
import exampleGroups, { type ExampleGroup } from "../../constants/exampleGroups.ts";
import { fill, a, span, i, div } from "../../tools/elements.ts";
import { state } from "../../state/index.ts";
import { closeMenu, toggleMenu } from "../view.ts";
import { on } from "../../tools/hub.ts";

const examplesMenu = document.querySelector('[data-component="examplesMenu"]') as HTMLElement;

const fillExamplesMenu = () => {
  const groupLinks = exampleGroups.slice(1).map(exampleGroupLink);
  const groupMenus = exampleGroups.slice(1).map(exampleGroupMenu);
  fill(examplesMenu, groupLinks.concat(groupMenus));
};

const exampleGroupLink = (group: ExampleGroup): HTMLElement =>
  a({
    on: [
      "click",
      () => {
        toggleMenu(group.id);
      },
    ],
    "data-action": "toggleMenu",
    "data-arg": group.id,
    content: [
      span({
        content: `Examples ${group.index.toString(10)} - ${group.title}`,
      }),
      i({ className: "fa fa-caret-right", "aria-hidden": "true" }),
    ],
  });

const exampleGroupMenu = (group: ExampleGroup): HTMLElement =>
  div({
    className: "system-sub-menu",
    "data-menu": group.id,
    content: [
      a({
        on: [
          "click",
          () => {
            closeMenu(group.id);
          },
        ],
        "data-action": "closeMenu",
        "data-arg": group.id,
        content: [
          i({ className: "fa fa-caret-left", "aria-hidden": "true" }),
          span({ content: "back" }),
        ],
      }) as HTMLElement,
    ].concat(
      group.examples.filter((example) => example.names[state.language] !== null).map(exampleLink)
    ),
  });

const exampleLink = (example: Example): HTMLElement =>
  a({
    on: [
      "click",
      function () {
        state.openExampleFile(example.id);
      },
    ],
    content: [span({ content: example.names[state.language] })],
  });

if (examplesMenu) {
  fillExamplesMenu();
  on("languageChanged", fillExamplesMenu);
}
