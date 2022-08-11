/// <reference lib="dom" />

// type imports
import type { Language } from "./constants/languages.ts"

// module imports
import { type State, state } from "./state/index.ts"
import { languages } from "./constants/languages.ts"
import { on } from "./tools/hub.ts"

// load general site components
import "./components/actions.ts"
import "./components/bindings.ts"
import "./components/download.ts"
import "./components/languages.ts"
import "./components/modes.ts"
import "./components/preview.ts"

// load help page components
import "./components/reference/colours.ts"
import "./components/reference/commands.ts"
import "./components/reference/cursors.ts"
import "./components/reference/fonts.ts"
import "./components/reference/keycodes.ts"

// load system components
import "./components/system/canvas.ts"
import "./components/system/comments.ts"
import "./components/system/console.ts"
import "./components/system/controls.ts"
import "./components/system/editor.ts"
import "./components/system/examples.ts"
import "./components/system/memory.ts"
import "./components/system/output.ts"
import "./components/system/pcode.ts"
import "./components/system/syntax.ts"
import "./components/system/turtle.ts"
import "./components/system/usage.ts"
import "./components/system/variables.ts"

// register service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/js/service-worker.js", { scope: "/" })
}

// add state to globals (for playing around in the console)
const glob = globalThis as unknown as { state: State }
glob.state = state

// look for the turtle element
const turtle = document.getElementById("turtle") as HTMLDivElement

// maybe setup state variables based on the turtle element's data properties
if (turtle) {
  if (turtle.dataset.language) {
    if (languages.includes(turtle.dataset.language as Language)) {
      state.language = turtle.dataset.language as Language
    }
  }

  if (turtle.dataset.example) {
    state.openExampleFile(turtle.dataset.example)
  }

  if (turtle.dataset.file) {
    state.openRemoteFile(turtle.dataset.file)
  }

  on("systemReady", function () {
    turtle.classList.remove("hidden")
  })
}

// maybe save settings before pageUnload
addEventListener("beforeunload", function () {
  if (state.alwaysSaveSettings) {
    state.saveSettings()
  }
})

// register to handle state and machine errors
on("error", function (error: Error): void {
  console.error(error)
  window.alert(error.message)
})

// initialise the page
state.init()
