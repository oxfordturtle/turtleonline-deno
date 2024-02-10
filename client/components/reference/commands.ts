/**
 * Native commands reference table.
 */
import type { Command } from "../../constants/commands.ts";
import { type Expression, commandCategories } from "../../constants/categories.ts";
import { fill, tr, td, code } from "../../tools/elements.ts";
import highlight from "../../tokenizer/highlight.ts";
import { state } from "../../state/index.ts";
import { on } from "../../tools/hub.ts";

// get relevant elements
const commandsTableBody = document.querySelector(
  '[data-component="commandsTableBody"]'
) as HTMLElement;

if (commandsTableBody) {
  on("languageChanged", updateTable);
  on("commandsCategoryIndexChanged", updateTable);
  on("showSimpleCommandsChanged", updateTable);
  on("showIntermediateCommandsChanged", updateTable);
  on("showAdvancedCommandsChanged", updateTable);
}

function updateTable(): void {
  if (commandsTableBody) {
    let commands = commandCategories[state.commandsCategoryIndex].expressions;
    if (!state.showSimpleCommands) commands = commands.filter((x) => x.level !== 0);
    if (!state.showIntermediateCommands) commands = commands.filter((x) => x.level !== 1);
    if (!state.showAdvancedCommands) commands = commands.filter((x) => x.level !== 2);
    commands = commands.filter((x) => (x as Command).names[state.language]);
    fill(commandsTableBody, commands.map(commandTableRow));
  }
}

function commandTableRow(expression: Expression): HTMLTableRowElement {
  const command = expression as Command;
  return tr({
    content: [
      td({
        content: [
          code({
            content: highlight(command.names[state.language] as string, state.language),
          }),
        ],
      }),
      td({
        content: command.parameters
          .map((x) => `<code>${highlight(x.name, state.language)}</code> (${x.type})`)
          .join("<br>"),
      }),
      td({ content: command.returns || "-" }),
      td({ content: command.description }),
    ],
  });
}
