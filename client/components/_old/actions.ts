import { state } from "../../state/index.ts";
import * as machine from "../../machine/index.ts";
import { createHub } from "../../elementary/hub.ts";
import view from "./view.ts";

export const { on } = createHub<{
  "newProgram": unknown;
  "newSkeletonProgram": unknown;
  "openProgram": unknown;
  "saveProgram": unknown;
  "saveExportFile": unknown;
  "closeProgram": unknown;
  "copyCanvasGraphic": unknown;
  "saveCanvasGraphic": unknown;
  "printProgram": unknown;
  "printOutputText": unknown;
  "printConsoleText": unknown;
  "undo": unknown;
  "redo": unknown;
  "cut": unknown;
  "copy": unknown;
  "paste": unknown;
  "selectAll": unknown;
  "findAndReplace": unknown;
  "autoFormat": unknown;
  "storeCopy": unknown;
  "restoreCopy": unknown;
  "compile": unknown;
  "savePCodeJson": unknown;
  "savePCodeBinary": unknown;
  "run": unknown;
  "halt": unknown;
  "pause": unknown;
  "resetMachine": unknown;
  "viewMachineOptions": unknown;
  "loadAndRunPCode": unknown;
  "saveSettings": unknown;
  "resetSettings": unknown;
  "openExampleFile": string;
  "dumpMemory": unknown;
}>();

// file actions
on("newProgram", () => state.newFile());
on("newSkeletonProgram", () => state.newFile(true));
on("openProgram", () => state.openLocalFile());
on("saveProgram", () => state.saveLocalFile());
on("saveExportFile", () => state.saveExportFile());
on("closeProgram", () => state.closeCurrentFile());
on("copyCanvasGraphic", () => state.copyCanvasGraphic());
on("saveCanvasGraphic", () => state.saveCanvasGraphic());
on("printProgram", () => state.printProgram());
on("printOutputText", () => state.printOutputText());
on("printConsoleText", () => state.printConsoleText());

// edit actions
on("undo", () => state.undo());
on("redo", () => state.redo());
on("cut", () => state.cut());
on("copy", () => state.copy());
on("paste", () => state.paste());
on("selectAll", () => state.selectAll());
on("findAndReplace", () => state.findAndReplace());
on("autoFormat", () => state.autoFormat());
on("storeCopy", () => state.backupCode());
on("restoreCopy", () => state.restoreCode());

// compile actions
on("compile", () => state.compileCurrentFile());
on("savePCodeJson", () => state.savePCodeJson());
on("savePCodeBinary", () => state.savePCodeBinary());

// run actions
on("run", (_, element) => {
  if (element instanceof HTMLElement) element.blur();
  state.playPauseMachine();
});
on("halt", (_, element) => {
  if (element instanceof HTMLElement) element.blur();
  machine.halt();
});
on("pause", (_, element) => {
  if (element instanceof HTMLElement) element.blur();
  machine.pause();
});
on("resetMachine", (_, element) => {
  if (element instanceof HTMLElement) element.blur();
  machine.reset();
  view.send("closeMenu", "system");
});
on("viewMachineOptions", () => {
  view.send("selectTab", "options");
  view.send("closeMenu", "system");
});
on("loadAndRunPCode", () => state.loadAndRunPCode());

// options actions
on("saveSettings", () => state.saveSettings());
on("resetSettings", () => state.resetDefaults());

// examples actions
on("openExampleFile", (value) => state.openExampleFile(value));

// other actions
on("dumpMemory", (_, element) => {
  if (element instanceof HTMLElement) element.blur();
  state.dumpMemory();
});
