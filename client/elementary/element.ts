import type { Child, Dictionary } from "./types.ts";

export const create = new Proxy(
  {} as Dictionary<(attributes?: Dictionary<string>, ...children: (Child | Child[])[]) => Element>,
  {
    get(_, key) {
      return typeof key === "string" ? createElement.bind(null, key) : undefined;
    },
  }
);

export const createElement = (
  tagName: string,
  attributes: Dictionary<string> = {},
  ...children: (Child | Child[])[]
): Element => {
  const element = document.createElement(tagName);
  for (const [key, value] of Object.entries(attributes)) {
    if (key === "innerHTML") {
      element.innerHTML = value;
    } else {
      element.setAttribute(key, value);
    }
  }
  appendChildren(element, ...children);
  return element;
};

export const appendChildren = (element: Element, ...children: (Child | Child[])[]): void => {
  children.flat().forEach((child) => {
    if (typeof child === "string") {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  });
};

export const setChildren = (element: Element, ...children: (Child | Child[])[]): void => {
  element.innerHTML = "";
  appendChildren(element, ...children);
};

export const getValue = (element: Element): boolean | number | string => {
  if (element instanceof HTMLElement && element.dataset.value !== undefined) {
    return element.dataset.value;
  } else if (element instanceof HTMLInputElement) {
    if (element.type === "checkbox") {
      return element.checked;
    } else if (element.type === "radio") {
      const options = document.querySelectorAll<HTMLInputElement>(`input[type="radio"][name="${element.name}"]`);
      const selected = Array.from(options).find((option) => option.checked);
      return selected?.value ?? "";
    } else if (element.type === "number" || element.type === "range") {
      return parseFloat(element.value);
    } else {
      return element.value;
    }
  } else if (element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) {
    return element.value;
  } else {
    return element.innerHTML;
  }
};

export const setValue = (element: Element, value: boolean | number | string): void => {
  if (element instanceof HTMLElement && element.dataset.value !== undefined) {
    element.dataset.value = value.toString();
  } else if (element instanceof HTMLInputElement) {
    if (element.type === "checkbox") {
      element.checked = Boolean(value);
    } else if (element.type === "radio") {
      element.checked = element.value === value.toString();
    } else if (element.type === "number" || element.type === "range") {
      element.value = value.toString();
    } else {
      element.value = value.toString();
    }
  } else if (element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) {
    element.value = value.toString();
  } else {
    element.innerHTML = value.toString();
  }
};

export const getHub = (element: Element): string | undefined => {
  if (element instanceof HTMLElement && element.dataset.hub !== undefined) {
    return element.dataset.hub !== "" ? element.dataset.hub : undefined;
  }
  const closest = element.closest("[data-hub]");
  if (closest instanceof HTMLElement) {
    return closest.dataset.hub !== "" ? closest.dataset.hub : undefined;
  }
  return undefined;
};

export const getDefaultEventType = (element: Element): string =>
  element instanceof HTMLElement && element.dataset.on
    ? element.dataset.on
    : isInput(element)
    ? "input"
    : "click";

export const isInput = (
  element: Element
): element is HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement =>
  element instanceof HTMLInputElement ||
  element instanceof HTMLSelectElement ||
  element instanceof HTMLTextAreaElement;

export const isBooleanInput = (element: Element): element is HTMLInputElement =>
  element instanceof HTMLInputElement && (element.type === "checkbox" || element.type === "radio");
