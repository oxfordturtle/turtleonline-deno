import { createHub } from "../../elementary/hub.ts";

const { on, send } = createHub<{
  toggleMenu: string;
  openMenu: string;
  closeMenu: string;
  closeSiteMenus: undefined;
  toggleSystemMenu: string;
  openSystemMenu: string;
  closeSystemMenu: string;
  maximize: undefined;
  selectTab: string;
}>();

export default { on, send };

on("toggleMenu", (value) => {
  const menu = document.querySelector(`[data-menu="${value}"]`);
  if (menu) {
    if (menu.classList.contains("open")) {
      send("closeMenu", value);
    } else {
      send("openMenu", value);
    }
  }
});

on("openMenu", (value) => {
  // get relevant elements
  const a = document.querySelector(
    `[data-send="toggleMenu"][data-value="${value}"]`
  ) as HTMLAnchorElement;
  const menu = document.querySelector(`[data-menu="${value}"]`);

  if (a && menu) {
    // close other menus
    switch (value) {
      case "user":
        send("closeMenu", "site");
        break;
      case "site": // fallthrough
      case "documentation":
        send("closeMenu", "user");
        break;
    }

    // open the menu
    a.classList.add("open");
    menu.classList.add("open");

    // swap caret up/down
    const caret = a.querySelector(".fa-caret-down");
    if (caret) {
      caret.classList.remove("fa-caret-down");
      caret.classList.add("fa-caret-up");
    }
  }
});

on("closeMenu", (value) => {
  // get relevant elements
  const a = document.querySelector(
    `[data-send="toggleMenu"][data-value="${value}"]`
  ) as HTMLAnchorElement;
  const menu = document.querySelector(`[data-menu="${value}"]`);

  if (a && menu) {
    // close all sub menus
    for (const subMenu of Array.from(menu.querySelectorAll("[data-menu]"))) {
      send("closeMenu", (subMenu as HTMLElement).dataset.menu as string);
    }
    for (const subMenu of Array.from(menu.querySelectorAll("[data-system-menu]"))) {
      send("closeSystemMenu", (subMenu as HTMLElement).dataset.systemMenu as string);
    }

    // close the menu
    menu.classList.remove("open");
    a.classList.remove("open");

    // swap caret up/down
    const caret = a.querySelector(".fa-caret-up");
    if (caret) {
      caret.classList.remove("fa-caret-up");
      caret.classList.add("fa-caret-down");
    }
  }
});

on("closeSiteMenus", () => {
  send("closeMenu", "site");
  send("closeMenu", "documentation");
  send("closeMenu", "user");
});

on("toggleSystemMenu", (value) => {
  const menu = document.querySelector(`[data-system-menu="${value}"]`);
  if (menu) {
    if (menu.classList.contains("open")) {
      send("closeSystemMenu", value);
    } else {
      send("openSystemMenu", value);
    }
  }
});

on("openSystemMenu", (value) => {
  // get relevant elements
  const a = document.querySelector(
    `[data-send="toggleSystemMenu"][data-value="${value}"]`
  ) as HTMLAnchorElement;
  const menu = document.querySelector(`[data-system-menu="${value}"]`);

  if (a && menu) {
    // open base system menu
    send("openMenu", "system");

    // close all sibling menus
    const subMenus = a.parentElement?.parentElement?.querySelectorAll(
      '[data-send="toggleSystemMenu"]'
    );
    if (subMenus !== undefined) {
      for (const subMenu of Array.from(subMenus)) {
        const id = (subMenu as HTMLElement).dataset.value;
        send("closeSystemMenu", id as string);
      }
    }

    // open this menu
    a.classList.add("open");
    menu.classList.add("open");
  }
});

on("closeSystemMenu", (value) => {
  // get relevant elements
  const a = document.querySelector(
    `[data-send="toggleSystemMenu"][data-value="${value}"]`
  ) as HTMLAnchorElement;
  const menu = document.querySelector(`[data-system-menu="${value}"]`);

  if (a && menu) {
    // close this menu
    a.classList.remove("open");
    menu.classList.remove("open");
  }
});

on("selectTab", (value) => {
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

on("maximize", () => {
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
