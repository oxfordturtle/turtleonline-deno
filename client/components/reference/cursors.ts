/**
 * Cursors reference table.
 */
import cursors, { type Cursor } from "../../constants/cursors.ts";
import { fill, tr } from "../../tools/elements.ts";
import { on } from "../../tools/hub.ts";

// get relevant elements
const cursorsTableBody = document.querySelector(
  '[data-component="cursorsTableBody"]'
) as HTMLElement;

if (cursorsTableBody) {
  on("languageChanged", updateTable);
}

function updateTable(): void {
  if (cursorsTableBody) {
    fill(cursorsTableBody, [
      tr({ content: cursors.slice(0, 4).map(cursorTableCells).join("") }),
      tr({ content: cursors.slice(4, 8).map(cursorTableCells).join("") }),
      tr({ content: cursors.slice(8, 12).map(cursorTableCells).join("") }),
      tr({ content: cursors.slice(12, 16).map(cursorTableCells).join("") }),
    ]);
  }
}

function cursorTableCells(cursor: Cursor): string {
  return `<td>${cursor.index}</td><td style="cursor:${cursor.css}">${cursor.name}</td>`;
}
