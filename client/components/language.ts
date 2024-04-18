import { type Language } from "../constants/languages.ts";
import type { Example } from "../constants/examples.ts";
import exampleGroups, { type ExampleGroup } from "../constants/exampleGroups.ts";
import highlight from "../tokenizer/highlight.ts";
import systemState from "../state/systemState.ts";
import { create, setChildren } from "../elementary/index.ts";

// add syntax highlighting to code elements
document.querySelectorAll<HTMLElement>("code[data-language]").forEach((code) => {
  code.innerHTML = highlight(code.innerText, code.dataset.language as Language);
});

// show/hide elements according to language
systemState.on("language", (language) => {
  document.querySelectorAll<HTMLElement>("[data-language]").forEach((element) => {
    // the system component also has a data-language property, but we don't want to do anything with it here
    if (element.dataset.component === "system") return;

    if (language === element.dataset.language) {
      element.classList.remove("hidden");
    } else {
      element.classList.add("hidden");
    }
  });
});

// update the examples menu according to language
systemState.on("language", () => {
  const examplesMenu = document.querySelector<HTMLElement>("[data-component='examplesMenu']");
  if (examplesMenu) {
    const groupLinks = exampleGroups.slice(1).map(exampleGroupLink);
    const groupMenus = exampleGroups.slice(1).map(exampleGroupMenu);
    setChildren(examplesMenu, [...groupLinks, ...groupMenus]);
  }
});

const exampleGroupLink = (group: ExampleGroup) =>
  create.a({ "data-send": "toggleMenu", "data-value": group.id }, [
    create.span({}, `Examples ${group.index.toString(10)} - ${group.title}`),
    create.i({ "class": "fa fa-caret-right", "aria-hidden": "true" }),
  ]);

const exampleGroupMenu = (group: ExampleGroup) =>
  create.div({ "class": "system-sub-menu", "data-menu": group.id}, [
    create.a({ "data-send": "closeMenu", "data-value": group.id }, [
      create.i({ "class": "fa fa-caret-left", "aria-hidden": "true" }),
      create.span({}, "back"),
    ]),
    ...group.examples.filter((example) => example.names[systemState.language] !== null).map(exampleLink),
  ]);

const exampleLink = (example: Example) =>
  create.a({ "data-send": "openExampleFile", "data-value": example.id }, [
    create.span({}, example.names[systemState.language]!)
  ]);
