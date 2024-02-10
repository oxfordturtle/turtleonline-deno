export type Cursor = ReturnType<typeof cursor>;

const cursor = (index: number, name: string, css: string) =>
  ({
    __: "Cursor",
    index,
    name,
    css,
  } as const);

export default [
  cursor(0x0, "None", "none"),
  cursor(0x1, "Default", "default"),
  cursor(0x2, "Pointer", "pointer"),
  cursor(0x3, "Crosshair", "crosshair"),
  cursor(0x4, "Text", "text"),
  cursor(0x5, "Move", "move"),
  cursor(0x6, "Resize NESW", "nesw-resize"),
  cursor(0x7, "Resize NS", "ns-resize"),
  cursor(0x8, "Resize NWSE", "nwse-resize"),
  cursor(0x9, "Resize EW", "ew-resize"),
  cursor(0xa, "Resize N", "n-resize"),
  cursor(0xb, "Wait", "wait"),
  cursor(0xc, "Progress", "progress"),
  cursor(0xd, "No Drop", "no-drop"),
  cursor(0xe, "Forbidden", "not-allowed"),
  cursor(0xf, "Help", "help"),
] as const;
