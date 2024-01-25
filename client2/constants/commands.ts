import type { Language } from "./languages.ts";
import PCode from "./pcodes.ts";
import type { Type } from "../lexer/types.ts";

export type Command = ReturnType<typeof command>;

export type Parameter = ReturnType<typeof parameter>;

const command = (
  names: Record<Language, string | null>,
  pcode: number[],
  parameters: Parameter[],
  returns: Type | null,
  category: number,
  level: number,
  description: string
) => ({
  __: "Command",
  names,
  parameters,
  returns,
  pcode,
  category,
  level,
  description,
}) as const;

const parameter = (
  type: Type,
  name: string,
  isReferenceParameter = false,
  length = 1
) => ({
  __: "Parameter",
  name,
  type,
  isReferenceParameter,
  length,
}) as const;

export default [
  // 0. Turtle: relative movement
  command(
    {
      BASIC: "FORWARD",
      C: "forward",
      Java: "forward",
      Pascal: "forward",
      Python: "forward",
      TypeScript: "forward",
    },
    [PCode.fwrd],
    [parameter("integer", "n")],
    null,
    0,
    0,
    "Moves the Turtle forward <code>n</code> units, drawing as it goes (unless the pen is up)."
  ),
  command(
    {
      BASIC: "BACK",
      C: "back",
      Java: "back",
      Pascal: "back",
      Python: "back",
      TypeScript: "back",
    },
    [PCode.back],
    [parameter("integer", "n")],
    null,
    0,
    0,
    "Moves the Turtle back <code>n</code> units, drawing as it goes (unless the pen is up)."
  ),
  command(
    {
      BASIC: "LEFT",
      C: "left",
      Java: "left",
      Pascal: "left",
      Python: "left",
      TypeScript: "left",
    },
    [PCode.left],
    [parameter("integer", "n")],
    null,
    0,
    0,
    "Rotates the Turtle left by <code>n</code> degrees."
  ),
  command(
    {
      BASIC: "RIGHT",
      C: "right",
      Java: "right",
      Pascal: "right",
      Python: "right",
      TypeScript: "right",
    },
    [PCode.rght],
    [parameter("integer", "n")],
    null,
    0,
    0,
    "Rotates the Turtle right by <code>n</code> degrees."
  ),
  command(
    {
      BASIC: "DRAWXY",
      C: "drawxy",
      Java: "drawXY",
      Pascal: "drawxy",
      Python: "drawxy",
      TypeScript: "drawXY",
    },
    [PCode.drxy],
    [
      parameter("integer", "x"),
      parameter("integer", "y"),
    ],
    null,
    0,
    1,
    "Moves the Turtle in a straight line to a point <code>x</code> units away along the x-axis and <code>y</code> units away along the y-axis, drawing as it goes (unless the pen is up)."
  ),
  command(
    {
      BASIC: "MOVEXY",
      C: "movexy",
      Java: "moveXY",
      Pascal: "movexy",
      Python: "movexy",
      TypeScript: "moveXY",
    },
    [PCode.mvxy],
    [
      parameter("integer", "x"),
      parameter("integer", "y"),
    ],
    null,
    0,
    1,
    "Moves the Turtle in a straight line to a point <code>x</code> units away along the x-axis and <code>y</code> units away along the y-axis, <em>without</em> drawing (regardless of the current pen status)."
  ),
  // 1. Turtle: absolute movement
  command(
    {
      BASIC: "HOME",
      C: "home",
      Java: "home",
      Pascal: "home",
      Python: "home",
      TypeScript: "home",
    },
    [PCode.home],
    [],
    null,
    1,
    0,
    "Moves the Turtle back to its starting position in the centre of the canvas, facing north, drawing as it goes (unless the pen is up)."
  ),
  command(
    {
      BASIC: "SETX",
      C: "setx",
      Java: "setX",
      Pascal: "setx",
      Python: "setx",
      TypeScript: "setX",
    },
    [PCode.setx],
    [parameter("integer", "x")],
    null,
    1,
    0,
    "Sets the Turtle&rsquo;s <code>x</code> coordinate directly (without movement or drawing on the canvas). This can also be achieved by direct assignment of the global variable <code>turtx</code>."
  ),
  command(
    {
      BASIC: "SETY",
      C: "sety",
      Java: "setY",
      Pascal: "sety",
      Python: "sety",
      TypeScript: "setY",
    },
    [PCode.sety],
    [parameter("integer", "y")],
    null,
    1,
    0,
    "Sets the Turtle&rsquo;s <code>y</code> coordinate directly (without movement or drawing on the canvas). This can also be achieved by direct assignment of the global variable <code>turty</code>."
  ),
  command(
    {
      BASIC: "SETXY",
      C: "setxy",
      Java: "setXY",
      Pascal: "setxy",
      Python: "setxy",
      TypeScript: "setXY",
    },
    [PCode.toxy],
    [
      parameter("integer", "x"),
      parameter("integer", "y"),
    ],
    null,
    1,
    0,
    "Sets the Turtle&rsquo;s <code>x</code> and <code>y</code> coordinates directly (without movement or drawing on the canvas). This can also be achieved by direct assingment of the global variables <code>turtx</code> and <code>turty</code>."
  ),
  command(
    {
      BASIC: "DIRECTION",
      C: "direction",
      Java: "direction",
      Pascal: "direction",
      Python: "direction",
      TypeScript: "direction",
    },
    [PCode.setd],
    [parameter("integer", "n")],
    null,
    1,
    0,
    "Sets the Turtle&rsquo;s direction to <code>n</code> degrees (0 for north, 90 for east, 180 for south, 270 for west). This can also be achieved by direct assignment of the global variable <code>turtd</code>. Note that the number of degrees in a circle (360 by default) can be changed with the <code>angles</code> command."
  ),
  command(
    {
      BASIC: "ANGLES",
      C: "angles",
      Java: "angles",
      Pascal: "angles",
      Python: "angles",
      TypeScript: "angles",
    },
    [PCode.angl],
    [parameter("integer", "degrees")],
    null,
    1,
    1,
    "Sets the number of <code>degrees</code> in a circle (360 by default)."
  ),
  command(
    {
      BASIC: "TURNXY",
      C: "turnxy",
      Java: "turnXY",
      Pascal: "turnxy",
      Python: "turnxy",
      TypeScript: "turnXY",
    },
    [PCode.turn],
    [
      parameter("integer", "x"),
      parameter("integer", "y"),
    ],
    null,
    1,
    1,
    "Turns the Turtle to face the point <code>x</code> units away alongthe x-axis and <code>y</code> units away along the y-axis."
  ),
  // 2. Turtle: shape drawing
  command(
    {
      BASIC: "CIRCLE",
      C: "circle",
      Java: "circle",
      Pascal: "circle",
      Python: "circle",
      TypeScript: "circle",
    },
    [PCode.circ],
    [parameter("integer", "radius")],
    null,
    2,
    0,
    "Draws a circle outline in the Turtle&rsquo;s current colour and thickness, of the given <code>radius</code>, centred on the Turtle&rsquo;s current location."
  ),
  command(
    {
      BASIC: "BLOT",
      C: "blot",
      Java: "blot",
      Pascal: "blot",
      Python: "blot",
      TypeScript: "blot",
    },
    [PCode.blot],
    [parameter("integer", "radius")],
    null,
    2,
    0,
    "Draws a filled circle in the Turtle&rsquo;s current colour, of the given <code>radius</code>, centred on the Turtle&rsquo;s current location."
  ),
  command(
    {
      BASIC: "ELLIPSE",
      C: "ellipse",
      Java: "ellipse",
      Pascal: "ellipse",
      Python: "ellipse",
      TypeScript: "ellipse",
    },
    [PCode.elps],
    [
      parameter("integer", "Xradius"),
      parameter("integer", "Yradius"),
    ],
    null,
    2,
    0,
    "Draws an ellipse outline in the Turtle&rsquo;s current colour and thickness, of the given <code>Xradius</code> and <code>Yradius</code>, centred on the Turtle&rsquo;s current location."
  ),
  command(
    {
      BASIC: "ELLBLOT",
      C: "ellblot",
      Java: "ellblot",
      Pascal: "ellblot",
      Python: "ellblot",
      TypeScript: "ellblot",
    },
    [PCode.eblt],
    [
      parameter("integer", "Xradius"),
      parameter("integer", "Yradius"),
    ],
    null,
    2,
    0,
    "Draws a filled ellipse in the Turtle&rsquo;s current colour, of the given <code>Xradius</code> and <code>Yradius</code>, centred on the Turtle&rsquo;s current location."
  ),
  command(
    {
      BASIC: "POLYLINE",
      C: "polyline",
      Java: "polyline",
      Pascal: "polyline",
      Python: "polyline",
      TypeScript: "polyline",
    },
    [PCode.poly],
    [parameter("integer", "n")],
    null,
    2,
    1,
    "Draws a polygon outline in the Turtle&rsquo;s current colour and thickness, connecting the last <code>n</code> locations that the Turtle has visited."
  ),
  command(
    {
      BASIC: "POLYGON",
      C: "polygon",
      Java: "polygon",
      Pascal: "polygon",
      Python: "polygon",
      TypeScript: "polygon",
    },
    [PCode.pfil],
    [parameter("integer", "n")],
    null,
    2,
    1,
    "Draws a filled polygon in the Turtle&rsquo;s current colour and thickness, connecting the last <code>n</code> locations that the Turtle has visited."
  ),
  command(
    {
      BASIC: "FORGET",
      C: "forget",
      Java: "forget",
      Pascal: "forget",
      Python: "forget",
      TypeScript: "forget",
    },
    [PCode.frgt],
    [parameter("integer", "n")],
    null,
    2,
    1,
    "Makes the Turtle &ldquo;forget&rdquo; the last <code>n</code> points it has visited. Used in conjunction with <code>polyline</code> and <code>polygon</code>."
  ),
  command(
    {
      BASIC: "REMEMBER",
      C: "remember",
      Java: "remember",
      Pascal: "remember",
      Python: "remember",
      TypeScript: "remember",
    },
    [PCode.rmbr],
    [],
    null,
    2,
    1,
    "Makes the Turtle &ldquo;remember&rdquo; its current location. This is only necessary if its current location was set by a direct assignment of the global variables <code>turtx</code> and <code>turty</code>; when using the standard moving commands, the Turtle automatically remembers where it has been."
  ),
  command(
    {
      BASIC: "BOX",
      C: "box",
      Java: "box",
      Pascal: "box",
      Python: "box",
      TypeScript: "box",
    },
    [PCode.box],
    [
      parameter("integer", "x"),
      parameter("integer", "y"),
      parameter("integer", "colour"),
      parameter("boolean", "border"),
    ],
    null,
    2,
    1,
    "Draws a box of width <code>x</code> and height <code>y</code>, with the top left corner in the Turtle&rsquo;s current location, filled with the specified <code>colour</code>. If <code>border</code> is <code>true</code>, a border is drawn around the box in the Turtle&rsquo;s current colour and and thickness. This is intended to be used with the <code>display</code> command, to provide a box for framing text."
  ),
  // 3. Other Turtle commands
  command(
    {
      BASIC: "COLOUR",
      C: "colour",
      Java: "colour",
      Pascal: "colour",
      Python: "colour",
      TypeScript: "colour",
    },
    [PCode.colr],
    [parameter("integer", "colour")],
    null,
    3,
    0,
    "Sets the <code>colour</code> of the Turtle&rsquo;s pen. Takes as an argument either an RGB value, or one of the Turtle System&rsquo;s fifty predefined colour constants (see the <b>Colours</b> tab). This can also be achieved by direct assignment of the global variable <code>turtc</code>."
  ),
  command(
    {
      BASIC: "RNDCOL",
      C: "randcol",
      Java: "randCol",
      Pascal: "randcol",
      Python: "randcol",
      TypeScript: "randCol",
    },
    [PCode.rand, PCode.incr, PCode.rgb, PCode.colr],
    [parameter("integer", "n")],
    null,
    3,
    0,
    "Assigns a random colour to the Turte&rsquo;s pen, between 1 and <code>n</code> (maximum 50). The colours are taken from the Turtle System&rsquo;s fifty predefined colours, which are each assigned a number between 1 and 50 (see the <b>Colours</b> tab)."
  ),
  command(
    {
      BASIC: "THICKNESS",
      C: "thickness",
      Java: "thickness",
      Pascal: "thickness",
      Python: "thickness",
      TypeScript: "thickness",
    },
    [PCode.thik],
    [parameter("integer", "thickness")],
    null,
    3,
    0,
    "Sets the <code>thickness</code> of the Turtle&rsquo;s pen (for line drawing, and outlines of circles, ellipses, boxes, and polygons). This can also be achieved by direct assignment of the global variable <code>turtt</code>."
  ),
  command(
    {
      BASIC: "PENUP",
      C: "penup",
      Java: "penUp",
      Pascal: "penup",
      Python: "penup",
      TypeScript: "penUp",
    },
    [PCode.ldin, 0, PCode.pen],
    [],
    null,
    3,
    0,
    "Lifts the Turtle&rsquo;s pen, so that subsequent movement will not draw a line on the Canvas."
  ),
  command(
    {
      BASIC: "PENDOWN",
      C: "pendown",
      Java: "penDown",
      Pascal: "pendown",
      Python: "pendown",
      TypeScript: "penDown",
    },
    [PCode.ldin, -1, PCode.pen],
    [],
    null,
    3,
    0,
    "Lowers the Turtle&rsquo;s pen, so that subsequent movement will draw a line on the Canvas."
  ),
  command(
    {
      BASIC: "OUTPUT",
      C: "output",
      Java: "output",
      Pascal: "output",
      Python: "output",
      TypeScript: "output",
    },
    [PCode.outp],
    [
      parameter("boolean", "clear"),
      parameter("integer", "colour"),
      parameter("boolean", "tofront"),
    ],
    null,
    3,
    1,
    "Modifies the textual output. If the first argument is <code>true</code>, it clears any existing text. The second argument specifies the background colour, and the third argument is for switching the display. If the third argument is <code>true</code>, it switches to the <b>Output</b> tab, while if it is <code>false</code>, it switches to the <b>Canvas and Console</b> tab."
  ),
  command(
    {
      BASIC: "CONSOLE",
      C: "console",
      Java: "console",
      Pascal: "console",
      Python: "console",
      TypeScript: "console",
    },
    [PCode.cons],
    [
      parameter("boolean", "clear"),
      parameter("integer", "colour"),
    ],
    null,
    3,
    1,
    "Modifies the Console; if the first argument is <code>true</code>, it clears any existing text, while the second argument specifies the background colour."
  ),
  command(
    {
      BASIC: "RGB",
      C: "rgb",
      Java: "rgb",
      Pascal: "rgb",
      Python: "rgb",
      TypeScript: "rgb",
    },
    [PCode.rgb],
    [parameter("integer", "colour")],
    "integer",
    3,
    2,
    "Returns the RGB value of the input <code>colour</code> (an integer between 1 and 50). For example, <code>rgb(red)=255</code>."
  ),
  command(
    {
      BASIC: "MIXCOLS",
      C: "mixcols",
      Java: "mixCols",
      Pascal: "mixcols",
      Python: "mixcols",
      TypeScript: "mixCols",
    },
    [PCode.mixc],
    [
      parameter("integer", "colour1"),
      parameter("integer", "colour1"),
      parameter("integer", "proportion1"),
      parameter("integer", "proportion2"),
    ],
    "integer",
    3,
    2,
    "Mixes the given colours in the given proportions."
  ),
  command(
    {
      BASIC: "NEWTURTLE",
      C: "newturtle",
      Java: "newTurtle",
      Pascal: "newturtle",
      Python: "newturtle",
      TypeScript: "newTurtle",
    },
    [PCode.ldin, 0, PCode.sptr],
    [parameter("integer", "array", false, 5)],
    null,
    3,
    2,
    "Points the Turtle to a custom array in memory (this must be an array of five integers, corresponding to the Turtle&rsquo;s five properties, <code>turtx</code>, <code>turty</code>, <code>turtd</code>, <code>turtt</code>, and <code>turtc</code>). Use repeatedly to simulate multiple Turtles."
  ),
  command(
    {
      BASIC: "OLDTURTLE",
      C: "oldturtle",
      Java: "oldTurtle",
      Pascal: "oldturtle",
      Python: "oldturtle",
      TypeScript: "oldTurtle",
    },
    [PCode.oldt],
    [],
    null,
    3,
    2,
    "Points the Turtle back to the default (built-in) array in memory. Use in conjunction with <code>newturtle</code>."
  ),
  // 4. Canvas operations
  command(
    {
      BASIC: "UPDATE",
      C: "update",
      Java: "update",
      Pascal: "update",
      Python: "update",
      TypeScript: "update",
    },
    [PCode.ldin, -1, PCode.udat],
    [],
    null,
    4,
    0,
    "Makes the Machine update the Canvas, and continue updating with all subsequent drawing commands. Used in conjunction with <em>noupdate</em>."
  ),
  command(
    {
      BASIC: "NOUPDATE",
      C: "noupdate",
      Java: "noUpdate",
      Pascal: "noupdate",
      Python: "noupdate",
      TypeScript: "noUpdate",
    },
    [PCode.ldin, 0, PCode.udat],
    [],
    null,
    4,
    0,
    "Makes the Machine refrain from updating the Canvas when executing all subsequent drawing commands, until <em>update</em> is called. Use this to create smooth animations, by queueing up several drawing commands to execute simultaneously."
  ),
  command(
    {
      BASIC: "BLANK",
      C: "blank",
      Java: "blank",
      Pascal: "blank",
      Python: "blank",
      TypeScript: "blank",
    },
    [PCode.blnk],
    [parameter("integer", "colour")],
    null,
    4,
    0,
    "Blanks the entire Canvas with the specified <code>colour</code>."
  ),
  command(
    {
      BASIC: "CANVAS",
      C: "canvas",
      Java: "canvas",
      Pascal: "canvas",
      Python: "canvas",
      TypeScript: "canvas",
    },
    [PCode.canv],
    [
      parameter("integer", "x1"),
      parameter("integer", "y1"),
      parameter("integer", "x2"),
      parameter("integer", "y2"),
    ],
    null,
    4,
    1,
    "Sets the top left Canvas coordinate to <code>(x1,y1)</code>, and the Canvas width and height to <code>x2</code> and <code>y2</code> respectively. Note that the width and height fix the number of virtual points on the Canvas, not the number of actual pixels."
  ),
  command(
    {
      BASIC: "RESOLUTION",
      C: "resolution",
      Java: "resolution",
      Pascal: "resolution",
      Python: "resolution",
      TypeScript: "resolution",
    },
    [PCode.reso],
    [
      parameter("integer", "x"),
      parameter("integer", "y"),
    ],
    null,
    4,
    1,
    "Sets the Canvas resolution, i.e. the number of actual pixels in the <code>x</code> and <code>y</code> dimensions. To be used in conjunction with the <code>canvas</code> command, typically to set the number of actual pixels equal to the number of virtual points on the Canvas."
  ),
  command(
    {
      BASIC: "PIXSET",
      C: "pixset",
      Java: "pixSet",
      Pascal: "pixset",
      Python: "pixset",
      TypeScript: "pixSet",
    },
    [PCode.pixs],
    [
      parameter("integer", "x"),
      parameter("integer", "y"),
      parameter("integer", "colour"),
    ],
    null,
    4,
    2,
    "Sets the <code>colour</code> at point <code>(x,y)</code>."
  ),
  command(
    {
      BASIC: "PIXCOL",
      C: "pixcol",
      Java: "pixCol",
      Pascal: "pixcol",
      Python: "pixcol",
      TypeScript: "pixCol",
    },
    [PCode.pixc],
    [
      parameter("integer", "x"),
      parameter("integer", "y"),
    ],
    "integer",
    4,
    2,
    "Returns the RGB value of the colour at point <code>(x,y)</code>."
  ),
  command(
    {
      BASIC: "RECOLOUR",
      C: "recolour",
      Java: "recolour",
      Pascal: "recolour",
      Python: "recolour",
      TypeScript: "recolour",
    },
    [PCode.rcol],
    [
      parameter("integer", "x"),
      parameter("integer", "y"),
      parameter("integer", "colour"),
    ],
    null,
    4,
    2,
    "Floods the Canvas with the specified <code>colour</code>, starting at point <code>(x,y)</code>, until reaching any different colour."
  ),
  command(
    {
      BASIC: "FILL",
      C: "fill",
      Java: "fill",
      Pascal: "fill",
      Python: "fill",
      TypeScript: "fill",
    },
    [PCode.fill],
    [
      parameter("integer", "x"),
      parameter("integer", "y"),
      parameter("integer", "colour"),
      parameter("integer", "boundary"),
    ],
    null,
    4,
    2,
    "Floods the Canvas with the specified <code>colour</code>, starting at point <code>(x,y)</code>, until reaching the <code>boundary</code> colour."
  ),
  // 5. General arithmetic functions
  command(
    {
      BASIC: "INC",
      C: null,
      Java: null,
      Pascal: "inc",
      Python: null,
      TypeScript: null,
    },
    [PCode.dupl, PCode.lptr, PCode.incr, PCode.swap, PCode.sptr],
    [parameter("integer", "variable", true)],
    null,
    5,
    0,
    "Increments the specified <code>variable</code> by 1."
  ),
  command(
    {
      BASIC: "DEC",
      C: null,
      Java: null,
      Pascal: "dec",
      Python: null,
      TypeScript: null,
    },
    [PCode.dupl, PCode.lptr, PCode.decr, PCode.swap, PCode.sptr],
    [parameter("integer", "variable", true)],
    null,
    5,
    0,
    "Decrements the specified <code>variable</code> by 1."
  ),
  command(
    {
      BASIC: "ABS",
      C: "abs",
      Java: "abs",
      Pascal: "abs",
      Python: "abs",
      TypeScript: "abs",
    },
    [PCode.abs],
    [parameter("integer", "n")],
    "integer",
    5,
    0,
    "Returns the absolute value of <code>n</code>, i.e. <code>n</code> if positive, <code>-n</code> if negative."
  ),
  command(
    {
      BASIC: "SGN",
      C: "sign",
      Java: "sign",
      Pascal: "sign",
      Python: "sign",
      TypeScript: "sign",
    },
    [PCode.sign],
    [parameter("integer", "a")],
    "integer",
    5,
    1,
    "Returns <code>+1</code> if <code>a</code> is positive, <code>-1</code> if <code>a</code> is negative, and <code>0</code> otherwise."
  ),
  command(
    {
      BASIC: "MAX",
      C: "max",
      Java: "max",
      Pascal: "max",
      Python: "max",
      TypeScript: "max",
    },
    [PCode.maxi],
    [
      parameter("integer", "a"),
      parameter("integer", "b"),
    ],
    "integer",
    5,
    1,
    "Returns the maximum of <code>a</code> and <code>b</code>."
  ),
  command(
    {
      BASIC: "MIN",
      C: "min",
      Java: "min",
      Pascal: "min",
      Python: "min",
      TypeScript: "min",
    },
    [PCode.mini],
    [
      parameter("integer", "a"),
      parameter("integer", "b"),
    ],
    "integer",
    5,
    1,
    "Returns the minimum of <code>a</code> and <code>b</code>."
  ),
  command(
    {
      BASIC: "SQR",
      C: "sqrt",
      Java: "sqrt",
      Pascal: "sqrt",
      Python: "sqrt",
      TypeScript: "sqrt",
    },
    [PCode.sqrt],
    [
      parameter("integer", "a"),
      parameter("integer", "mult"),
    ],
    "integer",
    5,
    1,
    "Returns <code>&radic;a</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  command(
    {
      BASIC: "HYPOT",
      C: "hypot",
      Java: "hypot",
      Pascal: "hypot",
      Python: "hypot",
      TypeScript: "hypot",
    },
    [PCode.hyp],
    [
      parameter("integer", "a"),
      parameter("integer", "b"),
      parameter("integer", "mult"),
    ],
    "integer",
    5,
    1,
    "Returns <code>&radic;(a<sup>2</sup>+b<sup>2</sup>)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  command(
    {
      BASIC: "RND",
      C: null,
      Java: null,
      Pascal: null,
      Python: null,
      TypeScript: null,
    },
    [PCode.rand, PCode.incr],
    [parameter("integer", "n")],
    "integer",
    5,
    1,
    "Returns a random integer between 1 and <code>n</code>."
  ),
  command(
    {
      BASIC: null,
      C: "rand",
      Java: "randInt",
      Pascal: "random",
      Python: "randrange",
      TypeScript: "randInt",
    },
    [PCode.rand],
    [parameter("integer", "n")],
    "integer",
    5,
    1,
    "Returns a random non-negative integer less than <code>n</code>."
  ),
  command(
    {
      BASIC: null,
      C: null,
      Java: null,
      Pascal: null,
      Python: "randint",
      TypeScript: null,
    },
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
    [
      parameter("integer", "a"),
      parameter("integer", "b"),
    ],
    "integer",
    5,
    1,
    "Returns a random integer between <code>a</code> and <code>b</code>."
  ),
  command(
    {
      BASIC: "RNDSEED",
      C: "srand",
      Java: "seed",
      Pascal: "randseed",
      Python: "seed",
      TypeScript: "seed",
    },
    [PCode.seed],
    [parameter("integer", "seed")],
    "integer",
    5,
    1,
    "Initialises the random number generator with the given <code>seed</code>, and returns that seed. If <code>seed</code> is 0, the seed is set from the current system clock."
  ),
  command(
    {
      BASIC: "POWER",
      C: "pow",
      Java: "power",
      Pascal: "power",
      Python: "power",
      TypeScript: "pow",
    },
    [PCode.powr],
    [
      parameter("integer", "a"),
      parameter("integer", "b"),
      parameter("integer", "c"),
      parameter("integer", "mult"),
    ],
    "integer",
    5,
    2,
    "Returns <code>(a/b)<sup>c</sup></code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  command(
    {
      BASIC: "ROOT",
      C: "root",
      Java: "root",
      Pascal: "root",
      Python: "root",
      TypeScript: "root",
    },
    [PCode.root],
    [
      parameter("integer", "a"),
      parameter("integer", "b"),
      parameter("integer", "c"),
      parameter("integer", "mult"),
    ],
    "integer",
    5,
    2,
    "Returns <code><sup>c</sup>&radic;(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  command(
    {
      BASIC: "DIVMULT",
      C: "divmult",
      Java: "divmult",
      Pascal: "divmult",
      Python: "divmult",
      TypeScript: "divmult",
    },
    [PCode.divm],
    [
      parameter("integer", "a"),
      parameter("integer", "b"),
      parameter("integer", "mult"),
    ],
    "integer",
    5,
    2,
    "Returns <code>a/b</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  command(
    {
      BASIC: "MAXINT",
      C: "maxint",
      Java: "maxInt",
      Pascal: "maxint",
      Python: "maxint",
      TypeScript: "maxInt",
    },
    [PCode.mxin],
    [],
    "integer",
    5,
    2,
    "Returns the maximum integer that the Machine can deal with (2<sup>31</sup>-1)."
  ),
  command(
    {
      BASIC: null,
      C: null,
      Java: null,
      Pascal: "shl",
      Python: null,
      TypeScript: null,
    },
    [PCode.shft],
    [
      parameter("integer", "number"),
      parameter("integer", "shift"),
    ],
    "integer",
    5,
    2,
    "Shift bits left."
  ),
  command(
    {
      BASIC: null,
      C: null,
      Java: null,
      Pascal: "shr",
      Python: null,
      TypeScript: null,
    },
    [PCode.neg, PCode.shft],
    [
      parameter("integer", "number"),
      parameter("integer", "shift"),
    ],
    "integer",
    5,
    2,
    "Shift bits right."
  ),
  // 6. Trig / exp / log functions
  command(
    {
      BASIC: "SIN",
      C: "sin",
      Java: "sin",
      Pascal: "sin",
      Python: "sin",
      TypeScript: "sin",
    },
    [PCode.sin],
    [
      parameter("integer", "a"),
      parameter("integer", "b"),
      parameter("integer", "mult"),
    ],
    "integer",
    6,
    1,
    "Returns <code>sin(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  command(
    {
      BASIC: "COS",
      C: "cos",
      Java: "cos",
      Pascal: "cos",
      Python: "cos",
      TypeScript: "cos",
    },
    [PCode.cos],
    [
      parameter("integer", "a"),
      parameter("integer", "b"),
      parameter("integer", "mult"),
    ],
    "integer",
    6,
    1,
    "Returns <code>cos(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  command(
    {
      BASIC: "TAN",
      C: "tan",
      Java: "tan",
      Pascal: "tan",
      Python: "tan",
      TypeScript: "tan",
    },
    [PCode.tan],
    [
      parameter("integer", "a"),
      parameter("integer", "b"),
      parameter("integer", "mult"),
    ],
    "integer",
    6,
    1,
    "Returns <code>tan(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  command(
    {
      BASIC: "PI",
      C: "pi",
      Java: "pi",
      Pascal: "pi",
      Python: "pi",
      TypeScript: "PI",
    },
    [PCode.pi],
    [parameter("integer", "mult")],
    "integer",
    6,
    1,
    "Returns the value of Pi, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  command(
    {
      BASIC: "EXP",
      C: "exp",
      Java: "exp",
      Pascal: "exp",
      Python: "exp",
      TypeScript: "exp",
    },
    [PCode.exp],
    [
      parameter("integer", "a"),
      parameter("integer", "b"),
      parameter("integer", "mult"),
    ],
    "integer",
    6,
    1,
    "Returns <code>a<sup>b</sup></code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  command(
    {
      BASIC: "LN",
      C: "log",
      Java: "log",
      Pascal: "ln",
      Python: "log",
      TypeScript: "log",
    },
    [PCode.ln],
    [
      parameter("integer", "a"),
      parameter("integer", "b"),
      parameter("integer", "mult"),
    ],
    "integer",
    6,
    1,
    "Returns <code>ln(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  command(
    {
      BASIC: "ANTILOG",
      C: "antilog",
      Java: "antilog",
      Pascal: "antilog",
      Python: "antilog",
      TypeScript: "antilog",
    },
    [PCode.alog],
    [
      parameter("integer", "a"),
      parameter("integer", "b"),
      parameter("integer", "mult"),
    ],
    "integer",
    6,
    2,
    "Returns <code>antilog<sub>10</sub>(a/b)</code> - i.e. <code>10<sup>a/b</sub></code> - multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  command(
    {
      BASIC: "LOG10",
      C: "log10",
      Java: "log10",
      Pascal: "log10",
      Python: "log10",
      TypeScript: "log10",
    },
    [PCode.log],
    [
      parameter("integer", "a"),
      parameter("integer", "b"),
      parameter("integer", "mult"),
    ],
    "integer",
    6,
    2,
    "Returns <code>log<sub>10</sub>(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  command(
    {
      BASIC: "ASN",
      C: "asin",
      Java: "asin",
      Pascal: "arcsin",
      Python: "asin",
      TypeScript: "asin",
    },
    [PCode.asin],
    [
      parameter("integer", "a"),
      parameter("integer", "b"),
      parameter("integer", "mult"),
    ],
    "integer",
    6,
    2,
    "Returns <code>arcsin(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  command(
    {
      BASIC: "ACS",
      C: "acos",
      Java: "acos",
      Pascal: "arccos",
      Python: "acos",
      TypeScript: "acos",
    },
    [PCode.acos],
    [
      parameter("integer", "a"),
      parameter("integer", "b"),
      parameter("integer", "mult"),
    ],
    "integer",
    6,
    2,
    "Returns <code>arccos(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  command(
    {
      BASIC: "ATN",
      C: "atan",
      Java: "atan",
      Pascal: "arctan",
      Python: "atan",
      TypeScript: "atan",
    },
    [PCode.atan],
    [
      parameter("integer", "a"),
      parameter("integer", "b"),
      parameter("integer", "mult"),
    ],
    "integer",
    6,
    2,
    "Returns <code>arctan(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."
  ),
  // 7. String operations
  command(
    {
      BASIC: "WRITE",
      C: "write",
      Java: "write",
      Pascal: "write",
      Python: null,
      TypeScript: null,
    },
    [PCode.writ],
    [parameter("string", "string")],
    null,
    7,
    0,
    "Writes the input <code>string</code> to the console and textual output area of the System."
  ),
  // TODO: 'print' in Python should have an optional 'end' parameter (which defaults to a new line)
  command(
    {
      BASIC: "WRITELN",
      C: "writeline",
      Java: "writeLine",
      Pascal: "writeln",
      Python: "print",
      TypeScript: "log",
    },
    [PCode.writ, PCode.newl],
    [parameter("string", "string")],
    null,
    7,
    0,
    "Writes the input <code>string</code> to the console and textual output area of the System, followed by a line break."
  ),
  command(
    {
      BASIC: "DISPLAY",
      C: "display",
      Java: "display",
      Pascal: "display",
      Python: "display",
      TypeScript: "display",
    },
    [PCode.disp],
    [
      parameter("string", "string"),
      parameter("integer", "font"),
      parameter("integer", "size"),
    ],
    null,
    7,
    0,
    "Prints the input <code>string</code> in the Turtle&rsquo;s current colour and at the Turtle&rsquo;s current location, in the specified <code>font</code> and <code>size</code>. Can be used in conjunction with the <code>box</code> drawing command. For a list of available fonts, see the <b>Constants</b> tab."
  ),
  command(
    {
      BASIC: "LCASE$",
      C: "strlwr",
      Java: "toLowerCase",
      Pascal: "lowercase",
      Python: "lower",
      TypeScript: "toLowerCase",
    },
    [PCode.ldin, 1, PCode.case],
    [parameter("string", "string")],
    "string",
    7,
    1,
    "Returns the input <code>string</code> as all lowercase."
  ),
  command(
    {
      BASIC: "UCASE$",
      C: "strupr",
      Java: "toUpperCase",
      Pascal: "uppercase",
      Python: "upper",
      TypeScript: "toUpperCase",
    },
    [PCode.ldin, 2, PCode.case],
    [parameter("string", "string")],
    "string",
    7,
    1,
    "Returns the input <code>string</code> as all uppercase."
  ),
  command(
    {
      BASIC: "CCASE$",
      C: "strcap",
      Java: "capitalize",
      Pascal: "initcap",
      Python: "capitalize",
      TypeScript: "capitalize",
    },
    [PCode.ldin, 3, PCode.case],
    [parameter("string", "string")],
    "string",
    7,
    1,
    "Returns the input <code>string</code> with the first letter capitalized."
  ),
  command(
    {
      BASIC: "TCASE$",
      C: "strtitle",
      Java: "toTitleCase",
      Pascal: "titlecase",
      Python: "title",
      TypeScript: "toTitleCase",
    },
    [PCode.ldin, 4, PCode.case],
    [parameter("string", "string")],
    "string",
    7,
    1,
    "Returns the input <code>string</code> in title case (i.e. the first letter of each word capitalized)."
  ),
  command(
    {
      BASIC: "SCASE$",
      C: "strswap",
      Java: "swapCase",
      Pascal: "swapcase",
      Python: "swapcase",
      TypeScript: "swapCase",
    },
    [PCode.ldin, 5, PCode.case],
    [parameter("string", "string")],
    "string",
    7,
    1,
    "Returns the input <code>string</code> with all the cases swapped."
  ),
  command(
    {
      BASIC: "LEN",
      C: "strlen",
      Java: "length",
      Pascal: "length",
      Python: "len",
      TypeScript: "length",
    },
    [PCode.slen],
    [parameter("string", "string")],
    "integer",
    7,
    1,
    "Returns the length of the input <code>string</code> (i.e. the number of characters)."
  ),
  command(
    {
      BASIC: "DEL$",
      C: null,
      Java: null,
      Pascal: "delete",
      Python: null,
      TypeScript: null,
    },
    [PCode.dels],
    [
      parameter("string", "string"),
      parameter("integer", "index"),
      parameter("integer", "length"),
    ],
    "string",
    7,
    2,
    "Returns the input <code>string</code> with some characters removed, starting at the given <code>index</code> and of the specified <code>length</code>."
  ),
  command(
    {
      BASIC: null,
      C: "strdel",
      Java: "delete",
      Pascal: null,
      Python: "delete",
      TypeScript: "delete",
    },
    [PCode.swap, PCode.incr, PCode.swap, PCode.dels],
    [
      parameter("string", "string"),
      parameter("integer", "index"),
      parameter("integer", "length"),
    ],
    "string",
    7,
    2,
    "Returns the input <code>string</code> with some characters removed, starting at the given <code>index</code> and of the specified <code>length</code>."
  ),
  command(
    {
      BASIC: "LEFT$",
      C: null,
      Java: null,
      Pascal: null,
      Python: null,
      TypeScript: null,
    },
    [PCode.ldin, 1, PCode.swap, PCode.copy],
    [
      parameter("string", "string"),
      parameter("integer", "length"),
    ],
    "string",
    7,
    2,
    "Returns a copy of the characters in the input <code>string</code>, starting on the left and of the specified <code>length</code>."
  ),
  command(
    {
      BASIC: "MID$",
      C: null,
      Java: null,
      Pascal: "copy",
      Python: null,
      TypeScript: null,
    },
    [PCode.copy],
    [
      parameter("string", "string"),
      parameter("integer", "index"),
      parameter("integer", "length"),
    ],
    "string",
    7,
    2,
    "Returns a copy of the characters in the input <code>string</code>, starting at the given <code>index</code> and of the specified <code>length</code>."
  ),
  command(
    {
      BASIC: null,
      C: "strcpy",
      Java: "copy",
      Pascal: null,
      Python: "copy",
      TypeScript: "copy",
    },
    [PCode.swap, PCode.incr, PCode.swap, PCode.copy],
    [
      parameter("string", "string"),
      parameter("integer", "index"),
      parameter("integer", "length"),
    ],
    "string",
    7,
    2,
    "Returns a copy of the characters in the input <code>string</code>, starting at the given <code>index</code> and of the specified <code>length</code>."
  ),
  command(
    {
      BASIC: "RIGHT$",
      C: null,
      Java: null,
      Pascal: null,
      Python: null,
      TypeScript: null,
    },
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
    [
      parameter("string", "string"),
      parameter("integer", "length"),
    ],
    "string",
    7,
    2,
    "Returns a copy of the characters in the input <code>string</code>, starting on the right and of the specified <code>length</code>."
  ),
  command(
    {
      BASIC: "INSERT$",
      C: null,
      Java: null,
      Pascal: null,
      Python: null,
      TypeScript: null,
    },
    [PCode.rota, PCode.rota, PCode.inss],
    [
      parameter("string", "string"),
      parameter("integer", "index"),
      parameter("string", "substr"),
    ],
    "string",
    7,
    2,
    "Returns the input <code>string</code> with the specified <code>substring</code> inserted at the given <code>index</code>."
  ),
  command(
    {
      BASIC: null,
      C: "strins",
      Java: "insert",
      Pascal: null,
      Python: "insert",
      TypeScript: "insert",
    },
    [PCode.rota, PCode.rota, PCode.swap, PCode.rota, PCode.incr, PCode.inss],
    [
      parameter("string", "string"),
      parameter("string", "substr"),
      parameter("integer", "index"),
    ],
    "string",
    7,
    2,
    "Returns the input <code>string</code> with the specified <code>substring</code> inserted at the given <code>index</code>."
  ),
  command(
    {
      BASIC: null,
      C: null,
      Java: null,
      Pascal: "insert",
      Python: null,
      TypeScript: null,
    },
    [PCode.inss],
    [
      parameter("string", "substr"),
      parameter("string", "string"),
      parameter("integer", "index"),
    ],
    "string",
    7,
    2,
    "Returns the input <code>string</code> with the specified <code>substring</code> inserted at the given <code>index</code>."
  ),
  command(
    {
      BASIC: "PAD$",
      C: "strpad",
      Java: "pad",
      Pascal: "pad",
      Python: "pad",
      TypeScript: null,
    },
    [PCode.spad],
    [
      parameter("string", "string"),
      parameter("string", "padding"),
      parameter("integer", "length"),
    ],
    "string",
    7,
    2,
    "Returns the input <code>string</code> with the input <code>padding</code> added either before or after to make a string of minimum given <code>length</cope>. The <code>padding</code> is placed before if <code>length</code> is positive, after if it is negative."
  ),
  command(
    {
      BASIC: null,
      C: null,
      Java: null,
      Pascal: null,
      Python: null,
      TypeScript: "padStart",
    },
    [PCode.spad],
    [
      parameter("string", "string"),
      parameter("string", "padding"),
      parameter("integer", "length"),
    ],
    "string",
    7,
    2,
    "Returns the input <code>string</code> with the input <code>padding</code> added before to make a string of minimum given <code>length</cope>."
  ),
  command(
    {
      BASIC: null,
      C: null,
      Java: null,
      Pascal: null,
      Python: null,
      TypeScript: "padEnd",
    },
    [PCode.neg, PCode.spad],
    [
      parameter("string", "string"),
      parameter("string", "padding"),
      parameter("integer", "length"),
    ],
    "string",
    7,
    2,
    "Returns the input <code>string</code> with the input <code>padding</code> added after to make a string of minimum given <code>length</cope>."
  ),
  command(
    {
      BASIC: "REPLACE$",
      C: "strrepl",
      Java: "replace",
      Pascal: "replace",
      Python: "replace",
      TypeScript: null,
    },
    [PCode.repl],
    [
      parameter("string", "string"),
      parameter("string", "substr"),
      parameter("string", "replace"),
      parameter("integer", "n"),
    ],
    "string",
    7,
    2,
    "Returns the input <code>string</code> with up to <code>n</code> occurences of <code>substring</code> replaced by <code>replace</code>. Set <code>n</code> equal to <code>0</code> to replace every occurence."
  ),
  command(
    {
      BASIC: "INSTR",
      C: null,
      Java: null,
      Pascal: null,
      Python: null,
      TypeScript: null,
    },
    [PCode.swap, PCode.poss],
    [
      parameter("string", "string"),
      parameter("string", "substr"),
    ],
    "integer",
    7,
    2,
    "Searches for the input <code>substring</code> within the given <code>string</code>; returns the index of the first character if found, 0 otherwise."
  ),
  command(
    {
      BASIC: null,
      C: "strpos",
      Java: "indexOf",
      Pascal: null,
      Python: "find",
      TypeScript: "indexOf",
    },
    [PCode.swap, PCode.poss, PCode.decr],
    [
      parameter("string", "string"),
      parameter("string", "substr"),
    ],
    "integer",
    7,
    2,
    "Searches for the input <code>substring</code> within the given <code>string</code>; returns the index of the first character if found, 0 otherwise."
  ),
  command(
    {
      BASIC: null,
      C: null,
      Java: null,
      Pascal: "pos",
      Python: null,
      TypeScript: null,
    },
    [PCode.poss],
    [
      parameter("string", "substr"),
      parameter("string", "string"),
    ],
    "integer",
    7,
    2,
    "Searches for the input <code>substring</code> within the given <code>string</code>; returns the index of the first character if found, 0 otherwise."
  ),
  // 8. Type conversion routines
  command(
    {
      BASIC: "STR$",
      C: "itoa",
      Java: "toString",
      Pascal: "str",
      Python: "str",
      TypeScript: "toString",
    },
    [PCode.itos],
    [parameter("integer", "n")],
    "string",
    8,
    0,
    "Returns the integer <code>n</code> as a string, e.g. <code>str(12)='12'</code>."
  ),
  command(
    {
      BASIC: "VAL",
      C: "atoi",
      Java: "parseInt",
      Pascal: "val",
      Python: "int",
      TypeScript: "parseInt",
    },
    [PCode.ldin, 0, PCode.sval],
    [parameter("string", "string")],
    "integer",
    8,
    0,
    "Returns the input <code>string</code> as an integer, e.g. <code>val('12')=12</code>. Returns <code>0</code> if the string cannot be converted (i.e. if it is not an integer string)."
  ),
  command(
    {
      BASIC: "VALDEF",
      C: "atoidef",
      Java: "parseIntDef",
      Pascal: "valdef",
      Python: "intdef",
      TypeScript: "parseIntDef",
    },
    [PCode.sval],
    [
      parameter("string", "string"),
      parameter("integer", "default"),
    ],
    "integer",
    8,
    0,
    "Returns the input <code>string</code> as an integer, e.g. <code>val('12')=12</code>. Returns the specified <code>default</code> value if the string cannot be converted (i.e. if it is not an integer string)."
  ),
  command(
    {
      BASIC: "QSTR$",
      C: "qitoa",
      Java: "toStringQ",
      Pascal: "qstr",
      Python: "qstr",
      TypeScript: "toStringQ",
    },
    [PCode.qtos],
    [
      parameter("integer", "a"),
      parameter("integer", "b"),
      parameter("integer", "decplaces"),
    ],
    "string",
    8,
    1,
    "Returns the value of <code>a/b</code> to the specified number of decimal places, as a decimal string, e.g. <code>qstr(2,3,4)='0.6667'</code>."
  ),
  command(
    {
      BASIC: "QVAL",
      C: "qatoi",
      Java: "parseIntQ",
      Pascal: "qval",
      Python: "qint",
      TypeScript: "parseIntQ",
    },
    [PCode.qval],
    [
      parameter("string", "string"),
      parameter("integer", "mult"),
      parameter("integer", "default"),
    ],
    "integer",
    8,
    1,
    "Returns the input decimal <code>string</code> as an integer, multiplied by <code>mult</code> and rounded to the nearest integer, e.g. <code>qval('1.5',10)=15</code>. Returns the specified <code>default</code> value if the string cannot be converted (i.e. if it is not a decimal string)."
  ),
  command(
    {
      BASIC: "CHR$",
      C: null,
      Java: null,
      Pascal: null,
      Python: "chr",
      TypeScript: "fromCharCode",
    },
    [PCode.ctos],
    [parameter("integer", "n")],
    "string",
    8,
    2,
    "Returns the character with ASCII character code <code>n</code>."
  ),
  command(
    {
      BASIC: null,
      C: null,
      Java: "fromCharCode",
      Pascal: "chr",
      Python: null,
      TypeScript: null,
    },
    [],
    [parameter("integer", "n")],
    "character",
    8,
    2,
    "Returns the character with ASCII character code <code>n</code>."
  ),
  command(
    {
      BASIC: "ASC",
      C: null,
      Java: "charCode",
      Pascal: null,
      Python: "ord",
      TypeScript: "charCode",
    },
    [PCode.sasc],
    [parameter("string", "char")],
    "integer",
    8,
    2,
    "Returns the ASCII code of the input character, or of the first character of the input string."
  ),
  command(
    {
      BASIC: null,
      C: null,
      Java: null,
      Pascal: "ord",
      Python: null,
      TypeScript: null,
    },
    [],
    [parameter("character", "char")],
    "integer",
    8,
    2,
    "Returns the ASCII code of the input character."
  ),
  command(
    {
      BASIC: null,
      C: null,
      Java: null,
      Pascal: "boolint",
      Python: null,
      TypeScript: null,
    },
    [],
    [parameter("boolean", "boolean")],
    "integer",
    8,
    2,
    "Returns the input <code>boolean</code> as an integer (-1 for <code>true</code>, 0 for <code>false</code>)."
  ),
  command(
    {
      BASIC: null,
      C: null,
      Java: null,
      Pascal: null,
      Python: "int",
      TypeScript: null,
    },
    [],
    [parameter("boolean", "boolean")],
    "integer",
    8,
    2,
    "Returns the input <code>boolean</code> as an integer (1 for <code>true</code>, 0 for <code>false</code>)."
  ),
  command(
    {
      BASIC: null,
      C: null,
      Java: null,
      Pascal: null,
      Python: "bool",
      TypeScript: null,
    },
    [PCode.ldin, 0, PCode.noeq],
    [parameter("integer", "integer")],
    "boolean",
    8,
    2,
    "Returns the input <code>integer</code> as a boolean (0 is <code>false</code>, everything else is <code>true</code>)."
  ),
  command(
    {
      BASIC: "HEX$",
      C: "itoahex",
      Java: "toStringHex",
      Pascal: "hexstr",
      Python: "hex",
      TypeScript: "toStringHex",
    },
    [PCode.hexs],
    [
      parameter("integer", "n"),
      parameter("integer", "minlength"),
    ],
    "string",
    8,
    2,
    "Returns a string representation of integer <code>n</code> in hexadecimal format, padded with leading zeros as up to <code>minlength</code>, e.g. <code>hexstr(255,6)='0000FF'</code>."
  ),
  // 9. Input and timing routines
  command(
    {
      BASIC: "PAUSE",
      C: "pause",
      Java: "pause",
      Pascal: "pause",
      Python: "pause",
      TypeScript: "pause",
    },
    [PCode.wait],
    [parameter("integer", "m")],
    null,
    9,
    0,
    "Makes the Turtle Machine wait <code>m</code> milliseconds before performing the next operation. This is useful for controlling the speed of animations."
  ),
  command(
    {
      BASIC: "HALT",
      C: "exit",
      Java: "halt",
      Pascal: "halt",
      Python: "halt",
      TypeScript: "halt",
    },
    [PCode.halt],
    [],
    null,
    9,
    0,
    "Halts the program."
  ),
  command(
    {
      BASIC: "GETLINE$",
      C: "gets",
      Java: "readLine",
      Pascal: "readln",
      Python: "input",
      TypeScript: "input",
    },
    [PCode.rdln],
    [],
    "string",
    9,
    0,
    "Waits for the RETURN key to be pressed, then returns everything in the keybuffer up to (and not including) the new line character."
  ),
  command(
    {
      BASIC: "INPUT$",
      C: "scan",
      Java: "input",
      Pascal: "input",
      Python: null,
      TypeScript: null,
    },
    [PCode.writ, PCode.newl, PCode.rdln],
    [parameter("string", "prompt")],
    "string",
    9,
    0,
    "Gives an input prompt, then returns the input when the RETURN key is pressed (using the keybuffer)."
  ),
  command(
    {
      BASIC: "CURSOR",
      C: "cursor",
      Java: "cursor",
      Pascal: "cursor",
      Python: "cursor",
      TypeScript: "cursor",
    },
    [PCode.curs],
    [parameter("integer", "cursorcode")],
    null,
    9,
    1,
    "Sets which cursor to display (1-15) when the mouse pointer is over the canvas. 0 hides the cursor; any value outside the range 0-15 resets the default cursor. For a list of available cursors, see the <b>Cursors</b> tab."
  ),
  command(
    {
      BASIC: "KEYECHO",
      C: "keyecho",
      Java: "keyEcho",
      Pascal: "keyecho",
      Python: "keyecho",
      TypeScript: "keyEcho",
    },
    [PCode.kech],
    [parameter("boolean", "on")],
    null,
    9,
    1,
    "Turns the keyboard echo to the console on (<code>true</code>) or off (<code>false</code>)."
  ),
  command(
    {
      BASIC: "DETECT",
      C: "detect",
      Java: "detect",
      Pascal: "detect",
      Python: "detect",
      TypeScript: "detect",
    },
    [PCode.tdet],
    [
      parameter("integer", "inputcode"),
      parameter("integer", "m"),
    ],
    "integer",
    9,
    1,
    "Waits a maximum of <code>m</code> milliseconds for the key with the specified <code>inputcode</code> to be pressed; returns its current input value if pressed (and stops waiting), and <code>0</code> otherwise."
  ),
  command(
    {
      BASIC: "GET$",
      C: "get",
      Java: "read",
      Pascal: "read",
      Python: "read",
      TypeScript: "read",
    },
    [PCode.read],
    [parameter("integer", "n")],
    "string",
    9,
    1,
    "Returns the first <code>n</code> characters from the keybuffer as a string."
  ),
  command(
    {
      BASIC: "TIME",
      C: "time",
      Java: "time",
      Pascal: "time",
      Python: "time",
      TypeScript: "time",
    },
    [PCode.time],
    [],
    "integer",
    9,
    1,
    "Returns the time (in milliseconds) since the program began."
  ),
  command(
    {
      BASIC: "TIMESET",
      C: "timeset",
      Java: "timeSet",
      Pascal: "timeset",
      Python: "timeset",
      TypeScript: "timeSet",
    },
    [PCode.tset],
    [parameter("integer", "m")],
    null,
    9,
    1,
    "Artificially sets the time since the program began to <code>m</code> milliseconds."
  ),
  command(
    {
      BASIC: "RESET",
      C: "reset",
      Java: "reset",
      Pascal: "reset",
      Python: "reset",
      TypeScript: "reset",
    },
    [PCode.iclr],
    [parameter("integer", "\\inputcode")],
    null,
    9,
    2,
    "Resets the specified <code>\\inputcode</code> (<code>\\mousex</code>, <code>\\mousey</code>, <code>\\backspace</code>, <code>\\enter</code>, etc.) to its initial value (i.e. -1)."
  ),
  command(
    {
      BASIC: "STATUS",
      C: "status",
      Java: "status",
      Pascal: "status",
      Python: "status",
      TypeScript: "status",
    },
    [PCode.stat],
    [parameter("integer", "\\inputcode")],
    "integer",
    9,
    2,
    "Returns the <code>?kshift</code> value for the most recent press/click of the input with the specified <code>\\inputcode</code>."
  ),
  command(
    {
      BASIC: "KEYBUFFER",
      C: "keybuffer",
      Java: "keyBuffer",
      Pascal: "keybuffer",
      Python: "keybuffer",
      TypeScript: "keyBuffer",
    },
    [PCode.bufr, PCode.ldin, 1, PCode.sptr, PCode.hfix],
    [parameter("integer", "n")],
    null,
    9,
    2,
    "Creates a new custom keybuffer of length <code>n</code>. A keybuffer of length 32 is available by default; use this command if you need a larger buffer."
  ),
  // 10. file processing
  command(
    {
      BASIC: "CHDIR",
      C: null,
      Java: null,
      Pascal: "chdir",
      Python: null,
      TypeScript: null,
    },
    [PCode.chdr],
    [parameter("string", "directory name")],
    null,
    10,
    1,
    "Changes the current directory."
  ),
  command(
    {
      BASIC: "RMDIR",
      C: null,
      Java: null,
      Pascal: "rmdir",
      Python: null,
      TypeScript: null,
    },
    [PCode.ldin, 1, PCode.diry, PCode.ldin, 128, PCode.less],
    [parameter("string", "subdirectory name")],
    "boolean",
    10,
    1,
    "Removes a subdirectory."
  ),
  command(
    {
      BASIC: "MKDIR",
      C: null,
      Java: null,
      Pascal: "mkdir",
      Python: null,
      TypeScript: null,
    },
    [PCode.ldin, 2, PCode.diry, PCode.ldin, 127, PCode.more],
    [parameter("string", "subdirectory name")],
    "boolean",
    10,
    1,
    "Creates a subdirectory."
  ),
  command(
    {
      BASIC: null,
      C: null,
      Java: null,
      Pascal: "openfile",
      Python: null,
      TypeScript: null,
    },
    [PCode.open],
    [
      parameter("string", "filename"),
      parameter("integer", "mode"),
    ],
    "integer",
    10,
    1,
    "Opens a file (1: read, 2: append, 3: write)."
  ),
  command(
    {
      BASIC: "OPENIN",
      C: null,
      Java: null,
      Pascal: null,
      Python: null,
      TypeScript: null,
    },
    [PCode.ldin, 1, PCode.open],
    [parameter("string", "filename")],
    "integer",
    10,
    1,
    "Open a file for reading."
  ),
  command(
    {
      BASIC: "OPENUP",
      C: null,
      Java: null,
      Pascal: null,
      Python: null,
      TypeScript: null,
    },
    [PCode.ldin, 2, PCode.open],
    [parameter("string", "filename")],
    "integer",
    10,
    1,
    "Opens a file for appending."
  ),
  command(
    {
      BASIC: "OPENOUT",
      C: null,
      Java: null,
      Pascal: null,
      Python: null,
      TypeScript: null,
    },
    [PCode.ldin, 4, PCode.open],
    [parameter("string", "filename")],
    "integer",
    10,
    1,
    "Opens a file for writing."
  ),
  command(
    {
      BASIC: "CLOSE#",
      C: null,
      Java: null,
      Pascal: "closefile",
      Python: null,
      TypeScript: null,
    },
    [PCode.clos],
    [parameter("integer", "file handle")],
    null,
    10,
    1,
    "Closes a file."
  ),
  command(
    {
      BASIC: "DELETEFILE",
      C: null,
      Java: null,
      Pascal: "deletefile",
      Python: null,
      TypeScript: null,
    },
    [PCode.ldin, 1, PCode.file, PCode.ldin, 128, PCode.less],
    [parameter("string", "filename")],
    "boolean",
    10,
    1,
    "Deletes a file."
  ),
  command(
    {
      BASIC: "FREAD#",
      C: null,
      Java: null,
      Pascal: "fread",
      Python: null,
      TypeScript: null,
    },
    [PCode.frds],
    [
      parameter("integer", "file handle"),
      parameter("integer", "n"),
    ],
    "string",
    10,
    1,
    "Reads n characters (maximum) from a file."
  ),
  command(
    {
      BASIC: "FREADLN#",
      C: null,
      Java: null,
      Pascal: "freadln",
      Python: null,
      TypeScript: null,
    },
    [PCode.frln],
    [parameter("integer", "file handle")],
    "string",
    10,
    1,
    "Reads a line from a file."
  ),
  command(
    {
      BASIC: "FWRITE#",
      C: null,
      Java: null,
      Pascal: "fwrite",
      Python: null,
      TypeScript: null,
    },
    [PCode.fwrs],
    [
      parameter("integer", "file handle"),
      parameter("string", "string"),
    ],
    null,
    10,
    1,
    "Writes a string to a file."
  ),
  command(
    {
      BASIC: "FWRITELN#",
      C: null,
      Java: null,
      Pascal: "fwriteln",
      Python: null,
      TypeScript: null,
    },
    [PCode.fwln],
    [
      parameter("integer", "file handle"),
      parameter("string", "string"),
    ],
    null,
    10,
    1,
    "Writes a line to a file."
  ),
  command(
    {
      BASIC: "EOF#",
      C: null,
      Java: null,
      Pascal: "eof",
      Python: null,
      TypeScript: null,
    },
    [PCode.eof],
    [parameter("integer", "file handle")],
    "boolean",
    10,
    1,
    "Tests for the end of file."
  ),
  command(
    {
      BASIC: "CHECKDIR",
      C: null,
      Java: null,
      Pascal: "checkdir",
      Python: null,
      TypeScript: null,
    },
    [PCode.ldin, 0, PCode.diry, PCode.ldin, 127, PCode.more],
    [
      parameter("string", "directory name"),
      parameter("integer", "code"),
    ],
    "integer",
    10,
    2,
    "Creates/deletes/checks a directory."
  ),
  command(
    {
      BASIC: "CHECKFILE",
      C: null,
      Java: null,
      Pascal: "checkfile",
      Python: null,
      TypeScript: null,
    },
    [PCode.ldin, 0, PCode.file, PCode.ldin, 127, PCode.more],
    [
      parameter("string", "filename"),
      parameter("integer", "code"),
    ],
    "integer",
    10,
    2,
    "Creates/deletes/checks a file."
  ),
  command(
    {
      BASIC: "COPYFILE",
      C: null,
      Java: null,
      Pascal: "copyfile",
      Python: null,
      TypeScript: null,
    },
    [PCode.ldin, 3, PCode.fmov],
    [
      parameter("string", "old name"),
      parameter("string", "new name"),
    ],
    "boolean",
    10,
    2,
    "Copies a file."
  ),
  command(
    {
      BASIC: "DIREXISTS",
      C: null,
      Java: null,
      Pascal: "direxists",
      Python: null,
      TypeScript: null,
    },
    [PCode.ldin, 0, PCode.diry, PCode.ldin, 127, PCode.more],
    [parameter("string", "subdirectory name")],
    "boolean",
    10,
    2,
    "Checks whether a subdirectory exists."
  ),
  command(
    {
      BASIC: "FILEEXISTS",
      C: null,
      Java: null,
      Pascal: "fileexists",
      Python: null,
      TypeScript: null,
    },
    [PCode.ldin, 0, PCode.file, PCode.ldin, 127, PCode.more],
    [parameter("string", "filename")],
    "boolean",
    10,
    2,
    "Checks whether a file exists."
  ),
  command(
    {
      BASIC: "FINDDIR",
      C: null,
      Java: null,
      Pascal: "finddir",
      Python: null,
      TypeScript: null,
    },
    [
      PCode.dupl,
      PCode.lptr,
      PCode.rota,
      PCode.fdir,
      PCode.swap,
      PCode.rota,
      PCode.sptr,
    ],
    [
      parameter("string", "directory name pattern"),
      parameter("integer", "file handle"),
    ],
    "string",
    10,
    2,
    "Finds the first directory matching the pattern."
  ),
  command(
    {
      BASIC: "FINDFIRST",
      C: null,
      Java: null,
      Pascal: "findfirst",
      Python: null,
      TypeScript: null,
    },
    [
      PCode.dupl,
      PCode.lptr,
      PCode.rota,
      PCode.ffnd,
      PCode.swap,
      PCode.rota,
      PCode.sptr,
    ],
    [
      parameter("string", "filename pattern"),
      parameter("integer", "file handle"),
    ],
    "string",
    10,
    2,
    "Finds the first file matching the pattern."
  ),
  command(
    {
      BASIC: "FINDNEXT",
      C: null,
      Java: null,
      Pascal: "findnext",
      Python: null,
      TypeScript: null,
    },
    [PCode.fnxt],
    [parameter("integer", "file handle")],
    "string",
    10,
    2,
    "Finds the next file/directory matching a pattern."
  ),
  command(
    {
      BASIC: "RENAMEFILE",
      C: null,
      Java: null,
      Pascal: "renamefile",
      Python: null,
      TypeScript: null,
    },
    [PCode.ldin, 1, PCode.fmov],
    [
      parameter("string", "old filename"),
      parameter("string", "new filename"),
    ],
    "boolean",
    10,
    2,
    "Rename file"
  ),
  command(
    {
      BASIC: "MOVEFILE",
      C: null,
      Java: null,
      Pascal: "movefile",
      Python: null,
      TypeScript: null,
    },
    [PCode.ldin, 2, PCode.fmov],
    [
      parameter("string", "old filename"),
      parameter("string", "new filename"),
    ],
    "boolean",
    10,
    2,
    "Moves a file."
  ),
  command(
    {
      BASIC: "RESTARTFILE",
      C: null,
      Java: null,
      Pascal: "restartfile",
      Python: null,
      TypeScript: null,
    },
    [PCode.fbeg],
    [parameter("integer", "file handle")],
    null,
    10,
    2,
    "Restarts reading a file."
  ),
  command(
    {
      BASIC: "EOLN#",
      C: null,
      Java: null,
      Pascal: "eoln",
      Python: null,
      TypeScript: null,
    },
    [PCode.eoln],
    [parameter("integer", "file handle")],
    "boolean",
    10,
    2,
    "Tests for end of line in a file."
  ),
  // 11. Turtle Machine monitoring
  command(
    {
      BASIC: "DUMP",
      C: "dump",
      Java: "dump",
      Pascal: "dump",
      Python: "dump",
      TypeScript: "dump",
    },
    [PCode.dump],
    [],
    null,
    11,
    2,
    "&ldquo;Dumps&rdquo; the current memory state into the display in the memory tab."
  ),
  command(
    {
      BASIC: "HEAPRESET",
      C: "heapreset",
      Java: "heapReset",
      Pascal: "heapreset",
      Python: "heapreset",
      TypeScript: "heapReset",
    },
    [PCode.hrst],
    [],
    null,
    11,
    2,
    "Resets the memory heap to the initial global value."
  ),
  command(
    {
      BASIC: "ADDRESS",
      C: "address",
      Java: "address",
      Pascal: "address",
      Python: "address",
      TypeScript: "address",
    },
    [],
    [parameter("integer", "variable", true)],
    "integer",
    11,
    2,
    "Returns the address in memory of the given <code>variable</code>."
  ),
  command(
    {
      BASIC: "PEEK",
      C: "peek",
      Java: "peek",
      Pascal: "peek",
      Python: "peek",
      TypeScript: "peek",
    },
    [PCode.lptr],
    [parameter("integer", "address")],
    "integer",
    11,
    2,
    "Peek at the value of the memory at the given <code>address</code>."
  ),
  command(
    {
      BASIC: "POKE",
      C: "poke",
      Java: "poke",
      Pascal: "poke",
      Python: "poke",
      TypeScript: "poke",
    },
    [PCode.poke],
    [
      parameter("integer", "address"),
      parameter("integer", "value"),
    ],
    null,
    11,
    2,
    "Poke the <code>value</code> into the memory at the given <code>address</code>."
  ),
  command(
    {
      BASIC: "TRACE",
      C: "trace",
      Java: "trace",
      Pascal: "trace",
      Python: "trace",
      TypeScript: "trace",
    },
    [PCode.trac],
    [parameter("boolean", "on")],
    null,
    11,
    2,
    "Turns the PCode trace facility on (<code>true</code>) or off (<code>false</code>)."
  ),
  command(
    {
      BASIC: "WATCH",
      C: "watch",
      Java: "watch",
      Pascal: "watch",
      Python: "watch",
      TypeScript: "watch",
    },
    [PCode.memw],
    [parameter("integer", "address")],
    null,
    11,
    2,
    "Sets an <code>address</code> in memory for the trace facility to watch."
  ),
] as const;
