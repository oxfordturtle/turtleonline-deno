import type { Command } from "../constants/commands.ts";
import { commandCategories } from "../constants/categories.ts";
import highlight from "../tokenizer/highlight.ts";
import { create, createState, setChildren } from "../elementary/index.ts";
import systemState from "../state/systemState.ts";

const commandsTableBody = document.querySelector<HTMLElement>(
  '[data-component="commandsTableBody"]'
);

if (commandsTableBody) {
  const initialState = {
    commandsCategoryIndex: 0,
    showSimpleCommands: true,
    showIntermediateCommands: false,
    showAdvancedCommands: false,
  };
  
  const sessionKeys = Object.keys(initialState) as (keyof typeof initialState)[];
  
  const state = createState(initialState, { sessionKeys });

  const updateTable = () => {
    let commands = commandCategories[state.commandsCategoryIndex].expressions;
    if (!state.showSimpleCommands) commands = commands.filter((x) => x.level !== 0);
    if (!state.showIntermediateCommands) commands = commands.filter((x) => x.level !== 1);
    if (!state.showAdvancedCommands) commands = commands.filter((x) => x.level !== 2);
    commands = commands.filter((x) => x.names[systemState.language]);
    setChildren(
      commandsTableBody,
      commands.map(commandTableRow)
    );
  };

  const commandTableRow = (command: Command) =>
    create.tr({}, [
      create.td(
        {},
        create.code({
          innerHTML: highlight(command.names[systemState.language] as string, systemState.language),
        })
      ),
      create.td(
        { style: "white-space:nowrap" },
        command.parameters
          .map((x) => create.code({ innerHTML: `${highlight(x.name, systemState.language)} (${x.type})` }))
          .reduce((acc, current) => [...acc, create.br(), current], [] as Element[])
          .slice(1)
      ),
      create.td({}, create.code({}, command.returns ?? "-")),
      create.td({ innerHTML: command.description }),
    ]);

  systemState.on("language", updateTable);
  state.on("commandsCategoryIndex", updateTable);
  state.on("showSimpleCommands", updateTable);
  state.on("showIntermediateCommands", updateTable);
  state.on("showAdvancedCommands", updateTable);
}
