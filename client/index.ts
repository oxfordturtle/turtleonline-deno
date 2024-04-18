/// <reference lib="dom" />
import "./components/colours.ts";
import "./components/commands.ts";
import "./components/downloadLink.ts";
import "./components/language.ts";
import "./components/maximize.ts";
import "./components/menus.ts";
import "./components/mode.ts";
import "./components/tabs.ts";
import { isLanguage } from "./constants/languages.ts";
import systemHub from "./state/systemHub.ts";
import systemState from "./state/systemState.ts";
// import "./components/canvas.ts";
// import "./components/comments.ts";
// import "./components/console.ts";
// import "./components/controls.ts";
// import "./components/editor.ts";
// import "./components/examples.ts";
// import "./components/memory.ts";
// import "./components/output.ts";
// import "./components/pcode.ts";
// import "./components/syntax.ts";
// import "./components/turtle.ts";
// import "./components/usage.ts";
// import "./components/variables.ts";

// look for the turtle element
const turtle = document.getElementById("turtle") as HTMLDivElement;

// maybe setup state variables based on the turtle element's data properties
if (turtle) {
  if (turtle.dataset.language) {
    if (isLanguage(turtle.dataset.language)) {
      systemState.language = turtle.dataset.language;
    }
  }

  if (turtle.dataset.example) {
    systemHub.send("openExampleFile", turtle.dataset.example);
  }

  if (turtle.dataset.file) {
    systemHub.send("openRemoteFile", turtle.dataset.file);
  }
}

// maybe save settings before pageUnload
addEventListener("beforeunload", () => {
  if (systemState.alwaysSaveSettings) {
    systemHub.send("saveSettings", undefined);
  }
});

// register to handle state and machine errors
systemHub.on("error", (error) => {
  console.error(error);
  alert(error.message);
});
