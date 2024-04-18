import systemState from "../state/systemState.ts";
import tabs from "./tabs.ts";

systemState.on("mode", (mode) => {
  document.querySelectorAll<HTMLElement>("[data-mode]").forEach((element) => {
    if (element.dataset.component === "system") return;
    const modes = element.dataset.mode!.split(",");
    if (modes.includes(mode)) {
      element.classList.remove("hidden");
    } else {
      element.classList.add("hidden");
      // if we've just hidden the active tab, switch to the canvas tab
      if (element.classList.contains("system-tab-pane") && element.classList.contains("active")) {
        tabs.send("selectTab", "canvas");
      }
    }
  });
});
