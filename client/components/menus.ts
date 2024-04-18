import { createHub } from "../elementary/hub.ts";

const hub = createHub<{
  toggleMenu: string;
  openMenu: string;
  closeMenu: string;
  closeSiteMenus: undefined;
  toggleSystemMenu: string;
  openSystemMenu: string;
  closeSystemMenu: string;
}>();

export default hub;

hub.on("toggleMenu", (value) => {
  const menu = document.querySelector(`[data-menu="${value}"]`);
  if (menu) {
    if (menu.classList.contains("open")) {
      hub.send("closeMenu", value);
    } else {
      hub.send("openMenu", value);
    }
  }
});

hub.on("openMenu", (value) => {
  // get relevant elements
  const a = document.querySelector(
    `[data-send="toggleMenu"][data-value="${value}"]`
  ) as HTMLAnchorElement;
  const menu = document.querySelector(`[data-menu="${value}"]`);

  if (a && menu) {
    // close other menus
    switch (value) {
      case "user":
        hub.send("closeMenu", "site");
        break;
      case "site": // fallthrough
      case "documentation":
        hub.send("closeMenu", "user");
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

hub.on("closeMenu", (value) => {
  // get relevant elements
  const a = document.querySelector(
    `[data-send="toggleMenu"][data-value="${value}"]`
  ) as HTMLAnchorElement;
  const menu = document.querySelector(`[data-menu="${value}"]`);

  if (a && menu) {
    // close all sub menus
    for (const subMenu of Array.from(menu.querySelectorAll("[data-menu]"))) {
      hub.send("closeMenu", (subMenu as HTMLElement).dataset.menu as string);
    }
    for (const subMenu of Array.from(menu.querySelectorAll("[data-system-menu]"))) {
      hub.send("closeSystemMenu", (subMenu as HTMLElement).dataset.systemMenu as string);
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

hub.on("closeSiteMenus", () => {
  hub.send("closeMenu", "site");
  hub.send("closeMenu", "documentation");
  hub.send("closeMenu", "user");
});

hub.on("toggleSystemMenu", (value) => {
  const menu = document.querySelector(`[data-system-menu="${value}"]`);
  if (menu) {
    if (menu.classList.contains("open")) {
      hub.send("closeSystemMenu", value);
    } else {
      hub.send("openSystemMenu", value);
    }
  }
});

hub.on("openSystemMenu", (value) => {
  // get relevant elements
  const a = document.querySelector(
    `[data-send="toggleSystemMenu"][data-value="${value}"]`
  ) as HTMLAnchorElement;
  const menu = document.querySelector(`[data-system-menu="${value}"]`);

  if (a && menu) {
    // open base system menu
    hub.send("openMenu", "system");

    // close all sibling menus
    const subMenus = a.parentElement?.parentElement?.querySelectorAll(
      '[data-send="toggleSystemMenu"]'
    );
    if (subMenus !== undefined) {
      for (const subMenu of Array.from(subMenus)) {
        const id = (subMenu as HTMLElement).dataset.value;
        hub.send("closeSystemMenu", id as string);
      }
    }

    // open this menu
    a.classList.add("open");
    menu.classList.add("open");
  }
});

hub.on("closeSystemMenu", (value) => {
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
