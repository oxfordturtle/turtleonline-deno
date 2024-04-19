// register service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/js/service-worker.js", { scope: "/" });
}

// look for the turtle element
const turtle = document.getElementById("turtle") as HTMLDivElement;

// maybe setup state variables based on the turtle element's data properties
if (turtle) {
  if (turtle.dataset.language) {
    if (languages.includes(turtle.dataset.language as Language)) {
      state.language = turtle.dataset.language as Language;
    }
  }

  if (turtle.dataset.example) {
    state.openExampleFile(turtle.dataset.example);
  }

  if (turtle.dataset.file) {
    state.openRemoteFile(turtle.dataset.file);
  }

  on("systemReady", function () {
    turtle.classList.remove("hidden");
  });
}

// maybe save settings before pageUnload
addEventListener("beforeunload", function () {
  if (state.alwaysSaveSettings) {
    state.saveSettings();
  }
});

// register to handle state and machine errors
on("error", function (error: Error): void {
  console.error(error);
  alert(error.message);
});

// initialise the page
state.init();
