import type { Example } from "../constants/examples.ts";
import exampleGroups, { type ExampleGroup } from "../constants/exampleGroups.ts";
import { fill, a, span, i, div } from "../tools/elements.ts";
import systemState from "../state/systemState.ts";
import { Language } from "../constants/languages.ts";

const examplesMenu = document.querySelector('[data-component="examplesMenu"]') as HTMLElement;

if (examplesMenu) {
  const exampleGroupLink = (group: ExampleGroup): HTMLElement =>
    a({
      "data-send": "toggleMenu",
      "data-value": group.id,
      content: [
        span({
          content: `Examples ${group.index.toString(10)} - ${group.title}`,
        }),
        i({ className: "fa fa-caret-right", "aria-hidden": "true" }),
      ],
    });

  const exampleGroupMenu = (language: Language, group: ExampleGroup): HTMLElement =>
    div({
      className: "system-sub-menu",
      "data-menu": group.id,
      content: [
        a({
          "data-send": "closeMenu",
          "data-value": group.id,
          content: [
            i({ className: "fa fa-caret-left", "aria-hidden": "true" }),
            span({ content: "back" }),
          ],
        }) as HTMLElement,
      ].concat(
        group.examples
          .filter((example) => example.names[language] !== null)
          .map((example) => exampleLink(language, example))
      ),
    });

  const exampleLink = (language: Language, example: Example): HTMLElement =>
    a({
      "data-send": "openExampleFile",
      "data-value": example.id,
      content: [span({ content: example.names[language] })],
    });

  systemState.on("language", (language) => {
    const groupLinks = exampleGroups.slice(1).map(exampleGroupLink);
    const groupMenus = exampleGroups
      .slice(1)
      .map((exampleGroup) => exampleGroupMenu(language, exampleGroup));
    fill(examplesMenu, groupLinks.concat(groupMenus));
  });
}
