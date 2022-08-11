/*
 * An array of colours.
 */
import type { Language } from "./languages.ts"

/** colour class definition */
export class Colour {
  readonly index: number
  readonly names: Record<Language, string>
  readonly type: "integer"
  readonly value: number
  readonly hex: string
  readonly text: "white" | "black"

  constructor(index: number, name: string, value: number, dark: boolean) {
    this.index = index
    this.names = { BASIC: name.toUpperCase(), C: name, Java: name, Pascal: name, Python: name, TypeScript: name }
    this.type = "integer"
    this.value = value
    this.hex = value.toString(16).padStart(6, "0").toUpperCase()
    this.text = dark ? "white" : "black"
  }
}

/** array of colours */
export const colours: Colour[] = [
  new Colour(1, "green", 0x228b22, true),
  new Colour(2, "red", 0xff0000, true),
  new Colour(3, "blue", 0x0000ff, true),
  new Colour(4, "yellow", 0xffff00, false),
  new Colour(5, "violet", 0x8a2be2, true),
  new Colour(6, "lime", 0x00ff00, false),
  new Colour(7, "orange", 0xffaa00, false),
  new Colour(8, "skyblue", 0x00b0ff, true),
  new Colour(9, "brown", 0x964b00, true),
  new Colour(10, "pink", 0xee1289, true),
  new Colour(11, "darkgreen", 0x006400, true),
  new Colour(12, "darkred", 0xb22222, true),
  new Colour(13, "darkblue", 0x000080, true),
  new Colour(14, "ochre", 0xc0b030, true),
  new Colour(15, "indigo", 0x4b0082, true),
  new Colour(16, "olive", 0x808000, true),
  new Colour(17, "orangered", 0xff6600, true),
  new Colour(18, "teal", 0x008080, true),
  new Colour(19, "darkbrown", 0x5c4033, true),
  new Colour(20, "magenta", 0xff00ff, true),
  new Colour(21, "lightgreen", 0x98fb98, false),
  new Colour(22, "lightred", 0xcd5c5c, true),
  new Colour(23, "lightblue", 0x99bbff, false),
  new Colour(24, "cream", 0xffffbb, false),
  new Colour(25, "lilac", 0xb093ff, true),
  new Colour(26, "yellowgreen", 0xaacc33, false),
  new Colour(27, "peach", 0xffccb0, false),
  new Colour(28, "cyan", 0x00ffff, false),
  new Colour(29, "lightbrown", 0xb08050, true),
  new Colour(30, "lightpink", 0xffb6c1, false),
  new Colour(31, "seagreen", 0x3cb371, true),
  new Colour(32, "maroon", 0x800000, true),
  new Colour(33, "royal", 0x4169e1, true),
  new Colour(34, "gold", 0xffc800, false),
  new Colour(35, "purple", 0x800080, true),
  new Colour(36, "emerald", 0x00c957, true),
  new Colour(37, "salmon", 0xfa8072, true),
  new Colour(38, "turquoise", 0x00bec1, true),
  new Colour(39, "coffee", 0x926f3f, true),
  new Colour(40, "rose", 0xff88aa, true),
  new Colour(41, "greengrey", 0x709070, true),
  new Colour(42, "redgrey", 0xb08080, true),
  new Colour(43, "bluegrey", 0x8080a0, true),
  new Colour(44, "yellowgrey", 0x909070, true),
  new Colour(45, "darkgrey", 0x404040, true),
  new Colour(46, "midgrey", 0x808080, true),
  new Colour(47, "lightgrey", 0xa0a0a0, true),
  new Colour(48, "silver", 0xc0c0c0, false),
  new Colour(49, "white", 0xffffff, false),
  new Colour(50, "black", 0x000000, true),
]
