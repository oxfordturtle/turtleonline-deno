import { Example, Group, groups } from "../../constants/examples.ts";
import { fill, a, span, i, div } from "../../tools/elements.ts";
import { state } from "../../state/index.ts";
import { closeMenu, toggleMenu } from "../view.ts";
import { on } from "../../tools/hub.ts";

const examplesMenu = document.querySelector('[data-component="examplesMenu"]') as HTMLElement;

const fillExamplesMenu = () => {
  const groupLinks = groups.slice(1).map(exampleGroupLink);
  const groupMenus = groups.slice(1).map(exampleGroupMenu);
  fill(examplesMenu, groupLinks.concat(groupMenus));
};

const exampleGroupLink = (group: Group): HTMLElement =>
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

const exampleGroupMenu = (group: Group): HTMLElement =>
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
