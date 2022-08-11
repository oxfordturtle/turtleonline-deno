/**
 * Keycodes reference table.
 */
import type { Input } from "../../constants/inputs.ts"
import { inputs } from "../../constants/inputs.ts"
import { fill, tr, td, code } from "../../tools/elements.ts"
import { on } from "../../tools/hub.ts"

// get relevant elements
const keycodesTableBody = document.querySelector('[data-component="keycodesTableBody"]') as HTMLElement

if (keycodesTableBody) {
  on("languageChanged", updateTable)
}

function updateTable(): void {
  if (keycodesTableBody) {
    fill(keycodesTableBody, inputs.filter((x) => x.value > 0).map(keycodeTableRow))
  }
}

function keycodeTableRow(keycode: Input): HTMLTableRowElement {
  return tr({
    content: [td({ content: [code({ content: keycode.name })] }), td({ content: keycode.value.toString(10) })],
  })
}
