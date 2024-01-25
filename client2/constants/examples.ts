import type { Language } from "./languages.ts";
import type { ExampleGroupId } from "./exampleGroup.ts";

export type Example = ReturnType<typeof example>;

const example = (
  groupId: ExampleGroupId,
  id: string,
  name: string,
  names: Partial<Record<Language, string | null>> = {}
) => ({
  __: "Example",
  groupId,
  id,
  names: {
    BASIC: name,
    C: name,
    Java: name,
    Pascal: name,
    Python: name,
    TypeScript: name,
    ...names,
  },
}) as const;

export default [
  // examples 1 - Drawing
  example("Drawing", "DrawPause", "Simple drawing with pauses"),
  example("Drawing", "SmileyFace", "Smiley face [PENUP, ELLBLOT]"),
  example("Drawing", "ThePlough", "The plough [SETXY, POLYLINE]"),
  example("Drawing", "OlympicRings", "Olympic rings (uses a variable)"),
  example("Drawing", "ForLoop", "FOR loop (uses a counting variable)"),
  example("Drawing", "TriangleSpin", "Spinning triangle pattern [MOVEXY]"),
  example("Drawing", "Circles", "Circling circles"),
  example("Drawing", "NestedLoops", "Nested FOR loops [DIRECTION, RGB]"),
  example(
    "Drawing",
    "RandomLines",
    "Random lines pattern [IF, PIXCOL, RECOLOUR]"
  ),
  example("Drawing", "RandomEllipses", "Random ellipses pattern"),
  // examples 2 - Procedures
  example("Procedures", "ColourSpiral", "Spiral of colours (WHILE, RANDCOL)", {
    BASIC: "Spiral of colours (REPEAT, RNDCOL)",
    Pascal: "Spiral of colours (REPEAT, RANDCOL)",
    Python: "Spiral of colours (WHILE, RNDCOL)",
  }),
  example("Procedures", "SimpleProc", "Simple procedure [WHILE, TURTD]", {
    BASIC: "Simple procedure [REPEAT, TURTD]",
    Pascal: "Simple procedure [REPEAT, TURTD]",
  }),
  example("Procedures", "ParameterProc", "Function with parameter", {
    BASIC: "Procedure with parameter",
    Pascal: "Procedure with parameter",
  }),
  example("Procedures", "ResizableFace", "Resizable face (nested functions)", {
    BASIC: "Resizable face (hierarchical procedures)",
    Pascal: "Resizable face (nested procedures)",
  }),
  example(
    "Procedures",
    "Polygons",
    "Polygons (uses 2 parameters) [POLYGON, POLYLINE]"
  ),
  example("Procedures", "Stars", "Stars [ANGLES, FORGET]"),
  example(
    "Procedures",
    "PolygonRings",
    "Polygon rings (uses 3 parameters) [MOD]"
  ),
  example("Procedures", "Triangle1", "Simple triangle"),
  example("Procedures", "Triangle2", "Triangle function", {
    BASIC: "Triangle procedure",
    Pascal: "Triangle procedure",
  }),
  example("Procedures", "Triangle3", "Triangle function with limit", {
    BASIC: "Triangle procedure with limit",
    Pascal: "Triangle procedure with limit",
  }),
  example("Procedures", "Triangles", "Recursive triangles"),
  example(
    "Procedures",
    "Factorials",
    "Recursive factorials [Function, OUTPUT]"
  ),
  // examples 3 - Further
  example("Further", "YouAreHere", "Text and arrow (using DISPLAY)"),
  example("Further", "CycleColours", "Cycling colours (using MOD)"),
  example("Further", "Clock", "Analogue clock (using WHILE)", {
    BASIC: "Analogue clock (using REPEAT)",
    Pascal: "Analogue clock (using REPEAT)",
  }),
  example("Further", "DigitalClock", "Digital clock (using IF and WHILE)"),
  example("Further", "Flashlights", "Flashlights (using Booleans)"),
  example("Further", "RefParams", "Reference parameters"),
  example("Further", "Balls3D", "3D colour effects"),
  example("Further", "StringFunctions", "Standard string functions"),
  example("Further", "UserStringFunctions", "User-defined string functions"),
  example("Further", "ListFunctions", "Python list functions", {
    BASIC: null,
    C: null,
    Java: null,
    Pascal: null,
    TypeScript: null,
  }),
  example("Further", "MathFunctions", "Mathematical functions"),
  example("Further", "TrigGraphs", "Trigonometric graphs"),
  // examples 4 - Movement
  example("Movement", "MovingBall", "Moving ball (using variables)"),
  example("Movement", "BouncingBall", "Bouncing ball (using variables)"),
  example("Movement", "TurtleMove", "Moving ball (using Turtle)"),
  example("Movement", "TurtleBounce", "Bouncing ball (using Turtle)"),
  example("Movement", "BouncingFace", "Bouncing face"),
  example("Movement", "MultiBounce", "Multiple bouncing balls"),
  example("Movement", "BouncingTriangle", "Bouncing triangle"),
  example("Movement", "BouncingShapes", "Multiple bouncing shapes"),
  example("Movement", "GravitySteps", "Movement under gravity"),
  example("Movement", "SolarSystem", "Solar system"),
  // examples 5 - Interaction
  example("Interaction", "AskInput", "Asking for typed input"),
  example("Interaction", "QuickClick", "Mouse reaction game"),
  example("Interaction", "TypingTest", "Typing test (checking characters)"),
  example("Interaction", "TypingTestKeys", "Typing test (checking keys)"),
  example("Interaction", "IterationGame", "Iteration game (Collatz sequence)"),
  example("Interaction", "SpongeThrow", "Throwing sponges at a moving face"),
  example("Interaction", "Arcade", "Arcade shooting game"),
  example("Interaction", "ColourCells", "Colouring cells"),
  example("Interaction", "SnakeGame", "Snake (classic game)"),
  example("Interaction", "SimpleDraw", "Drawing to the mouse"),
  example("Interaction", "PaintApp", "Painting application"),
  example(
    "Interaction",
    "MultipleTurtles",
    "Multiple turtles and varying ANGLES"
  ),
  // examples 6 - Files
  // example("Files", "WriteAndReadFile", "Writing and reading a text file"),
  // example("Files", "RenameAndDeleteFile", "Renaming and deleting a file"),
  // example("Files", "FileSearching", "File searching"),
  // example("Files", "SaveCSV", "Saving a CSV file"),
  // example("Files", "ReadCSV", "Reading a CSV file"),
  // example("Files", "RandomSentences", "Random sentences (using files)"),
  // example("Files", "FileCommands", "File commands"),
  // example("Files", "DirectoryCommands", "Directory commands"),
  // examples 7 - Cellular
  example("Cellular", "TippingPoint", "Tipping point (city epidemic)"),
  example("Cellular", "Disease", "Spread of disease"),
  example("Cellular", "GameOfLife", "Conway’s Game of Life"),
  example("Cellular", "GameOfLifeSetup", "Game of Life with user setup"),
  example("Cellular", "LifeArrays", "Game of Life, using arrays"),
  example("Cellular", "Automata", "One-dimensional cellular automata"),
  example("Cellular", "Diffusion", "A model of diffusion"),
  example("Cellular", "Dendrites", "Dendritic crystal growth"),
  example("Cellular", "Schelling", "Schelling’s segregation model"),
  example("Cellular", "IteratedPD", "Iterated Prisoner’s Dilemma"),
  // examples 8 - Models
  example("Models", "AimCannon", "Firing a cannon (manual)"),
  example("Models", "AutoCannon", "Firing a cannon (automatic)"),
  example("Models", "Launch", "Launching a rocket into orbit"),
  example("Models", "BrownianMotion", "Brownian motion"),
  example("Models", "Cheetahs", "Cheetahs and gazelles"),
  example("Models", "SexRatio", "The sex ratio"),
  example("Models", "Flocking", "Flocking behaviour"),
  example("Models", "Roads", "Town road simulation"),
  example("Models", "Interference", "Wave interference tutor"),
  example("Models", "TwoSlits", "Interference from two slits"),
  // examples 9 - Fractals
  example("Fractals", "RecursionFactory", "Recursion factory"),
  example("Fractals", "RecursiveTree", "Recursive tree"),
  example("Fractals", "KochSnowflake", "Koch snowflake"),
  example("Fractals", "SquareKoch", "Square Koch fractal curves"),
  example("Fractals", "Sierpinski", "Sierpinski triangle (by deletion)"),
  example("Fractals", "SierpinskiDots", "Sierpinski triangle (by random dots)"),
  example(
    "Fractals",
    "IFSBackground",
    "Iterated function systems (IFS) background"
  ),
  example("Fractals", "IFSColour", "IFS mappings on coloured background"),
  example("Fractals", "IFSDemonstrator", "IFS demonstrator program"),
  example("Fractals", "Logistic", "Logistic equation"),
  example("Fractals", "LogisticSpider", "Logistic spider"),
  example("Fractals", "MandelbrotDemo", "Mandelbrot multi-colour"),
  example("Fractals", "MandelbrotSpectrumDemo", "Mandelbrot spectral colours"),
  example("Fractals", "Quine", "Quine (self-replicating) program"),
  // examples 10 - Logic&CS
  example("Logic", "Hanoi", "Tower of Hanoi by recursion"),
  example("Logic", "IterateRoot", "Square roots by iteration"),
  example("Logic", "Fibonaccis", "Fibonaccis (using ARRAY and TIME)"),
  example("Logic", "Sorting", "Comparison of sorting methods"),
  example("Logic", "SortingStrings", "Comparison of sorting methods (strings)"),
  example("Logic", "NoughtsAndCrosses", "Noughts and crosses"),
  example("Logic", "NimLearn", "Nim learning program"),
  example("Logic", "MultiNim", "Nim with multiple piles"),
  example("Logic", "KnightsTour", "Knight’s Tour program"),
  // these last two examples don't yet compile properly :(
  // example("Logic", "TuringMachines", "Turing machine simulator"),
  // example("Logic", "Syllogisms", "Syllogism testing program")
] as const;
