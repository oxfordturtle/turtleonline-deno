import { createHub } from "../elementary/hub.ts";

const hub = createHub<{ maximize: string }>();

export default hub;

hub.on("maximize", () => {
  const icon = document.querySelector("[data-send='maximize'] i") as HTMLElement;
  document.body.classList.toggle("fullscreen");
  if (document.body.classList.contains("fullscreen")) {
    icon.title = "Expand down";
    icon.classList.remove("fa-expand");
    icon.classList.add("fa-compress");
  } else {
    icon.title = "Maximize";
    icon.classList.remove("fa-compress");
    icon.classList.add("fa-expand");
  }
});
