/**
 * Language features.
 */
import type { Language } from "../constants/languages.ts";
import { state } from "../state/index.ts";
import highlight from "../tokenizer/highlight.ts";
import { on } from "../tools/hub.ts";

// get relevant elements
const codeElements = document.querySelectorAll(
  "code[data-language]"
) as NodeListOf<HTMLElement>;

// add syntax highlighting to code elements
for (const code of Array.from(codeElements)) {
  code.innerHTML = highlight(code.innerText, code.dataset.language as Language);
}

// register to keep in sync with system state
on("languageChanged", language);

/** updates the page to reflect language change */
function language(): void {
  // get relevant elements
  const languageElements = document.querySelectorAll(
    "[data-language]"
  ) as NodeListOf<HTMLElement>;

  for (const element of Array.from(languageElements)) {
    // show/hide elements according to language
    if (
      state.language === element.dataset.language ||
      element.id === "turtle"
    ) {
      element.classList.remove("hidden");
    } else {
      element.classList.add("hidden");
    }
  }
}
