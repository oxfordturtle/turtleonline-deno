import { createHub } from "../elementary/hub.ts";

const hub = createHub<{ selectTab: string }>();

export default hub;

hub.on("selectTab", (value) => {
  for (const select of Array.from(document.querySelectorAll('[data-send="selectTab"]'))) {
    for (const option of Array.from(select.children)) {
      if ((option as HTMLOptionElement).value === value) {
        (option as HTMLOptionElement).selected = true;
      }
    }
  }
  for (const tabPane of Array.from(document.querySelectorAll(`[data-tab="${value}"]`))) {
    if (tabPane.parentElement) {
      for (const sibling of Array.from(tabPane.parentElement.children)) {
        sibling.classList.remove("active");
      }
    }
    tabPane.classList.add("active");
  }
});
