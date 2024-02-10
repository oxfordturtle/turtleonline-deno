import type { Language } from "./languages.ts";
import PCode from "./pcodes.ts";
import type { Type } from "../lexer/lexeme.ts";
import type { SubroutineType } from "../parser/definitions/subroutine.ts";

export class Command {
  readonly id: string;
  readonly names: Record<Language, string | null>;
  readonly type: SubroutineType;
  readonly code: number[];
  readonly parameters: Parameter[];
  readonly returns: Type | null;
  readonly category: number;
  readonly level: number;
  readonly description: string;

  constructor(
    name: string,
    names: Partial<Record<Language, string | null>>,
    code: number[],
    parameters: Parameter[],
    returns: Type | null,
    category: number,
    level: number,
    description: string
  ) {
    const namesRecord: Record<Language, string | null> = {
      BASIC: name.toUpperCase(),
      C: name.toLowerCase(),
      Java: name,
      Pascal: name.toLowerCase(),
      Python: name.toLowerCase(),
      TypeScript: name,
    };
    this.id = name;
    this.names = { ...namesRecord, ...names };
    this.code = code;
    this.parameters = parameters;
    this.returns = returns;
    this.type = returns === null ? "procedure" : "function";
    this.category = category;
    this.level = level;
    this.description = description;
  }
}

export class Parameter {
  readonly name: string;
  readonly type: Type;
  readonly isReferenceParameter: boolean;
  readonly length: number;

  constructor(name: string, type: Type, isReferenceParameter = false, length = 1) {
    this.name = name;
    this.type = type;
    this.isReferenceParameter = isReferenceParameter;
    this.length = length;
  }
}

/** array of commands */
export const commands: Command[] = [
  // 0. Turtle: relative movement
  new Command(
    "forward",
    {},
    [PCode.fwrd],
    [new Parameter("n", "integer")],
    null,
    0,
    0,
    "Moves the Turtle forward <code>n</code> units, drawing as it goes (unless the pen is up)."
  ),
  new Command(
    "back",
    {},
    [PCode.back],
    [new Parameter("n", "integer")],
    null,
    0,
    0,
    "Moves the Turtle back <code>n</code> units, drawing as it goes (unless the pen is up)."
  ),
  new Command(
    "left",
    {},
    [PCode.left],
    [new Parameter("n", "integer")],
    null,
    0,
    0,
    "Rotates the Turtle left by <code>n</code> degrees."
  ),
  new Command(
    "right",
    {},
    [PCode.rght],
    [new Parameter("n", "integer")],
    null,
    0,
    0,
    "Rotates the Turtle right by <code>n</code> degrees."
  ),
  new Command(
    "drawXY",
    {},
    [PCode.drxy],
    [new Parameter("x", "integer"), new Parameter("y", "integer")],
    null,
    0,
    1,
    "Moves the Turtle in a straight line to a point <code>x</code> units away along the x-axis and <code>y</code> units away along the y-axis, drawing as it goes (unless the pen is up)."
  ),
  new Command(
    "moveXY",
    {},
    [PCode.mvxy],
    [new Parameter("x", "integer"), new Parameter("y", "integer")],
    null,
    0,
    1,
    "Moves the Turtle in a straight line to a point <code>x</code> units away along the x-axis and <code>y</code> units away along the y-axis, <em>without</em> drawing (regardless of the current pen status)."
  ),
  // 1. Turtle: absolute movement
  new Command(
    "home",
    {},
    [PCode.home],
    [],
    null,
    1,
    0,
    "Moves the Turtle back to its starting position in the centre of the canvas, facing north, drawing as it goes (unless the pen is up)."
  ),
  new Command(
    "setX",
    {},
    [PCode.setx],
    [new Parameter("x", "integer")],
    null,
    1,
    0,
    "Sets the Turtle&rsquo;s <code>x</code> coordinate directly (without movement or drawing on the canvas). This can also be achieved by direct assignment of the global variable <code>turtx</code>."
  ),
  new Command(
    "setY",
    {},
    [PCode.sety],
    [new Parameter("y", "integer")],
    null,
    1,
    0,
    "Sets the Turtle&rsquo;s <code>y</code> coordinate directly (without movement or drawing on the canvas). This can also be achieved by direct assignment of the global variable <code>turty</code>."
  ),
  new Command(
    "setXY",
    {},
    [PCode.toxy],
    [new Parameter("x", "integer"), new Parameter("y", "integer")],
    null,
    1,
    0,
    "Sets the Turtle&rsquo;s <code>x</code> and <code>y</code> coordinates directly (without movement or drawing on the canvas). This can also be achieved by direct assingment of the global variables <code>turtx</code> and <code>turty</code>."
  ),
  new Command(
    "direction",
    {},
    [PCode.setd],
    [new Parameter("n", "integer")],
    null,
    1,
    0,
    "Sets the Turtle&rsquo;s direction to <code>n</code> degrees (0 for north, 90 for east, 180 for south, 270 for west). This can also be achieved by direct assignment of the global variable <code>turtd</code>. Note that the number of degrees in a circle (360 by default) can be changed with the <code>angles</code> command."
  ),
  new Command(
    "angles",
    {},
    [PCode.angl],
    [new Parameter("degrees", "integer")],
    null,
    1,
    1,
    "Sets the number of <code>degrees</code> in a circle (360 by default)."
  ),
  new Command(
    "turnXY",
    {},
    [PCode.turn],
    [new Parameter("x", "integer"), new Parameter("y", "integer")],
    null,
    1,
    1,
    "Turns the Turtle to face the point <code>x</code> units away alongthe x-axis and <code>y</code> units away along the y-axis."
  ),
  // 2. Turtle: shape drawing
  new Command(
    "circle",
    {},
    [PCode.circ],
    [new Parameter("radius", "integer")],
    null,
    2,
    0,
    "Draws a circle outline in the Turtle&rsquo;s current colour and thickness, of the given <code>radius</code>, centred on the Turtle&rsquo;s current location."
  ),
  new Command(
    "blot",
    {},
    [PCode.blot],
    [new Parameter("radius", "integer")],
    null,
    2,
    0,
    "Draws a filled circle in the Turtle&rsquo;s current colour, of the given <code>radius</code>, centred on the Turtle&rsquo;s current location."
  ),
  new Command(
    "ellipse",
    {},
    [PCode.elps],
    [new Parameter("Xradius", "integer"), new Parameter("Yradius", "integer")],
    null,
    2,
    0,
    "Draws an ellipse outline in the Turtle&rsquo;s current colour and thickness, of the given <code>Xradius</code> and <code>Yradius</code>, centred on the Turtle&rsquo;s current location."
  ),
  new Command(
    "ellblot",
    {},
    [PCode.eblt],
    [new Parameter("Xradius", "integer"), new Parameter("Yradius", "integer")],
    null,
    2,
    0,
    "Draws a filled ellipse in the Turtle&rsquo;s current colour, of the given <code>Xradius</code> and <code>Yradius</code>, centred on the Turtle&rsquo;s current location."
  ),
  new Command(
    "polyline",
    {},
    [PCode.poly],
    [new Parameter("n", "integer")],
    null,
    2,
    1,
    "Draws a polygon outline in the Turtle&rsquo;s current colour and thickness, connecting the last <code>n</code> locations that the Turtle has visited."
  ),
  new Command(
    "polygon",
    {},
    [PCode.pfil],
    [new Parameter("n", "integer")],
    null,
    2,
    1,
    "Draws a filled polygon in the Turtle&rsquo;s current colour and thickness, connecting the last <code>n</code> locations that the Turtle has visited."
  ),
  new Command(
    "forget",
    {},
    [PCode.frgt],
    [new Parameter("n", "integer")],
    null,
    2,
    1,
    "Makes the Turtle &ldquo;forget&rdquo; the last <code>n</code> points it has visited. Used in conjunction with <code>polyline</code> and <code>polygon</code>."
  ),
  new Command(
    "remember",
    {},
    [PCode.rmbr],
    [],
    null,
    2,
    1,
    "Makes the Turtle &ldquo;remember&rdquo; its current location. This is only necessary if its current location was set by a direct assignment of the global variables <code>turtx</code> and <code>turty</code>; when using the standard moving commands, the Turtle automatically remembers where it has been."
  ),
  new Command(
    "box",
    {},
    [PCode.box],
    [
      new Parameter("x", "integer"),
      new Parameter("y", "integer"),
      new Parameter("colour", "integer"),
      new Parameter("border", "boolean"),
    ],
    null,
    2,
    1,
    "Draws a box of width <code>x</code> and height <code>y</code>, with the top left corner in the Turtle&rsquo;s current location, filled with the specified <code>colour</code>. If <code>border</code> is <code>true</code>, a border is drawn around the box in the Turtle&rsquo;s current colour and and thickness. This is intended to be used with the <code>display</code> command, to provide a box for framing text."
  ),
  // 3. Other Turtle commands
  new Command(
    "colour",
    {},
    [PCode.colr],
    [new Parameter("colour", "integer")],
    null,
    3,
    0,
    "Sets the <code>colour</code> of the Turtle&rsquo;s pen. Takes as an argument either an RGB value, or one of the Turtle System&rsquo;s fifty predefined colour constants (see the <b>Colours</b> tab). This can also be achieved by direct assignment of the global variable <code>turtc</code>."
  ),
  new Command(
    "randCol",
    { BASIC: "RNDCOL" },
    [PCode.rand, PCode.incr, PCode.rgb, PCode.colr],
    [new Parameter("n", "integer")],
    null,
    3,
    0,
    "Assigns a random colour to the Turte&rsquo;s pen, between 1 and <code>n</code> (maximum 50). The colours are taken from the Turtle System&rsquo;s fifty predefined colours, which are each assigned a number between 1 and 50 (see the <b>Colours</b> tab)."
  ),
  new Command(
    "thickness",
    {},
    [PCode.thik],
    [new Parameter("thickness", "integer")],
    null,
    3,
    0,
    "Sets the <code>thickness</code> of the Turtle&rsquo;s pen (for line drawing, and outlines of circles, ellipses, boxes, and polygons). This can also be achieved by direct assignment of the global variable <code>turtt</code>."
  ),
  new Command(
    "penUp",
    {},
    [PCode.ldin, 0, PCode.pen],
    [],
    null,
    3,
    0,
    "Lifts the Turtle&rsquo;s pen, so that subsequent movement will not draw a line on the Canvas."
  ),
  new Command(
    "penDown",
    {},
    [PCode.ldin, -1, PCode.pen],
    [],
    null,
    3,
    0,
    "Lowers the Turtle&rsquo;s pen, so that subsequent movement will draw a line on the Canvas."
  ),
  new Command(
    "output",
    {},
    [PCode.outp],
    [
      new Parameter("clear", "boolean"),
      new Parameter("colour", "integer"),
      new Parameter("tofront", "boolean"),
    ],
    null,
    3,
    1,
    "Modifies the textual output. If the first argument is <code>true</code>, it clears any existing text. The second argument specifies the background colour, and the third argument is for switching the display. If the third argument is <code>true</code>, it switches to the <b>Output</b> tab, while if it is <code>false</code>, it switches to the <b>Canvas and Console</b> tab."
  ),
  new Command(
    "console",
    {},
    [PCode.cons],
    [new Parameter("clear", "boolean"), new Parameter("colour", "integer")],
    null,
    3,
    1,
    "Modifies the Console; if the first argument is <code>true</code>, it clears any existing text, while the second argument specifies the background colour."
  ),
  new Command(
    "rgb",
    {},
    [PCode.rgb],
    [new Parameter("colour", "integer")],
    "integer",
    3,
    2,
    "Returns the RGB value of the input <code>colour</code> (an integer between 1 and 50). For example, <code>rgb(red)=255</code>."
  ),
  new Command(
    "mixCols",
    {},
    [PCode.mixc],
    [
      new Parameter("colour1", "integer"),
      new Parameter("colour1", "integer"),
      new Parameter("proportion1", "integer"),
      new Parameter("proportion2", "integer"),
    ],
    "integer",
    3,
    2,
    "Mixes the given colours in the given proportions."
  ),
  new Command(
    "newTurtle",
    {},
    [PCode.ldin, 0, PCode.sptr],
    [new Parameter("array", "integer", false, 5)],
    null,
    3,
    2,
    "Points the Turtle to a custom array in memory (this must be an array of five integers, corresponding to the Turtle&rsquo;s five properties, <code>turtx</code>, <code>turty</code>, <code>turtd</code>, <code>turtt</code>, and <code>turtc</code>). Use repeatedly to simulate multiple Turtles."
  ),
  new Command(
    "oldTurtle",
    {},
    [PCode.oldt],
    [],
    null,
    3,
    2,
    "Points the Turtle back to the default (built-in) array in memory. Use in conjunction with <code>newturtle</code>."
  ),
  // 4. Canvas operations
  new Command(
    "update",
    {},
    [PCode.ldin, -1, PCode.udat],
    [],
    null,
    4,
    0,
    "Makes the Machine update the Canvas, and continue updating with all subsequent drawing commands. Used in conjunction with <em>noupdate</em>."
  ),
  new Command(
    "noUpdate",
    {},
    [PCode.ldin, 0, PCode.udat],
    [],
    null,
    4,
    0,
    "Makes the Machine refrain from updating the Canvas when executing all subsequent drawing commands, until <em>update</em> is called. Use this to create smooth animations, by queueing up several drawing commands to execute simultaneously."
  ),
  new Command(
    "blank",
    {},
    [PCode.blnk],
    [new Parameter("colour", "integer")],
    null,
    4,
    0,
    "Blanks the entire Canvas with the specified <code>colour</code>."
  ),
  new Command(
    "canvas",
    {},
    [PCode.canv],
    [
      new Parameter("x1", "integer"),
      new Parameter("y1", "integer"),
      new Parameter("x2", "integer"),
      new Parameter("y2", "integer"),
    ],
    null,
    4,
    1,
    "Sets the top left Canvas coordinate to <code>(x1,y1)</code>, and the Canvas width and height to <code>x2</code> and <code>y2</code> respectively. Note that the width and height fix the number of virtual points on the Canvas, not the number of actual pixels."
  ),
  new Command(
    "resolution",
    {},
    [PCode.reso],
    [new Parameter("x", "integer"), new Parameter("y", "integer")],
    null,
    4,
    1,
    "Sets the Canvas resolution, i.e. the number of actual pixels in the <code>x</code> and <code>y</code> dimensions. To be used in conjunction with the <code>canvas</code> command, typically to set the number of actual pixels equal to the number of virtual points on the Canvas."
  ),
  new Command(
    "pixSet",
    {},
    [PCode.pixs],
    [
      new Parameter("x", "integer"),
      new Parameter("y", "integer"),
      new Parameter("colour", "integer"),
    ],
    null,
    4,
    2,
    "Sets the <code>colour</code> at point <code>(x,y)</code>."
  ),
  new Command(
    "pixCol",
    {},
    [PCode.pixc],
    [new Parameter("x", "integer"), new Parameter("y", "integer")],
    "integer",
    4,
    2,
    "Returns the RGB value of the colour at point <code>(x,y)</code>."
  ),
  new Command(
    "recolour",
    {},
    [PCode.rcol],
    [
      new Parameter("x", "integer"),
      new Parameter("y", "integer"),
      new Parameter("colour", "integer"),
    ],
    null,
    4,
    2,
    "Floods the Canvas with the specified <code>colour</code>, starting at point <code>(x,y)</code>, until reaching any different colour."
  ),
  new Command(
    "fill",
    {},
    [PCode.fill],
    [
      new Parameter("x", "integer"),
      new Parameter("y", "integer"),
      new Parameter("colour", "integer"),
      new Parameter("boundary", "integer"),
    ],
    null,
    4,
    2,
    "Floods the Canvas with the specified <code>colour</code>, starting at point <code>(x,y)</code>, until reaching the <code>boundary</code> colour."
  ),
  // 5. General arithmetic functions
  new Command(
    "inc",
    { C: null, Java: null, Python: null, TypeScript: null },
    [PCode.dupl, PCode.lptr, PCode.incr, PCode.swap, PCode.sptr],
    [new Parameter("variable", "integer", true)],
    null,
    5,
    0,
    "Increments the specified <code>variable</code> by 1."
  ),
  new Command(
    "dec",
    { C: null, Java: null, Python: null, TypeScript: null },
    [PCode.dupl, PCode.lptr, PCode.decr, PCode.swap, PCode.sptr],
    [new Parameter("variable", "integer", true)],
    null,
    5,
    0,
    "Decrements the specified <code>variable</code> by 1."
  ),
  new Command(
    "abs",
    {},
    [PCode.abs],
    [new Parameter("n", "integer")],
    "integer",
    5,
    0,
    "Returns the absolute value of <code>n</code>, i.e. <code>n</code> if positive, <code>-n</code> if negative."
  ),
  new Command(
    "sign",
    { BASIC: "SGN" },
    [PCode.sign],
    [new Parameter("a", "integer")],
    "integer",
    5,
    1,
    "Returns <code>+1</code> if <code>a</code> is positive, <code>-1</code> if <code>a</code> is negative, and <code>0</code> otherwise."
  ),
  new Command(
    "max",
    {},
    [PCode.maxi],
    [new Parameter("a", "integer"), new Parameter("b", "integer")],
    "integer",
    5,
    1,
    "Returns the maximum of <code>a</code> and <code>b</code>."
  ),
  new Command(
    "min",
    {},
    [PCode.mini],
    [new Parameter("a", "integer"), new Parameter("b", "integer")],
    "integer",
    5,
    1,
    "Returns the minimum of <code>a</code> and <code>b</code>."
  ),
  new Command(
    "sqrt",
    { BASIC: "SQR" },
    [PCode.sqrt],
    [new Parameter("a", "integer"), new Parameter("mult", "integer")],
    "integer",
    5,
    1,
    "Returns <code>&radic;a</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  new Command(
    "hypot",
    {},
    [PCode.hyp],
    [
      new Parameter("a", "integer"),
      new Parameter("b", "integer"),
      new Parameter("mult", "integer"),
    ],
    "integer",
    5,
    1,
    "Returns <code>&radic;(a<sup>2</sup>+b<sup>2</sup>)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  new Command(
    "RND",
    { C: null, Java: null, Pascal: null, Python: null, TypeScript: null },
    [PCode.rand, PCode.incr],
    [new Parameter("n", "integer")],
    "integer",
    5,
    1,
    "Returns a random integer between 1 and <code>n</code>."
  ),
  new Command(
    "rand",
    {
      BASIC: null,
      C: "rand",
      Java: "randInt",
      Pascal: "random",
      Python: "randrange",
      TypeScript: "randInt",
    },
    [PCode.rand],
    [new Parameter("n", "integer")],
    "integer",
    5,
    1,
    "Returns a random non-negative integer less than <code>n</code>."
  ),
  new Command(
    "randint",
    { BASIC: null, C: null, Java: null, Pascal: null, TypeScript: null },
    [
      PCode.swap,
      PCode.dupl,
      PCode.rota,
      PCode.incr,
      PCode.swap,
      PCode.subt,
      PCode.rand,
      PCode.plus,
    ],
    [new Parameter("a", "integer"), new Parameter("b", "integer")],
    "integer",
    5,
    1,
    "Returns a random integer between <code>a</code> and <code>b</code>."
  ),
  new Command(
    "seed",
    { BASIC: "RNDSEED", C: "srand", Pascal: "randseed", Python: "randseed" },
    [PCode.seed],
    [new Parameter("seed", "integer")],
    "integer",
    5,
    1,
    "Initialises the random number generator with the given <code>seed</code>, and returns that seed. If <code>seed</code> is 0, the seed is set from the current system clock."
  ),
  new Command(
    "power",
    { C: "pow", TypeScript: "pow" },
    [PCode.powr],
    [
      new Parameter("a", "integer"),
      new Parameter("b", "integer"),
      new Parameter("c", "integer"),
      new Parameter("mult", "integer"),
    ],
    "integer",
    5,
    2,
    "Returns <code>(a/b)<sup>c</sup></code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  new Command(
    "root",
    {},
    [PCode.root],
    [
      new Parameter("a", "integer"),
      new Parameter("b", "integer"),
      new Parameter("c", "integer"),
      new Parameter("mult", "integer"),
    ],
    "integer",
    5,
    2,
    "Returns <code><sup>c</sup>&radic;(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  new Command(
    "divmult",
    {},
    [PCode.divm],
    [
      new Parameter("a", "integer"),
      new Parameter("b", "integer"),
      new Parameter("mult", "integer"),
    ],
    "integer",
    5,
    2,
    "Returns <code>a/b</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  new Command(
    "maxInt",
    {},
    [PCode.mxin],
    [],
    "integer",
    5,
    2,
    "Returns the maximum integer that the Machine can deal with (2<sup>31</sup>-1)."
  ),
  new Command(
    "shl",
    { BASIC: null, C: null, Java: null, Python: null, TypeScript: null },
    [PCode.shft],
    [new Parameter("number", "integer"), new Parameter("shift", "integer")],
    "integer",
    5,
    2,
    "Shift bits left."
  ),
  new Command(
    "shr",
    { BASIC: null, C: null, Java: null, Python: null, TypeScript: null },
    [PCode.neg, PCode.shft],
    [new Parameter("number", "integer"), new Parameter("shift", "integer")],
    "integer",
    5,
    2,
    "Shift bits right."
  ),
  // 6. Trig / exp / log functions
  new Command(
    "sin",
    {},
    [PCode.sin],
    [
      new Parameter("a", "integer"),
      new Parameter("b", "integer"),
      new Parameter("mult", "integer"),
    ],
    "integer",
    6,
    1,
    "Returns <code>sin(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  new Command(
    "cos",
    {},
    [PCode.cos],
    [
      new Parameter("a", "integer"),
      new Parameter("b", "integer"),
      new Parameter("mult", "integer"),
    ],
    "integer",
    6,
    1,
    "Returns <code>cos(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  new Command(
    "tan",
    {},
    [PCode.tan],
    [
      new Parameter("a", "integer"),
      new Parameter("b", "integer"),
      new Parameter("mult", "integer"),
    ],
    "integer",
    6,
    1,
    "Returns <code>tan(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  new Command(
    "pi",
    {},
    [PCode.pi],
    [new Parameter("mult", "integer")],
    "integer",
    6,
    1,
    "Returns the value of Pi, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  new Command(
    "exp",
    {},
    [PCode.exp],
    [
      new Parameter("a", "integer"),
      new Parameter("b", "integer"),
      new Parameter("mult", "integer"),
    ],
    "integer",
    6,
    1,
    "Returns <code>a<sup>b</sup></code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  new Command(
    "log",
    { BASIC: "LN", Pascal: "ln" },
    [PCode.ln],
    [
      new Parameter("a", "integer"),
      new Parameter("b", "integer"),
      new Parameter("mult", "integer"),
    ],
    "integer",
    6,
    1,
    "Returns <code>ln(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  new Command(
    "antilog",
    {},
    [PCode.alog],
    [
      new Parameter("a", "integer"),
      new Parameter("b", "integer"),
      new Parameter("mult", "integer"),
    ],
    "integer",
    6,
    2,
    "Returns <code>antilog<sub>10</sub>(a/b)</code> - i.e. <code>10<sup>a/b</sub></code> - multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  new Command(
    "log10",
    {},
    [PCode.log],
    [
      new Parameter("a", "integer"),
      new Parameter("b", "integer"),
      new Parameter("mult", "integer"),
    ],
    "integer",
    6,
    2,
    "Returns <code>log<sub>10</sub>(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  new Command(
    "asin",
    { BASIC: "ASN", Pascal: "arcsin" },
    [PCode.asin],
    [
      new Parameter("a", "integer"),
      new Parameter("b", "integer"),
      new Parameter("mult", "integer"),
    ],
    "integer",
    6,
    2,
    "Returns <code>arcsin(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  new Command(
    "acos",
    { BASIC: "ACS", Pascal: "arccos" },
    [PCode.acos],
    [
      new Parameter("a", "integer"),
      new Parameter("b", "integer"),
      new Parameter("mult", "integer"),
    ],
    "integer",
    6,
    2,
    "Returns <code>arccos(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  new Command(
    "atan",
    { BASIC: "ATN", Pascal: "arctan" },
    [PCode.atan],
    [
      new Parameter("a", "integer"),
      new Parameter("b", "integer"),
      new Parameter("mult", "integer"),
    ],
    "integer",
    6,
    2,
    "Returns <code>arctan(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  // 7. String/list operations
  new Command(
    "write",
    {
      BASIC: "PRINTON",
      C: "printon",
      Java: "printon",
      Pascal: "write",
      Python: null,
      TypeScript: "printon",
    },
    [PCode.writ],
    [new Parameter("string", "string")],
    null,
    7,
    0,
    "Prints the input <code>string</code> to the console and textual output area of the System."
  ),
  new Command(
    "writeln",
    {
      BASIC: "PRINT",
      C: "print",
      Java: "print",
      Pascal: "writeln",
      Python: "print",
      TypeScript: "print",
    },
    [PCode.writ, PCode.newl],
    [new Parameter("string", "string")],
    null,
    7,
    0,
    "Prints the input <code>string</code> to the console and textual output area of the System, followed by a line break."
  ),
  new Command(
    "display",
    {},
    [PCode.disp],
    [
      new Parameter("string", "string"),
      new Parameter("font", "integer"),
      new Parameter("size", "integer"),
    ],
    null,
    7,
    0,
    "Displays the input <code>string</code> on the canvas, in the Turtle&rsquo;s current colour and at the Turtle&rsquo;s current location, in the specified <code>font</code> and <code>size</code>. Can be used in conjunction with the <code>box</code> drawing command. For a list of available fonts, see the <b>Constants</b> tab."
  ),
  new Command(
    "lower",
    {
      BASIC: "LCASE$",
      C: "strlwr",
      Java: "toLowerCase",
      Pascal: "lowercase",
      Python: ".lower",
      TypeScript: "toLowerCase",
    },
    [PCode.ldin, 1, PCode.case],
    [new Parameter("string", "string")],
    "string",
    7,
    1,
    "Returns the input <code>string</code> as all lowercase."
  ),
  new Command(
    "upper",
    {
      BASIC: "UCASE$",
      C: "strupr",
      Java: "toUpperCase",
      Pascal: "uppercase",
      Python: ".upper",
      TypeScript: "toUpperCase",
    },
    [PCode.ldin, 2, PCode.case],
    [new Parameter("string", "string")],
    "string",
    7,
    1,
    "Returns the input <code>string</code> as all uppercase."
  ),
  new Command(
    "capitalize",
    {
      BASIC: "CCASE$",
      C: "strcap",
      Java: "capitalize",
      Pascal: "initcap",
      Python: ".capitalize",
      TypeScript: "capitalize",
    },
    [PCode.ldin, 3, PCode.case],
    [new Parameter("string", "string")],
    "string",
    7,
    1,
    "Returns the input <code>string</code> with the first letter capitalized."
  ),
  new Command(
    "title",
    {
      BASIC: "TCASE$",
      C: "strtitle",
      Java: "toTitleCase",
      Pascal: "titlecase",
      Python: ".title",
      TypeScript: "toTitleCase",
    },
    [PCode.ldin, 4, PCode.case],
    [new Parameter("string", "string")],
    "string",
    7,
    1,
    "Returns the input <code>string</code> in title case (i.e. the first letter of each word capitalized)."
  ),
  new Command(
    "swapcase",
    {
      BASIC: "SCASE$",
      C: "strswap",
      Java: "swapCase",
      Pascal: "swapcase",
      Python: ".swapcase",
      TypeScript: "swapCase",
    },
    [PCode.ldin, 5, PCode.case],
    [new Parameter("string", "string")],
    "string",
    7,
    1,
    "Returns the input <code>string</code> with all the cases swapped."
  ),
  new Command(
    "length",
    { BASIC: "LEN", C: "strlen", Python: "len" },
    [PCode.slen],
    [new Parameter("string", "string")],
    "integer",
    7,
    1,
    "Returns the length of the input <code>string</code> (i.e. the number of characters)."
  ),
  new Command(
    "delete1",
    { BASIC: "DEL$", C: null, Java: null, Pascal: "delete", Python: null, TypeScript: null },
    [PCode.dels],
    [
      new Parameter("string", "string"),
      new Parameter("index", "integer"),
      new Parameter("length", "integer"),
    ],
    "string",
    7,
    2,
    "Returns the input <code>string</code> with some characters removed, starting at the given <code>index</code> and of the specified <code>length</code>."
  ),
  new Command(
    "delete2",
    {
      BASIC: null,
      C: "strdel",
      Java: "delete",
      Pascal: null,
      Python: ".delete",
      TypeScript: "delete",
    },
    [PCode.swap, PCode.incr, PCode.swap, PCode.dels],
    [
      new Parameter("string", "string"),
      new Parameter("index", "integer"),
      new Parameter("length", "integer"),
    ],
    "string",
    7,
    2,
    "Returns the input <code>string</code> with some characters removed, starting at the given <code>index</code> and of the specified <code>length</code>."
  ),
  new Command(
    "left$",
    { C: null, Java: null, Pascal: null, Python: null, TypeScript: null },
    [PCode.ldin, 1, PCode.swap, PCode.copy],
    [new Parameter("string", "string"), new Parameter("length", "integer")],
    "string",
    7,
    2,
    "Returns a copy of the characters in the input <code>string</code>, starting on the left and of the specified <code>length</code>."
  ),
  new Command(
    "copy1",
    { BASIC: "MID$", C: null, Java: null, Pascal: "copy", Python: null, TypeScript: null },
    [PCode.copy],
    [
      new Parameter("string", "string"),
      new Parameter("index", "integer"),
      new Parameter("length", "integer"),
    ],
    "string",
    7,
    2,
    "Returns a copy of the characters in the input <code>string</code>, starting at the given <code>index</code> and of the specified <code>length</code>."
  ),
  new Command(
    "copy2",
    { BASIC: null, C: "strcpy", Java: "copy", Pascal: null, Python: null, TypeScript: "slice" },
    [PCode.swap, PCode.incr, PCode.swap, PCode.copy],
    [
      new Parameter("string", "string"),
      new Parameter("index", "integer"),
      new Parameter("length", "integer"),
    ],
    "string",
    7,
    2,
    "Returns a copy of the characters in the input <code>string</code>, starting at the given <code>index</code> and of the specified <code>length</code>."
  ),
  new Command(
    "right$",
    { C: null, Java: null, Pascal: null, Python: null, TypeScript: null },
    [
      PCode.swap,
      PCode.dupl,
      PCode.slen,
      PCode.incr,
      PCode.rota,
      PCode.subt,
      PCode.mxin,
      PCode.copy,
    ],
    [new Parameter("string", "string"), new Parameter("length", "integer")],
    "string",
    7,
    2,
    "Returns a copy of the characters in the input <code>string</code>, starting on the right and of the specified <code>length</code>."
  ),
  new Command(
    "insert$",
    { C: null, Java: null, Pascal: null, Python: null, TypeScript: null },
    [PCode.rota, PCode.rota, PCode.inss],
    [
      new Parameter("string", "string"),
      new Parameter("index", "integer"),
      new Parameter("substr", "string"),
    ],
    "string",
    7,
    2,
    "Returns the input <code>string</code> with the specified <code>substring</code> inserted at the given <code>index</code>."
  ),
  new Command(
    "insert",
    { BASIC: null, C: "strins", Pascal: null },
    [PCode.rota, PCode.rota, PCode.swap, PCode.rota, PCode.incr, PCode.inss],
    [
      new Parameter("string", "string"),
      new Parameter("substr", "string"),
      new Parameter("index", "integer"),
    ],
    "string",
    7,
    2,
    "Returns the input <code>string</code> with the specified <code>substring</code> inserted at the given <code>index</code>."
  ),
  new Command(
    "insert2",
    { BASIC: null, C: null, Java: null, Pascal: "insert", Python: null, TypeScript: null },
    [PCode.inss],
    [
      new Parameter("substr", "string"),
      new Parameter("string", "string"),
      new Parameter("index", "integer"),
    ],
    "string",
    7,
    2,
    "Returns the input <code>string</code> with the specified <code>substring</code> inserted at the given <code>index</code>."
  ),
  new Command(
    "pad",
    { BASIC: "PAD$", C: "strpad", TypeScript: null },
    [PCode.spad],
    [
      new Parameter("string", "string"),
      new Parameter("padding", "string"),
      new Parameter("length", "integer"),
    ],
    "string",
    7,
    2,
    "Returns the input <code>string</code> with the input <code>padding</code> added either before or after to make a string of minimum given <code>length</cope>. The <code>padding</code> is placed before if <code>length</code> is positive, after if it is negative."
  ),
  new Command(
    "padStart",
    { BASIC: null, C: null, Java: null, Pascal: null, Python: null },
    [PCode.spad],
    [
      new Parameter("string", "string"),
      new Parameter("padding", "string"),
      new Parameter("length", "integer"),
    ],
    "string",
    7,
    2,
    "Returns the input <code>string</code> with the input <code>padding</code> added before to make a string of minimum given <code>length</cope>."
  ),
  new Command(
    "padEnd",
    { BASIC: null, C: null, Java: null, Pascal: null, Python: null },
    [PCode.neg, PCode.spad],
    [
      new Parameter("string", "string"),
      new Parameter("padding", "string"),
      new Parameter("length", "integer"),
    ],
    "string",
    7,
    2,
    "Returns the input <code>string</code> with the input <code>padding</code> added after to make a string of minimum given <code>length</cope>."
  ),
  new Command(
    "replace",
    {
      BASIC: "REPLACE$",
      C: "strrepl",
      Java: "replace",
      Python: ".replace",
      TypeScript: "replace",
    },
    [PCode.repl],
    [
      new Parameter("string", "string"),
      new Parameter("substr", "string"),
      new Parameter("replace", "string"),
      new Parameter("n", "integer"),
    ],
    "string",
    7,
    2,
    "Returns the input <code>string</code> with up to <code>n</code> occurences of <code>substring</code> replaced by <code>replace</code>. Set <code>n</code> equal to <code>0</code> to replace every occurence."
  ),
  new Command(
    "instr",
    { C: null, Java: null, Pascal: null, Python: null, TypeScript: null },
    [PCode.swap, PCode.poss],
    [new Parameter("string", "string"), new Parameter("substr", "string")],
    "integer",
    7,
    2,
    "Searches for the input <code>substring</code> within the given <code>string</code>; returns the index of the first character if found, 0 otherwise."
  ),
  new Command(
    "index",
    {
      BASIC: null,
      C: "strpos",
      Java: "indexOf",
      Pascal: null,
      Python: ".index",
      TypeScript: "indexOf",
    },
    [PCode.swap, PCode.poss, PCode.decr],
    [new Parameter("string", "string"), new Parameter("substr", "string")],
    "integer",
    7,
    2,
    "Searches for the input <code>substring</code> within the given <code>string</code>; returns the index of the first character if found, 0 otherwise."
  ),
  new Command(
    "pos",
    { BASIC: null, C: null, Java: null, Python: null, TypeScript: null },
    [PCode.poss],
    [new Parameter("substr", "string"), new Parameter("string", "string")],
    "integer",
    7,
    2,
    "Searches for the input <code>substring</code> within the given <code>string</code>; returns the index of the first character if found, 0 otherwise."
  ),
  new Command(
    "strip",
    { Java: "trim", Python: ".strip", TypeScript: "trim" },
    [PCode.trim],
    [new Parameter("string", "string")],
    "string",
    7,
    2,
    "Returns the input <code>string</code> with leading and trailing whitespace removed."
  ),
  new Command(
    "append",
    { BASIC: null, C: null, Java: null, Pascal: null, Python: ".append", TypeScript: null },
    [PCode.lapp],
    [],
    "string",
    7,
    1,
    "Appends the object to the specified list."
  ),
  new Command(
    "copy",
    { BASIC: null, C: null, Java: null, Pascal: null, Python: ".copy", TypeScript: null },
    [PCode.lcpy],
    [],
    "string",
    7,
    1,
    "Returns a copy of the specified list."
  ),
  new Command(
    "extend",
    { BASIC: null, C: null, Java: null, Pascal: null, Python: ".extend", TypeScript: null },
    [PCode.lext],
    [],
    "string",
    7,
    1,
    "Extends the contents of the specified list by concatenation."
  ),
  new Command(
    "insert",
    { BASIC: null, C: null, Java: null, Pascal: null, Python: ".insert", TypeScript: null },
    [PCode.lins],
    [],
    "string",
    7,
    1,
    "Inserts the object at the specified index."
  ),
  new Command(
    "remove",
    { BASIC: null, C: null, Java: null, Pascal: null, Python: ".remove", TypeScript: null },
    [PCode.lrem],
    [],
    "string",
    7,
    1,
    "Removes the first item from the specified list whose value is equal to the specified value."
  ),
  new Command(
    "reverse",
    { BASIC: null, C: null, Java: null, Pascal: null, Python: ".reverse", TypeScript: null },
    [PCode.lrev],
    [],
    "string",
    7,
    1,
    "Reverses the order of the specified list."
  ),
  // 8. Type conversion routines
  new Command(
    "str",
    { BASIC: "STR$", C: "itoa", Java: "toString", TypeScript: "toString" },
    [PCode.itos],
    [new Parameter("n", "integer")],
    "string",
    8,
    0,
    "Returns the integer <code>n</code> as a string, e.g. <code>str(12)='12'</code>."
  ),
  new Command(
    "parseInt",
    { BASIC: "VAL", C: "atoi", Pascal: "val", Python: "int" },
    [PCode.sval], // pcoder needs to prefix with PCode.ldin XXX to configure for different languages
    [new Parameter("string", "string")],
    "integer",
    8,
    0,
    "Returns the input <code>string</code> as an integer, e.g. <code>val('12')=12</code>. Returns <code>0</code> if the string cannot be converted (i.e. if it is not an integer string)."
  ),
  new Command(
    "parseIntDef",
    { BASIC: "VALDEF", C: "atoidef", Pascal: "valdef", Python: "intdef" },
    [PCode.svdf], // pcoder needs to prefix with PCode.ldin XXX to configure for different languages
    [new Parameter("string", "string"), new Parameter("default", "integer")],
    "integer",
    8,
    0,
    "Returns the input <code>string</code> as an integer, e.g. <code>val('12')=12</code>. Returns the specified <code>default</code> value if the string cannot be converted (i.e. if it is not an integer string)."
  ),
  new Command(
    "qstr",
    { BASIC: "QSTR$", C: "qitoa", Java: "toStringQ", TypeScript: "toStringQ" },
    [PCode.qtos],
    [
      new Parameter("a", "integer"),
      new Parameter("b", "integer"),
      new Parameter("decplaces", "integer"),
    ],
    "string",
    8,
    1,
    "Returns the value of <code>a/b</code> to the specified number of decimal places, as a decimal string, e.g. <code>qstr(2,3,4)='0.6667'</code>."
  ),
  new Command(
    "qint",
    { BASIC: "QVAL", C: "qatoi", Java: "parseIntQ", Pascal: "qval", TypeScript: "parseIntQ" },
    [PCode.qval],
    [
      new Parameter("string", "string"),
      new Parameter("mult", "integer"),
      new Parameter("default", "integer"),
    ],
    "integer",
    8,
    1,
    "Returns the input decimal <code>string</code> as an integer, multiplied by <code>mult</code> and rounded to the nearest integer, e.g. <code>qval('1.5',10)=15</code>. Returns the specified <code>default</code> value if the string cannot be converted (i.e. if it is not a decimal string)."
  ),
  new Command(
    "chr1",
    { BASIC: "CHR$", C: null, Java: null, Pascal: null, Python: "chr", TypeScript: "fromCharCode" },
    [PCode.ctos],
    [new Parameter("n", "integer")],
    "string",
    8,
    2,
    "Returns the character with ASCII character code <code>n</code>."
  ),
  new Command(
    "chr2",
    { BASIC: null, C: null, Java: "fromCharCode", Pascal: "chr", Python: null, TypeScript: null },
    [],
    [new Parameter("n", "integer")],
    "character",
    8,
    2,
    "Returns the character with ASCII character code <code>n</code>."
  ),
  new Command(
    "ord1",
    {
      BASIC: "ASC",
      C: null,
      Java: "charCode",
      Pascal: null,
      Python: "ord",
      TypeScript: "charCode",
    },
    [PCode.sasc],
    [new Parameter("char", "string")],
    "integer",
    8,
    2,
    "Returns the ASCII code of the input character, or of the first character of the input string."
  ),
  new Command(
    "ord2",
    { BASIC: null, C: null, Java: null, Pascal: "ord", Python: null, TypeScript: null },
    [],
    [new Parameter("char", "character")],
    "integer",
    8,
    2,
    "Returns the ASCII code of the input character."
  ),
  new Command(
    "boolint",
    { C: null, Java: null, Python: null, TypeScript: null },
    [],
    [new Parameter("boolean", "boolean")],
    "integer",
    8,
    2,
    "Returns the input <code>boolean</code> as an integer (-1 for <code>true</code>, 0 for <code>false</code>)."
  ),
  new Command(
    "hex",
    {
      BASIC: "HEX$",
      C: "itoahex",
      Java: "toStringHex",
      Pascal: "hexstr",
      TypeScript: "toStringHex",
    },
    [PCode.hexs],
    [new Parameter("n", "integer"), new Parameter("minlength", "integer")],
    "string",
    8,
    2,
    "Returns a string representation of integer <code>n</code> in hexadecimal format, padded with leading zeros as up to <code>minlength</code>, e.g. <code>hexstr(255,6)='0000FF'</code>."
  ),
  // 9. Input and timing routines
  new Command(
    "pause",
    {},
    [PCode.wait],
    [new Parameter("m", "integer")],
    null,
    9,
    0,
    "Makes the Turtle Machine wait <code>m</code> milliseconds before performing the next operation. This is useful for controlling the speed of animations."
  ),
  new Command("halt", { C: "exit" }, [PCode.halt], [], null, 9, 0, "Halts the program."),
  new Command(
    "readLine",
    { BASIC: "GETLINE$", C: "gets", Pascal: "readln" },
    [PCode.rdln],
    [],
    "string",
    9,
    0,
    "Waits for the RETURN key to be pressed, then returns everything in the keybuffer up to (and not including) the new line character."
  ),
  new Command(
    "input",
    { BASIC: "INPUT$", C: "scan", Pascal: null },
    [PCode.writ, PCode.newl, PCode.rdln],
    [new Parameter("prompt", "string")],
    "string",
    9,
    0,
    "Gives an input prompt, then returns the input when the RETURN key is pressed (using the keybuffer)."
  ),
  new Command(
    "cursor",
    {},
    [PCode.curs],
    [new Parameter("cursorcode", "integer")],
    null,
    9,
    1,
    "Sets which cursor to display (1-15) when the mouse pointer is over the canvas. 0 hides the cursor; any value outside the range 0-15 resets the default cursor. For a list of available cursors, see the <b>Cursors</b> tab."
  ),
  new Command(
    "keyEcho",
    {},
    [PCode.kech],
    [new Parameter("on", "boolean")],
    null,
    9,
    1,
    "Turns the keyboard echo to the console on (<code>true</code>) or off (<code>false</code>)."
  ),
  new Command(
    "detect",
    {},
    [PCode.tdet],
    [new Parameter("inputcode", "integer"), new Parameter("m", "integer")],
    "integer",
    9,
    1,
    "Waits a maximum of <code>m</code> milliseconds for the key with the specified <code>inputcode</code> to be pressed; returns its current input value if pressed (and stops waiting), and <code>0</code> otherwise."
  ),
  new Command(
    "read",
    { BASIC: "GET$", C: "get" },
    [PCode.read],
    [new Parameter("n", "integer")],
    "string",
    9,
    1,
    "Returns the first <code>n</code> characters from the keybuffer as a string."
  ),
  new Command(
    "time",
    {},
    [PCode.time],
    [],
    "integer",
    9,
    1,
    "Returns the time (in milliseconds) since the program began."
  ),
  new Command(
    "timeSet",
    {},
    [PCode.tset],
    [new Parameter("m", "integer")],
    null,
    9,
    1,
    "Artificially sets the time since the program began to <code>m</code> milliseconds."
  ),
  new Command(
    "reset",
    {},
    [PCode.iclr],
    [new Parameter("\\inputcode", "integer")],
    null,
    9,
    2,
    "Resets the specified <code>\\inputcode</code> (<code>\\mousex</code>, <code>\\mousey</code>, <code>\\backspace</code>, <code>\\enter</code>, etc.) to its initial value (i.e. -1)."
  ),
  new Command(
    "status",
    {},
    [PCode.stat],
    [new Parameter("\\inputcode", "integer")],
    "integer",
    9,
    2,
    "Returns the <code>?kshift</code> value for the most recent press/click of the input with the specified <code>\\inputcode</code>."
  ),
  new Command(
    "keyBuffer",
    {},
    [PCode.bufr, PCode.ldin, 1, PCode.sptr, PCode.hfix],
    [new Parameter("n", "integer")],
    null,
    9,
    2,
    "Creates a new custom keybuffer of length <code>n</code>. A keybuffer of length 32 is available by default; use this command if you need a larger buffer."
  ),
  // 10. file processing
  new Command(
    "chdir",
    {},
    [PCode.chdr],
    [new Parameter("directory name", "string")],
    null,
    10,
    1,
    "Changes the current directory."
  ),
  new Command(
    "rmdir",
    {},
    [PCode.ldin, 1, PCode.diry, PCode.ldin, 128, PCode.less],
    [new Parameter("subdirectory name", "string")],
    "boolean",
    10,
    1,
    "Removes a subdirectory."
  ),
  new Command(
    "mkdir",
    {},
    [PCode.ldin, 2, PCode.diry, PCode.ldin, 127, PCode.more],
    [new Parameter("subdirectory name", "string")],
    "boolean",
    10,
    1,
    "Creates a subdirectory."
  ),
  new Command(
    "openFile",
    { BASIC: null, Python: "fopen" },
    [PCode.open],
    [new Parameter("filename", "string"), new Parameter("mode", "integer")],
    "integer",
    10,
    1,
    "Opens a file (1: read, 2: append, 3: write)."
  ),
  new Command(
    "openIn",
    { C: null, Java: null, Pascal: null, Python: null, TypeScript: null },
    [PCode.ldin, 1, PCode.open],
    [new Parameter("filename", "string")],
    "integer",
    10,
    1,
    "Open a file for reading."
  ),
  new Command(
    "openUp",
    { C: null, Java: null, Pascal: null, Python: null, TypeScript: null },
    [PCode.ldin, 2, PCode.open],
    [new Parameter("filename", "string")],
    "integer",
    10,
    1,
    "Opens a file for appending."
  ),
  new Command(
    "openOut",
    { C: null, Java: null, Pascal: null, Python: null, TypeScript: null },
    [PCode.ldin, 4, PCode.open],
    [new Parameter("filename", "string")],
    "integer",
    10,
    1,
    "Opens a file for writing."
  ),
  new Command(
    "closeFile",
    { BASIC: "CLOSE#", Python: "fclose" },
    [PCode.clos],
    [new Parameter("file handle", "integer")],
    null,
    10,
    1,
    "Closes a file."
  ),
  new Command(
    "deleteFile",
    { Python: "fremove" },
    [PCode.ldin, 1, PCode.file, PCode.ldin, 128, PCode.less],
    [new Parameter("filename", "string")],
    "boolean",
    10,
    1,
    "Deletes a file."
  ),
  new Command(
    "fread",
    { BASIC: "FREAD#" },
    [PCode.frds],
    [new Parameter("file handle", "integer"), new Parameter("n", "integer")],
    "string",
    10,
    1,
    "Reads n characters (maximum) from a file."
  ),
  new Command(
    "freadln",
    { BASIC: "FREADLN#", Python: "freadline" },
    [PCode.frln],
    [new Parameter("file handle", "integer")],
    "string",
    10,
    1,
    "Reads a line from a file."
  ),
  new Command(
    "fwrite",
    { BASIC: "FWRITE#" },
    [PCode.fwrs],
    [new Parameter("file handle", "integer"), new Parameter("string", "string")],
    null,
    10,
    1,
    "Writes a string to a file."
  ),
  new Command(
    "fwriteln",
    { BASIC: "FWRITELN#" },
    [PCode.fwln],
    [new Parameter("file handle", "integer"), new Parameter("string", "string")],
    null,
    10,
    1,
    "Writes a line to a file."
  ),
  new Command(
    "eof",
    { BASIC: "EOF#" },
    [PCode.eof],
    [new Parameter("file handle", "integer")],
    "boolean",
    10,
    1,
    "Tests for the end of file."
  ),
  new Command(
    "checkdir",
    {},
    [PCode.ldin, 0, PCode.diry, PCode.ldin, 127, PCode.more],
    [new Parameter("directory name", "string"), new Parameter("code", "integer")],
    "integer",
    10,
    2,
    "Creates/deletes/checks a directory."
  ),
  new Command(
    "checkfile",
    {},
    [PCode.ldin, 0, PCode.file, PCode.ldin, 127, PCode.more],
    [new Parameter("filename", "string"), new Parameter("code", "integer")],
    "integer",
    10,
    2,
    "Creates/deletes/checks a file."
  ),
  new Command(
    "copyFile",
    { Python: "fcopy" },
    [PCode.ldin, 3, PCode.fmov],
    [new Parameter("old name", "string"), new Parameter("new name", "string")],
    "boolean",
    10,
    2,
    "Copies a file."
  ),
  new Command(
    "dirExists",
    { Python: "isdir" },
    [PCode.ldin, 0, PCode.diry, PCode.ldin, 127, PCode.more],
    [new Parameter("subdirectory name", "string")],
    "boolean",
    10,
    2,
    "Checks whether a subdirectory exists."
  ),
  new Command(
    "fileExists",
    { Python: "isfile" },
    [PCode.ldin, 0, PCode.file, PCode.ldin, 127, PCode.more],
    [new Parameter("filename", "string")],
    "boolean",
    10,
    2,
    "Checks whether a file exists."
  ),
  new Command(
    "findDir",
    {},
    [PCode.dupl, PCode.lptr, PCode.rota, PCode.fdir, PCode.swap, PCode.rota, PCode.sptr],
    [new Parameter("directory name pattern", "string"), new Parameter("file handle", "integer")],
    "string",
    10,
    2,
    "Finds the first directory matching the pattern."
  ),
  new Command(
    "findFirst",
    {},
    [PCode.dupl, PCode.lptr, PCode.rota, PCode.ffnd, PCode.swap, PCode.rota, PCode.sptr],
    [new Parameter("filename pattern", "string"), new Parameter("file handle", "integer")],
    "string",
    10,
    2,
    "Finds the first file matching the pattern."
  ),
  new Command(
    "findNext",
    {},
    [PCode.fnxt],
    [new Parameter("file handle", "integer")],
    "string",
    10,
    2,
    "Finds the next file/directory matching a pattern."
  ),
  new Command(
    "renameFile",
    { Python: "frename" },
    [PCode.ldin, 1, PCode.fmov],
    [new Parameter("old filename", "string"), new Parameter("new filename", "string")],
    "boolean",
    10,
    2,
    "Rename file"
  ),
  new Command(
    "moveFile",
    { Python: "fmove" },
    [PCode.ldin, 2, PCode.fmov],
    [new Parameter("old filename", "string"), new Parameter("new filename", "string")],
    "boolean",
    10,
    2,
    "Moves a file."
  ),
  new Command(
    "restartFile",
    { Python: "frestart" },
    [PCode.fbeg],
    [new Parameter("file handle", "integer")],
    null,
    10,
    2,
    "Restarts reading a file."
  ),
  new Command(
    "eoln",
    { BASIC: "EOLN#" },
    [PCode.eoln],
    [new Parameter("file handle", "integer")],
    "boolean",
    10,
    2,
    "Tests for end of line in a file."
  ),
  // 11. Turtle Machine monitoring
  new Command(
    "dump",
    {},
    [PCode.dump],
    [],
    null,
    11,
    2,
    "&ldquo;Dumps&rdquo; the current memory state into the display in the memory tab."
  ),
  new Command(
    "heapReset",
    {},
    [PCode.hrst],
    [],
    null,
    11,
    2,
    "Resets the memory heap to the initial global value."
  ),
  new Command(
    "address",
    {},
    [],
    [new Parameter("variable", "integer", true)],
    "integer",
    11,
    2,
    "Returns the address in memory of the given <code>variable</code>."
  ),
  new Command(
    "peek",
    {},
    [PCode.lptr],
    [new Parameter("address", "integer")],
    "integer",
    11,
    2,
    "Peek at the value of the memory at the given <code>address</code>."
  ),
  new Command(
    "poke",
    {},
    [PCode.poke],
    [new Parameter("address", "integer"), new Parameter("value", "integer")],
    null,
    11,
    2,
    "Poke the <code>value</code> into the memory at the given <code>address</code>."
  ),
  new Command(
    "trace",
    {},
    [PCode.trac],
    [new Parameter("on", "boolean")],
    null,
    11,
    2,
    "Turns the PCode trace facility on (<code>true</code>) or off (<code>false</code>)."
  ),
  new Command(
    "watch",
    {},
    [PCode.memw],
    [new Parameter("address", "integer")],
    null,
    11,
    2,
    "Sets an <code>address</code> in memory for the trace facility to watch."
  ),
  new Command(
    "pcodeHalt",
    {},
    [PCode.pcoh],
    [new Parameter("pcodeLine", "integer")],
    null,
    11,
    2,
    "Halts program execution after the given <code>pcodeLine</code>."
  ),
];
