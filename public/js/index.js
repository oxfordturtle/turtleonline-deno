(() => {
  // client/constants/languages.ts
  var languages = [
    "BASIC",
    "C",
    "Java",
    "Pascal",
    "Python",
    "TypeScript"
  ];
  var extensions = {
    "BASIC": "tbas",
    "C": "tc",
    "Java": "tjav",
    "Pascal": "tpas",
    "Python": "tpy",
    "TypeScript": "tts"
  };

  // client/state/file.ts
  var File = class {
    constructor(language2, example = null) {
      this.language = language2;
      this.example = example;
      this.name = "";
      this.code = "";
      this.backup = "";
      this.compiled = false;
      this.edited = false;
    }
    get extension() {
      return extensions[this.language];
    }
    get filename() {
      return `${this.name || "filename"}.${this.extension}`;
    }
  };
  var skeletons = {
    BASIC: "var1% = 100\nCOLOUR(GREEN)\nBLOT(var1%)\nEND",
    C: "void main () {\n  int var1 = 100;\n  colour(green);\n  blot(var1);\n}",
    Java: "class ProgramName {\n  void main () {\n    int var1 = 100;\n    colour(green);\n    blot(var1);\n  }\n}",
    Pascal: "PROGRAM programName;\nVAR var1: integer;\nBEGIN\n  var1 := 100;\n  colour(green);\n  blot(var1)\nEND.",
    Python: "var1: int = 100\ncolour(green)\nblot(var1)",
    TypeScript: "var var1 = 100;\ncolour(green);\nblot(var1);"
  };

  // client/constants/properties.ts
  var defaults = {
    "savedSettingsHaveBeenLoaded": false,
    "language": "Pascal",
    "mode": "normal",
    "editorFontFamily": "Courier",
    "editorFontSize": 13,
    "outputFontFamily": "Courier",
    "outputFontSize": 13,
    "includeCommentsInExamples": true,
    "loadCorrespondingExample": true,
    "assembler": true,
    "decimal": true,
    "autoCompileOnLoad": false,
    "autoRunOnLoad": false,
    "autoFormatOnLoad": false,
    "alwaysSaveSettings": false,
    "commandsCategoryIndex": 0,
    "showSimpleCommands": true,
    "showIntermediateCommands": false,
    "showAdvancedCommands": false,
    "files": [],
    "currentFileIndex": 0,
    "filename": "",
    "lexemes": [],
    "usage": [],
    "routines": [],
    "pcode": [],
    "showCanvasOnRun": true,
    "showOutputOnWrite": false,
    "showMemoryOnDump": true,
    "drawCountMax": 4,
    "codeCountMax": 1e5,
    "smallSize": 60,
    "stackSize": 5e4,
    "traceOnRun": false,
    "activateHCLR": true,
    "preventStackCollision": true,
    "rangeCheckArrays": true,
    "canvasStartSize": 1e3,
    "setupDefaultKeyBuffer": true,
    "turtleAttributesAsGlobals": true,
    "initialiseLocals": true,
    "allowCSTR": true,
    "separateReturnStack": true,
    "separateMemoryControlStack": true,
    "separateSubroutineRegisterStack": true
  };

  // client/state/storage.ts
  function load(property) {
    const fromStorage = sessionStorage.getItem(property);
    return fromStorage !== null ? JSON.parse(fromStorage) : defaults[property];
  }
  function save(property, value) {
    sessionStorage.setItem(property, JSON.stringify(value));
  }

  // client/constants/examples.ts
  var Example = class {
    constructor(groupId, id, names) {
      this.groupId = groupId;
      this.id = id;
      this.names = typeof names === "string" ? { BASIC: names, C: names, Java: names, Pascal: names, Python: names, TypeScript: names } : names;
    }
  };
  var Group = class {
    constructor(index, id, title) {
      this.index = index;
      this.id = id;
      this.title = title;
      this.examples = examples.filter((x) => x.groupId === id);
    }
  };
  var examples = [
    new Example("CSAC", "LifeStart", "Initialising Conway\u2019s Game of Life"),
    new Example("CSAC", "Mandelbrot", "Mandelbrot set"),
    new Example("CSAC", "MandelbrotMini", "Mandelbrot mini"),
    new Example("CSAC", "MandelbrotSpectrum", "Mandelbrot spectrum"),
    new Example("CSAC", "MandelbrotMiniSpectrum", "Mandelbrot mini spectrum"),
    new Example("CSAC", "SierpinskiColour", "Sierpinski colour"),
    new Example("CSAC", "SierpinskiIFS", "Sierpinski IFS"),
    new Example("CSAC", "BarnsleyColour", "Barnsley colour"),
    new Example("CSAC", "BarnsleyIFS", "Barnsley IFS"),
    new Example("CSAC", "DragonColour", "Dragon colour"),
    new Example("CSAC", "DragonIFS", "Dragon IFS"),
    new Example("CSAC", "TreeIFS", "Tree IFS"),
    new Example("CASC", "WaveSuperposer", "Hugh Wallis\u2019s wave superposer"),
    new Example("Drawing", "DrawPause", "Simple drawing with pauses"),
    new Example("Drawing", "SmileyFace", "Smiley face (using PENUP and ELLBLOT)"),
    new Example("Drawing", "ThePlough", "The plough (using SETXY and POLYLINE)"),
    new Example("Drawing", "OlympicRings", "Olympic rings (using a variable)"),
    new Example("Drawing", "ForLoop", "FOR (counting) loop"),
    new Example("Drawing", "TriangleSpin", "Spinning triangle pattern"),
    new Example("Drawing", "Circles", "Circling circles"),
    new Example("Drawing", "NestedLoops", "Nested FOR loops"),
    new Example("Drawing", "RandomLines", "Random lines pattern"),
    new Example("Drawing", "RandomEllipses", "Random ellipses pattern"),
    new Example("Procedures", "ColourSpiral", "Spiral of colours (simple PCODE)"),
    new Example("Procedures", "SimpleProc", "Simple procedure (using REPEAT)"),
    new Example("Procedures", "ParameterProc", "Procedure with parameter"),
    new Example("Procedures", "ResizableFace", "Resizable face (nested procedures)"),
    new Example("Procedures", "Polygons", "Polygons (two parameters)"),
    new Example("Procedures", "Stars", "Stars (using ANGLES and FORGET)"),
    new Example("Procedures", "PolygonRings", "Polygon rings (three parameters)"),
    new Example("Procedures", "Triangle1", "Simple triangle"),
    new Example("Procedures", "Triangle2", "Triangle procedure"),
    new Example("Procedures", "Triangle3", "Triangle procedure with limit"),
    new Example("Procedures", "Triangles", "Recursive triangles"),
    new Example("Procedures", "Factorials", "Recursive factorials"),
    new Example("Further", "YouAreHere", "Text and arrow (using PRINT)"),
    new Example("Further", "CycleColours", "Cycling colours (using MOD)"),
    new Example("Further", "Clock", "Analogue clock (using REPEAT)"),
    new Example("Further", "DigitalClock", "Digital clock (using IF and WHILE)"),
    new Example("Further", "Flashlights", "Flashlights (using Booleans)"),
    new Example("Further", "RefParams", "Reference parameters"),
    new Example("Further", "Balls3D", "3D colour effects"),
    new Example("Further", "StringFunctions", "Standard string functions"),
    new Example("Further", "UserStringFunctions", "User-defined string functions"),
    new Example("Further", "MathFunctions", "Mathematical functions"),
    new Example("Further", "TrigGraphs", "Trigonometric graphs"),
    new Example("Movement", "MovingBall", "Moving ball (using variables)"),
    new Example("Movement", "BouncingBall", "Bouncing ball (using variables)"),
    new Example("Movement", "TurtleMove", "Moving ball (using Turtle)"),
    new Example("Movement", "TurtleBounce", "Bouncing ball (using Turtle)"),
    new Example("Movement", "BouncingFace", "Bouncing face"),
    new Example("Movement", "MultiBounce", "Multiple bouncing balls"),
    new Example("Movement", "BouncingTriangle", "Bouncing triangle"),
    new Example("Movement", "BouncingShapes", "Multiple bouncing shapes"),
    new Example("Movement", "GravitySteps", "Movement under gravity"),
    new Example("Movement", "SolarSystem", "Solar system"),
    new Example("Interaction", "AskInput", "Asking for typed input"),
    new Example("Interaction", "QuickClick", "Mouse reaction game"),
    new Example("Interaction", "TypingTest", "Typing test (checking characters)"),
    new Example("Interaction", "TypingTestKeys", "Typing test (checking keys)"),
    new Example("Interaction", "IterationGame", "Iteration game (Collatz sequence)"),
    new Example("Interaction", "SpongeThrow", "Throwing sponges at a moving face"),
    new Example("Interaction", "Arcade", "Arcade shooting game"),
    new Example("Interaction", "SnakeGame", "Snake (classic game)"),
    new Example("Interaction", "SimpleDraw", "Drawing to the mouse"),
    new Example("Interaction", "PaintApp", "Painting application"),
    new Example("Interaction", "MultipleTurtles", "Multiple turtles and varying ANGLES"),
    new Example("Files", "WriteAndReadFile", "Writing and reading a text file"),
    new Example("Files", "RenameAndDeleteFile", "Renaming and deleting a file"),
    new Example("Files", "FileSearching", "File searching"),
    new Example("Files", "SaveCSV", "Saving a CSV file"),
    new Example("Files", "ReadCSV", "Reading a CSV file"),
    new Example("Files", "RandomSentences", "Random sentences (using files)"),
    new Example("Files", "FileCommands", "File commands"),
    new Example("Files", "DirectoryCommands", "Directory commands"),
    new Example("Cellular", "Disease", "Spread of disease"),
    new Example("Cellular", "TippingPoint", "Tipping point (city epidemic)"),
    new Example("Cellular", "GameOfLife", "Conway\u2019s Game of Life"),
    new Example("Cellular", "LifeArrays", "Game of Life, using arrays"),
    new Example("Cellular", "Automata", "One-dimensional cellular automata"),
    new Example("Cellular", "Diffusion", "A model of diffusion"),
    new Example("Cellular", "Dendrites", "Dendritic crystal growth"),
    new Example("Cellular", "Schelling", "Schelling\u2019s segregation model"),
    new Example("Cellular", "IteratedPD", "Iterated Prisoner\u2019s Dilemma"),
    new Example("Models", "AimCannon", "Firing a cannon (manual)"),
    new Example("Models", "AutoCannon", "Firing a cannon (automatic)"),
    new Example("Models", "Launch", "Launching a rocket into orbit"),
    new Example("Models", "BrownianMotion", "Brownian motion"),
    new Example("Models", "Cheetahs", "Cheetahs and gazelles"),
    new Example("Models", "SexRatio", "The sex ratio"),
    new Example("Models", "Flocking", "Flocking behaviour"),
    new Example("Models", "Roads", "Town road simulation"),
    new Example("Models", "Interference", "Wave interference tutor"),
    new Example("Models", "TwoSlits", "Interference from two slits"),
    new Example("Fractals", "RecursionFactory", "Recursion factory"),
    new Example("Fractals", "RecursiveTree", "Recursive tree"),
    new Example("Fractals", "KochSnowflake", "Koch snowflake"),
    new Example("Fractals", "SquareKoch", "Square Koch fractal curves"),
    new Example("Fractals", "Sierpinski", "Sierpinski triangle (by deletion)"),
    new Example("Fractals", "SierpinskiDots", "Sierpinski triangle (by random dots)"),
    new Example("Fractals", "IFSBackground", "Iterated function systems (IFS) background"),
    new Example("Fractals", "IFSColour", "IFS mappings on coloured background"),
    new Example("Fractals", "IFSDemonstrator", "IFS demonstrator program"),
    new Example("Fractals", "Logistic", "Logistic equation"),
    new Example("Fractals", "LogisticSpider", "Logistic spider"),
    new Example("Fractals", "MandelbrotDemo", "Mandelbrot multi-colour"),
    new Example("Fractals", "MandelbrotSpectrumDemo", "Mandelbrot spectral colours"),
    new Example("Fractals", "Quine", "Quine (self-replicating) program"),
    new Example("Logic&CS", "Hanoi", "Tower of Hanoi by recursion"),
    new Example("Logic&CS", "IterateRoot", "Square roots by iteration"),
    new Example("Logic&CS", "Fibonaccis", "Fibonaccis (using ARRAY and TIME)"),
    new Example("Logic&CS", "Sorting", "Comparison of sorting methods"),
    new Example("Logic&CS", "SortingStrings", "Comparison of sorting methods (strings)"),
    new Example("Logic&CS", "NoughtsAndCrosses", "Noughts and crosses"),
    new Example("Logic&CS", "NimLearn", "Nim learning program"),
    new Example("Logic&CS", "MultiNim", "Nim with multiple piles"),
    new Example("Logic&CS", "KnightsTour", "Knight\u2019s Tour program")
  ];
  var groups = [
    new Group(0, "CSAC", "other CSAC programs"),
    new Group(1, "Drawing", "drawing and counting loops"),
    new Group(2, "Procedures", "procedures and simple recursion"),
    new Group(3, "Further", "further commands and structures"),
    new Group(4, "Movement", "smooth movement and bouncing"),
    new Group(5, "Interaction", "user input, interaction and games"),
    new Group(6, "Cellular", "cellular models"),
    new Group(7, "Models", "other models"),
    new Group(8, "Fractals", "self-similarity and chaos"),
    new Group(9, "Logic&CS", "computer science and logic")
  ];

  // client/tools/elements.ts
  function element(type8, options2 = {}) {
    const element2 = document.createElement(type8);
    for (const [key, value] of Object.entries(options2)) {
      switch (key) {
        case "content":
          if (Array.isArray(value) || typeof value === "string") {
            fill(element2, value);
          }
          break;
        case "className":
          if (typeof value === "string") {
            for (const className of value.split(" ")) {
              element2.classList.add(className);
            }
          }
          break;
        case "value":
          if (typeof value === "string") {
            element2.value = value;
          }
          break;
        case "on":
          if (Array.isArray(value)) {
            element2.addEventListener(value[0], value[1]);
          }
          break;
        default:
          if (typeof value === "string") {
            element2.setAttribute(key, value);
          }
          break;
      }
    }
    return element2;
  }
  function fill(element2, content) {
    if (Array.isArray(content)) {
      const fragment2 = document.createDocumentFragment();
      for (const element3 of content) {
        fragment2.appendChild(element3);
      }
      while (element2.firstChild) {
        element2.removeChild(element2.firstChild);
      }
      element2.appendChild(fragment2);
    } else {
      element2.innerHTML = content;
    }
  }
  function fragment(content) {
    const fragment2 = document.createDocumentFragment();
    fill(fragment2, content);
    return fragment2;
  }
  function div(options2 = {}) {
    return element("div", options2);
  }
  function li(options2 = {}) {
    return element("li", options2);
  }
  function a(options2 = {}) {
    return element("a", options2);
  }
  function code(options2 = {}) {
    return element("code", options2);
  }
  function i(options2 = {}) {
    return element("i", options2);
  }
  function span(options2 = {}) {
    return element("span", options2);
  }
  function td(options2 = {}) {
    return element("td", options2);
  }
  function th(options2 = {}) {
    return element("th", options2);
  }
  function tr(options2 = {}) {
    return element("tr", options2);
  }
  function input(options2 = {}) {
    return element("input", options2);
  }
  function option(options2 = {}) {
    return element("option", options2);
  }

  // client/tools/error.ts
  var SystemError = class extends Error {
    constructor(message) {
      super(message);
    }
  };
  var MachineError = class extends Error {
    constructor(message) {
      super(message);
    }
  };
  var CompilerError = class extends Error {
    constructor(message, token = null) {
      if (token) {
        message = message.replace("{lex}", `"${token.content}"`);
        message += ` ("${token.content}", line ${token.line}, index ${token.character})`;
      }
      super(message);
      this.token = token;
    }
  };

  // client/tools/hub.ts
  var replies = {};
  function on(message, callback) {
    if (replies[message]) {
      replies[message].push(callback);
    } else {
      replies[message] = [callback];
    }
  }
  function send(message, data = null) {
    if (replies[message]) {
      for (const reply of replies[message]) {
        reply(data);
      }
    }
    if (message === "currentFileIndexChanged") {
      send("filenameChanged");
      send("codeChanged");
    }
  }

  // client/machine/memory.ts
  var main = [];
  var keys = [];
  var query = [];
  var coords = [];
  var stack = [];
  var memoryStack = [];
  var returnStack = [];
  var subroutineStack = [];
  var stackTop = 0;
  var heapGlobal = 0;
  var heapBase = 0;
  var heapTemp = 0;
  var heapPerm = 0;
  var heapMax = 0;
  var heapClearPending = false;
  var turtxIndex = 1;
  var turtyIndex = 2;
  var turtdIndex = 3;
  var turtaIndex = 4;
  var turttIndex = 5;
  var turtcIndex = 6;
  function init(options2) {
    main.length = 2097152;
    keys.length = 256;
    query.length = 16;
    main.fill(0);
    keys.fill(-1);
    query.fill(-1);
    coords.length = 0;
    stack.length = 0;
    memoryStack.length = 0;
    returnStack.length = 0;
    subroutineStack.length = 0;
    stackTop = 0;
    heapGlobal = -1;
    heapBase = options2.stackSize - 1;
    heapTemp = heapBase;
    heapPerm = heapTemp;
    heapMax = heapTemp;
  }
  function peek(address) {
    return main[address];
  }
  function peekAddressOffset(address, offset) {
    return main[main[address] + offset];
  }
  function pokeAddressOffset(address, offset, value) {
    main[main[address] + offset] = value;
  }
  function getTurtX() {
    return peekAddressOffset(0, turtxIndex);
  }
  function getTurtY() {
    return peekAddressOffset(0, turtyIndex);
  }
  function getTurtD() {
    return peekAddressOffset(0, turtdIndex);
  }
  function getTurtA() {
    return peekAddressOffset(0, turtaIndex);
  }
  function getTurtT() {
    return peekAddressOffset(0, turttIndex);
  }
  function getTurtC() {
    return peekAddressOffset(0, turtcIndex);
  }
  function setTurtX(turtx2) {
    pokeAddressOffset(0, turtxIndex, turtx2);
  }
  function setTurtY(turty2) {
    pokeAddressOffset(0, turtyIndex, turty2);
  }
  function setTurtD(turtd) {
    pokeAddressOffset(0, turtdIndex, turtd);
  }
  function setTurtA(turta) {
    pokeAddressOffset(0, turtaIndex, turta);
  }
  function setTurtT(turtt2) {
    pokeAddressOffset(0, turttIndex, turtt2);
  }
  function setTurtC(turtc) {
    pokeAddressOffset(0, turtcIndex, turtc);
  }
  function getHeapGlobal() {
    return heapGlobal;
  }
  function setHeapGlobal(value) {
    heapGlobal = value;
  }
  function getHeapPerm() {
    return heapPerm;
  }
  function setStackTop(value) {
    stackTop = Math.max(value, stackTop);
  }
  function getHeapTemp() {
    return heapTemp;
  }
  function setHeapTemp(value) {
    heapTemp = value;
  }
  function setHeapMax(value) {
    Math.max(value, heapMax);
  }
  function heapFix() {
    heapPerm = heapTemp;
  }
  function heapClear() {
    if (stack.length === 0) {
      heapTemp = heapPerm;
    } else {
      heapClearPending = true;
    }
  }
  function delayedHeapClear() {
    if (heapClearPending) {
      heapClearPending = false;
      heapClear();
    }
  }
  function heapReset() {
    if (heapGlobal > -1) {
      heapTemp = heapGlobal;
      heapPerm = heapGlobal;
    }
  }
  function makeHeapString(string2) {
    const stringArray = Array.from(string2).map((c2) => c2.charCodeAt(0));
    stack.push(heapTemp + 1);
    heapTemp += 1;
    main[heapTemp] = string2.length;
    for (const code3 of stringArray) {
      heapTemp += 1;
      main[heapTemp] = code3;
    }
    heapMax = Math.max(heapTemp, heapMax);
  }
  function getHeapString(address) {
    const length = main[address];
    const start = address + 1;
    const charArray = main.slice(start, start + length);
    const string2 = charArray.map((c2) => String.fromCharCode(c2)).join("");
    if (address + length + 1 > heapPerm) {
      heapTemp = address + length;
    }
    return string2;
  }
  function zero(start, length) {
    if (length > 0) {
      main[start] = 0;
      zero(start + 1, length - 1);
    }
  }
  function copy(source, target, length) {
    if (length > 0) {
      main[target] = main[source];
      copy(source + 1, target + 1, length - 1);
    }
  }
  function dump() {
    const stack2 = main.slice(0, stackTop + 1);
    const heap = main.slice(heapBase + 1, heapMax + 1);
    return { stack: stack2, heap, heapBase: heapBase + 1 };
  }

  // client/machine/options.ts
  var defaultOptions = {
    showCanvasOnRun: defaults.showCanvasOnRun,
    showOutputOnWrite: defaults.showOutputOnWrite,
    showMemoryOnDump: defaults.showMemoryOnDump,
    drawCountMax: defaults.drawCountMax,
    codeCountMax: defaults.codeCountMax,
    smallSize: defaults.smallSize,
    stackSize: defaults.stackSize,
    traceOnRun: defaults.traceOnRun,
    activateHCLR: defaults.activateHCLR,
    preventStackCollision: defaults.preventStackCollision,
    rangeCheckArrays: defaults.rangeCheckArrays
  };

  // client/machine/misc.ts
  function mixBytes(byte1, byte2, proportion1, proportion2) {
    return Math.round((byte1 * proportion1 + byte2 * proportion2) / (proportion1 + proportion2));
  }

  // client/constants/colours.ts
  var Colour = class {
    constructor(index, name, value, dark) {
      this.index = index;
      this.names = { BASIC: name.toUpperCase(), C: name, Java: name, Pascal: name, Python: name, TypeScript: name };
      this.type = "integer";
      this.value = value;
      this.hex = value.toString(16).padStart(6, "0").toUpperCase();
      this.text = dark ? "white" : "black";
    }
  };
  var colours = [
    new Colour(1, "green", 2263842, true),
    new Colour(2, "red", 16711680, true),
    new Colour(3, "blue", 255, true),
    new Colour(4, "yellow", 16776960, false),
    new Colour(5, "violet", 9055202, true),
    new Colour(6, "lime", 65280, false),
    new Colour(7, "orange", 16755200, false),
    new Colour(8, "skyblue", 45311, true),
    new Colour(9, "brown", 9849600, true),
    new Colour(10, "pink", 15602313, true),
    new Colour(11, "darkgreen", 25600, true),
    new Colour(12, "darkred", 11674146, true),
    new Colour(13, "darkblue", 128, true),
    new Colour(14, "ochre", 12628016, true),
    new Colour(15, "indigo", 4915330, true),
    new Colour(16, "olive", 8421376, true),
    new Colour(17, "orangered", 16737792, true),
    new Colour(18, "teal", 32896, true),
    new Colour(19, "darkbrown", 6045747, true),
    new Colour(20, "magenta", 16711935, true),
    new Colour(21, "lightgreen", 10025880, false),
    new Colour(22, "lightred", 13458524, true),
    new Colour(23, "lightblue", 10075135, false),
    new Colour(24, "cream", 16777147, false),
    new Colour(25, "lilac", 11572223, true),
    new Colour(26, "yellowgreen", 11193395, false),
    new Colour(27, "peach", 16764080, false),
    new Colour(28, "cyan", 65535, false),
    new Colour(29, "lightbrown", 11567184, true),
    new Colour(30, "lightpink", 16758465, false),
    new Colour(31, "seagreen", 3978097, true),
    new Colour(32, "maroon", 8388608, true),
    new Colour(33, "royal", 4286945, true),
    new Colour(34, "gold", 16762880, false),
    new Colour(35, "purple", 8388736, true),
    new Colour(36, "emerald", 51543, true),
    new Colour(37, "salmon", 16416882, true),
    new Colour(38, "turquoise", 48833, true),
    new Colour(39, "coffee", 9596735, true),
    new Colour(40, "rose", 16746666, true),
    new Colour(41, "greengrey", 7377008, true),
    new Colour(42, "redgrey", 11567232, true),
    new Colour(43, "bluegrey", 8421536, true),
    new Colour(44, "yellowgrey", 9474160, true),
    new Colour(45, "darkgrey", 4210752, true),
    new Colour(46, "midgrey", 8421504, true),
    new Colour(47, "lightgrey", 10526880, true),
    new Colour(48, "silver", 12632256, false),
    new Colour(49, "white", 16777215, false),
    new Colour(50, "black", 0, true)
  ];

  // client/constants/pcodes.ts
  var PCode = /* @__PURE__ */ ((PCode2) => {
    PCode2[PCode2["null"] = 0] = "null";
    PCode2[PCode2["dupl"] = 1] = "dupl";
    PCode2[PCode2["swap"] = 2] = "swap";
    PCode2[PCode2["rota"] = 3] = "rota";
    PCode2[PCode2["incr"] = 4] = "incr";
    PCode2[PCode2["decr"] = 5] = "decr";
    PCode2[PCode2["mxin"] = 6] = "mxin";
    PCode2[PCode2["rand"] = 7] = "rand";
    PCode2[PCode2["hstr"] = 8] = "hstr";
    PCode2[PCode2["ctos"] = 9] = "ctos";
    PCode2[PCode2["sasc"] = 10] = "sasc";
    PCode2[PCode2["itos"] = 11] = "itos";
    PCode2[PCode2["hexs"] = 12] = "hexs";
    PCode2[PCode2["sval"] = 13] = "sval";
    PCode2[PCode2["qtos"] = 14] = "qtos";
    PCode2[PCode2["qval"] = 15] = "qval";
    PCode2[PCode2["not"] = 16] = "not";
    PCode2[PCode2["and"] = 17] = "and";
    PCode2[PCode2["or"] = 18] = "or";
    PCode2[PCode2["xor"] = 19] = "xor";
    PCode2[PCode2["andl"] = 20] = "andl";
    PCode2[PCode2["orl"] = 21] = "orl";
    PCode2[PCode2["shft"] = 22] = "shft";
    PCode2[PCode2["neg"] = 23] = "neg";
    PCode2[PCode2["abs"] = 24] = "abs";
    PCode2[PCode2["sign"] = 25] = "sign";
    PCode2[PCode2["plus"] = 26] = "plus";
    PCode2[PCode2["subt"] = 27] = "subt";
    PCode2[PCode2["mult"] = 28] = "mult";
    PCode2[PCode2["divr"] = 29] = "divr";
    PCode2[PCode2["div"] = 30] = "div";
    PCode2[PCode2["mod"] = 31] = "mod";
    PCode2[PCode2["eqal"] = 32] = "eqal";
    PCode2[PCode2["noeq"] = 33] = "noeq";
    PCode2[PCode2["less"] = 34] = "less";
    PCode2[PCode2["more"] = 35] = "more";
    PCode2[PCode2["lseq"] = 36] = "lseq";
    PCode2[PCode2["mreq"] = 37] = "mreq";
    PCode2[PCode2["maxi"] = 38] = "maxi";
    PCode2[PCode2["mini"] = 39] = "mini";
    PCode2[PCode2["seql"] = 40] = "seql";
    PCode2[PCode2["sneq"] = 41] = "sneq";
    PCode2[PCode2["sles"] = 42] = "sles";
    PCode2[PCode2["smor"] = 43] = "smor";
    PCode2[PCode2["sleq"] = 44] = "sleq";
    PCode2[PCode2["smeq"] = 45] = "smeq";
    PCode2[PCode2["smax"] = 46] = "smax";
    PCode2[PCode2["smin"] = 47] = "smin";
    PCode2[PCode2["divm"] = 48] = "divm";
    PCode2[PCode2["sqrt"] = 49] = "sqrt";
    PCode2[PCode2["hyp"] = 50] = "hyp";
    PCode2[PCode2["root"] = 51] = "root";
    PCode2[PCode2["powr"] = 52] = "powr";
    PCode2[PCode2["log"] = 53] = "log";
    PCode2[PCode2["alog"] = 54] = "alog";
    PCode2[PCode2["ln"] = 55] = "ln";
    PCode2[PCode2["exp"] = 56] = "exp";
    PCode2[PCode2["sin"] = 57] = "sin";
    PCode2[PCode2["cos"] = 58] = "cos";
    PCode2[PCode2["tan"] = 59] = "tan";
    PCode2[PCode2["asin"] = 60] = "asin";
    PCode2[PCode2["acos"] = 61] = "acos";
    PCode2[PCode2["atan"] = 62] = "atan";
    PCode2[PCode2["pi"] = 63] = "pi";
    PCode2[PCode2["scat"] = 64] = "scat";
    PCode2[PCode2["slen"] = 65] = "slen";
    PCode2[PCode2["case"] = 66] = "case";
    PCode2[PCode2["copy"] = 67] = "copy";
    PCode2[PCode2["dels"] = 68] = "dels";
    PCode2[PCode2["inss"] = 69] = "inss";
    PCode2[PCode2["poss"] = 70] = "poss";
    PCode2[PCode2["repl"] = 71] = "repl";
    PCode2[PCode2["spad"] = 72] = "spad";
    PCode2[PCode2["trim"] = 73] = "trim";
    PCode2[PCode2["home"] = 80] = "home";
    PCode2[PCode2["setx"] = 81] = "setx";
    PCode2[PCode2["sety"] = 82] = "sety";
    PCode2[PCode2["setd"] = 83] = "setd";
    PCode2[PCode2["angl"] = 84] = "angl";
    PCode2[PCode2["thik"] = 85] = "thik";
    PCode2[PCode2["pen"] = 86] = "pen";
    PCode2[PCode2["colr"] = 87] = "colr";
    PCode2[PCode2["toxy"] = 88] = "toxy";
    PCode2[PCode2["mvxy"] = 89] = "mvxy";
    PCode2[PCode2["drxy"] = 90] = "drxy";
    PCode2[PCode2["fwrd"] = 91] = "fwrd";
    PCode2[PCode2["back"] = 92] = "back";
    PCode2[PCode2["left"] = 93] = "left";
    PCode2[PCode2["rght"] = 94] = "rght";
    PCode2[PCode2["turn"] = 95] = "turn";
    PCode2[PCode2["blnk"] = 96] = "blnk";
    PCode2[PCode2["rcol"] = 97] = "rcol";
    PCode2[PCode2["fill"] = 98] = "fill";
    PCode2[PCode2["pixc"] = 99] = "pixc";
    PCode2[PCode2["pixs"] = 100] = "pixs";
    PCode2[PCode2["rgb"] = 101] = "rgb";
    PCode2[PCode2["mixc"] = 102] = "mixc";
    PCode2[PCode2["rmbr"] = 103] = "rmbr";
    PCode2[PCode2["frgt"] = 104] = "frgt";
    PCode2[PCode2["poly"] = 105] = "poly";
    PCode2[PCode2["pfil"] = 106] = "pfil";
    PCode2[PCode2["circ"] = 107] = "circ";
    PCode2[PCode2["blot"] = 108] = "blot";
    PCode2[PCode2["elps"] = 109] = "elps";
    PCode2[PCode2["eblt"] = 110] = "eblt";
    PCode2[PCode2["box"] = 111] = "box";
    PCode2[PCode2["ldin"] = 112] = "ldin";
    PCode2[PCode2["ldvg"] = 113] = "ldvg";
    PCode2[PCode2["ldvv"] = 114] = "ldvv";
    PCode2[PCode2["ldvr"] = 115] = "ldvr";
    PCode2[PCode2["ldag"] = 116] = "ldag";
    PCode2[PCode2["ldav"] = 117] = "ldav";
    PCode2[PCode2["lstr"] = 118] = "lstr";
    PCode2[PCode2["stvg"] = 119] = "stvg";
    PCode2[PCode2["stvv"] = 120] = "stvv";
    PCode2[PCode2["stvr"] = 121] = "stvr";
    PCode2[PCode2["lptr"] = 122] = "lptr";
    PCode2[PCode2["sptr"] = 123] = "sptr";
    PCode2[PCode2["zptr"] = 124] = "zptr";
    PCode2[PCode2["cptr"] = 125] = "cptr";
    PCode2[PCode2["cstr"] = 126] = "cstr";
    PCode2[PCode2["test"] = 127] = "test";
    PCode2[PCode2["jump"] = 128] = "jump";
    PCode2[PCode2["ifno"] = 129] = "ifno";
    PCode2[PCode2["halt"] = 130] = "halt";
    PCode2[PCode2["subr"] = 131] = "subr";
    PCode2[PCode2["retn"] = 132] = "retn";
    PCode2[PCode2["pssr"] = 133] = "pssr";
    PCode2[PCode2["plsr"] = 134] = "plsr";
    PCode2[PCode2["psrj"] = 135] = "psrj";
    PCode2[PCode2["plrj"] = 136] = "plrj";
    PCode2[PCode2["ldmt"] = 137] = "ldmt";
    PCode2[PCode2["stmt"] = 138] = "stmt";
    PCode2[PCode2["memc"] = 139] = "memc";
    PCode2[PCode2["memr"] = 140] = "memr";
    PCode2[PCode2["hfix"] = 141] = "hfix";
    PCode2[PCode2["hclr"] = 142] = "hclr";
    PCode2[PCode2["hrst"] = 143] = "hrst";
    PCode2[PCode2["canv"] = 144] = "canv";
    PCode2[PCode2["reso"] = 145] = "reso";
    PCode2[PCode2["udat"] = 146] = "udat";
    PCode2[PCode2["seed"] = 147] = "seed";
    PCode2[PCode2["trac"] = 152] = "trac";
    PCode2[PCode2["memw"] = 153] = "memw";
    PCode2[PCode2["dump"] = 154] = "dump";
    PCode2[PCode2["peek"] = 155] = "peek";
    PCode2[PCode2["poke"] = 156] = "poke";
    PCode2[PCode2["inpt"] = 160] = "inpt";
    PCode2[PCode2["iclr"] = 161] = "iclr";
    PCode2[PCode2["bufr"] = 162] = "bufr";
    PCode2[PCode2["read"] = 163] = "read";
    PCode2[PCode2["rdln"] = 164] = "rdln";
    PCode2[PCode2["kech"] = 165] = "kech";
    PCode2[PCode2["outp"] = 166] = "outp";
    PCode2[PCode2["cons"] = 167] = "cons";
    PCode2[PCode2["prnt"] = 168] = "prnt";
    PCode2[PCode2["writ"] = 169] = "writ";
    PCode2[PCode2["newl"] = 170] = "newl";
    PCode2[PCode2["curs"] = 171] = "curs";
    PCode2[PCode2["time"] = 172] = "time";
    PCode2[PCode2["tset"] = 173] = "tset";
    PCode2[PCode2["wait"] = 174] = "wait";
    PCode2[PCode2["tdet"] = 175] = "tdet";
    PCode2[PCode2["chdr"] = 176] = "chdr";
    PCode2[PCode2["file"] = 177] = "file";
    PCode2[PCode2["diry"] = 178] = "diry";
    PCode2[PCode2["open"] = 179] = "open";
    PCode2[PCode2["clos"] = 180] = "clos";
    PCode2[PCode2["fbeg"] = 181] = "fbeg";
    PCode2[PCode2["eof"] = 182] = "eof";
    PCode2[PCode2["eoln"] = 183] = "eoln";
    PCode2[PCode2["frds"] = 184] = "frds";
    PCode2[PCode2["frln"] = 185] = "frln";
    PCode2[PCode2["fwrs"] = 186] = "fwrs";
    PCode2[PCode2["fwln"] = 187] = "fwln";
    PCode2[PCode2["ffnd"] = 188] = "ffnd";
    PCode2[PCode2["fdir"] = 189] = "fdir";
    PCode2[PCode2["fnxt"] = 190] = "fnxt";
    PCode2[PCode2["fmov"] = 191] = "fmov";
    PCode2[PCode2["dopr"] = 224] = "dopr";
    PCode2[PCode2["fopr"] = 225] = "fopr";
    PCode2[PCode2["ilin"] = 226] = "ilin";
    PCode2[PCode2["lefs"] = 227] = "lefs";
    PCode2[PCode2["newt"] = 228] = "newt";
    PCode2[PCode2["oldt"] = 229] = "oldt";
    PCode2[PCode2["rgts"] = 230] = "rgts";
    PCode2[PCode2["rndc"] = 231] = "rndc";
    PCode2[PCode2["svd0"] = 232] = "svd0";
    PCode2[PCode2["wrln"] = 233] = "wrln";
    return PCode2;
  })(PCode || {});
  function pcodeArgs(pcode2) {
    switch (pcode2) {
      case 118 /* lstr */:
        return -1;
      case 112 /* ldin */:
      case 113 /* ldvg */:
      case 116 /* ldag */:
      case 119 /* stvg */:
      case 128 /* jump */:
      case 129 /* ifno */:
      case 131 /* subr */:
      case 133 /* pssr */:
      case 140 /* memr */:
        return 1;
      case 114 /* ldvv */:
      case 115 /* ldvr */:
      case 117 /* ldav */:
      case 120 /* stvv */:
      case 121 /* stvr */:
      case 139 /* memc */:
        return 2;
      default:
        return 0;
    }
  }

  // client/tools/hex.ts
  function hex(colour2) {
    return `#${padded(colour2.toString(16))}`;
  }
  function padded(string2) {
    return string2.length < 6 ? padded(`0${string2}`) : string2;
  }

  // client/machine/index.ts
  var canvas = document.createElement("canvas");
  var context = document.createElement("canvas").getContext("2d");
  var running = false;
  var paused = false;
  var pcode = [];
  var line = 0;
  var code2 = 0;
  var options = defaultOptions;
  var startx = 0;
  var starty = 0;
  var sizex = 1e3;
  var sizey = 1e3;
  var width = 1e3;
  var height = 1e3;
  var doubled = false;
  var detectKeycode = 0;
  var detectTimeoutID = 0;
  var readlineTimeoutID = 0;
  var startTime = 0;
  var update = false;
  var keyecho = false;
  var seed = 0;
  function setCanvasAndContext(can, con) {
    canvas = can;
    context = con;
  }
  function reset() {
    startx = 0;
    starty = 0;
    sizex = 1e3;
    sizey = 1e3;
    width = 1e3;
    height = 1e3;
    doubled = false;
    send("resolution", { width: 1e3, height: 1e3 });
    send("console", { clear: true, colour: "#FFFFFF" });
    send("output", { clear: true, colour: "#FFFFFF" });
    send("turtxChanged", 500);
    send("turtyChanged", 500);
    send("turtdChanged", 0);
    send("turtaChanged", 360);
    send("turttChanged", 2);
    send("turtcChanged", "#000");
    send("canvas", { startx: 0, starty: 0, sizex: 1e3, sizey: 1e3 });
  }
  function run(p, o) {
    reset();
    pcode = p;
    options = o;
    line = 0;
    code2 = 0;
    if (options.showCanvasOnRun) {
      send("selectTab", "canvas");
    }
    init(options);
    startTime = Date.now();
    update = true;
    keyecho = true;
    seed = Date.now();
    running = true;
    paused = false;
    window.addEventListener("keydown", storeKey);
    window.addEventListener("keyup", releaseKey);
    window.addEventListener("keypress", putInBuffer);
    canvas.addEventListener("contextmenu", preventDefault);
    canvas.addEventListener("mousemove", storeMouseXY);
    canvas.addEventListener("touchmove", preventDefault);
    canvas.addEventListener("touchmove", storeMouseXY);
    canvas.addEventListener("mousedown", preventDefault);
    canvas.addEventListener("mousedown", storeClickXY);
    canvas.addEventListener("touchstart", storeClickXY);
    canvas.addEventListener("mouseup", releaseClickXY);
    canvas.addEventListener("touchend", releaseClickXY);
    send("played");
    execute();
  }
  function halt() {
    if (running) {
      window.removeEventListener("keydown", storeKey);
      window.removeEventListener("keyup", releaseKey);
      window.removeEventListener("keypress", putInBuffer);
      window.removeEventListener("keyup", detect);
      window.removeEventListener("keyup", readline);
      canvas.removeEventListener("contextmenu", preventDefault);
      canvas.removeEventListener("mousemove", storeMouseXY);
      canvas.removeEventListener("touchmove", preventDefault);
      canvas.removeEventListener("touchmove", storeMouseXY);
      canvas.removeEventListener("mousedown", preventDefault);
      canvas.removeEventListener("mousedown", storeClickXY);
      canvas.removeEventListener("touchstart", storeClickXY);
      canvas.removeEventListener("mouseup", releaseClickXY);
      canvas.removeEventListener("touchend", releaseClickXY);
      send("cursor", 1);
      running = false;
      paused = false;
      send("halted");
    }
  }
  function isRunning() {
    return running;
  }
  function isPaused() {
    return paused;
  }
  function pause() {
    paused = true;
    send("paused");
  }
  function play() {
    paused = false;
    send("unpaused");
  }
  function execute() {
    if (!running) {
      return;
    }
    if (paused) {
      setTimeout(execute, 1);
      return;
    }
    window.removeEventListener("keyup", detect);
    window.removeEventListener("keyup", readline);
    delayedHeapClear();
    let drawCount = 0;
    let codeCount = 0;
    let n1;
    let n2;
    let n3;
    let n4;
    let bool1;
    let bool2;
    let s1;
    let s2;
    let s3;
    let image;
    let r;
    let g;
    let b;
    try {
      while (drawCount < options.drawCountMax && codeCount <= options.codeCountMax) {
        switch (pcode[line][code2]) {
          case 0 /* null */:
            break;
          case 1 /* dupl */:
            n1 = stack.pop();
            if (n1 !== void 0) {
              stack.push(n1, n1);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 2 /* swap */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              stack.push(n2, n1);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 3 /* rota */:
            n3 = stack.pop();
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0 && n3 !== void 0) {
              stack.push(n2, n3, n1);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 4 /* incr */:
            n1 = stack.pop();
            if (n1 !== void 0) {
              stack.push(n1 + 1);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 5 /* decr */:
            n1 = stack.pop();
            if (n1 !== void 0) {
              stack.push(n1 - 1);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 6 /* mxin */:
            stack.push(Math.pow(2, 31) - 1);
            break;
          case 7 /* rand */:
            n1 = stack.pop();
            if (n1 !== void 0) {
              n2 = Math.sin(seed++) * 1e4;
              n2 = n2 - Math.floor(n2);
              stack.push(Math.floor(n2 * Math.abs(n1)));
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 8 /* hstr */:
            n1 = stack.pop();
            if (n1 !== void 0) {
              s1 = getHeapString(n1);
              makeHeapString(s1);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 9 /* ctos */:
            n1 = stack.pop();
            if (n1 !== void 0) {
              makeHeapString(String.fromCharCode(n1));
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 10 /* sasc */:
            n1 = stack.pop();
            if (n1 !== void 0) {
              s1 = getHeapString(n1);
              if (s1.length === 0) {
                stack.push(0);
              } else {
                stack.push(s1.charCodeAt(0));
              }
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 11 /* itos */:
            n1 = stack.pop();
            if (n1 !== void 0) {
              makeHeapString(n1.toString(10));
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 12 /* hexs */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              s1 = n1.toString(16).toUpperCase();
              while (s1.length < n2) {
                s1 = "0" + s1;
              }
              makeHeapString(s1);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 13 /* sval */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              s1 = getHeapString(n1);
              if (s1[0] === "#") {
                n3 = isNaN(parseInt(s1.slice(1), 16)) ? n2 : parseInt(s1.slice(1), 16);
              } else {
                n3 = isNaN(parseInt(s1, 10)) ? n2 : parseInt(s1, 10);
              }
              stack.push(n3);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 14 /* qtos */:
            n4 = stack.pop();
            n3 = stack.pop();
            n2 = stack.pop();
            if (n2 !== void 0 && n3 !== void 0 && n4 !== void 0) {
              n1 = n2 / n3;
              makeHeapString(n1.toFixed(n4));
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 15 /* qval */:
            n3 = stack.pop();
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0 && n3 !== void 0) {
              s1 = getHeapString(n1);
              n4 = isNaN(parseFloat(s1)) ? n3 : parseFloat(s1);
              stack.push(Math.round(n4 * n2));
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 16 /* not */:
            n1 = stack.pop();
            if (n1 !== void 0) {
              stack.push(~n1);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 17 /* and */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              stack.push(n1 & n2);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 18 /* or */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              stack.push(n1 | n2);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 19 /* xor */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              stack.push(n1 ^ n2);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 20 /* andl */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              stack.push(n1 && n2);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 21 /* orl */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              stack.push(n1 || n2);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 22 /* shft */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              if (n2 < 0) {
                stack.push(n1 << -n2);
              } else {
                stack.push(n1 >> n2);
              }
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 23 /* neg */:
            n1 = stack.pop();
            if (n1 !== void 0) {
              stack.push(-n1);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 24 /* abs */:
            n1 = stack.pop();
            if (n1 !== void 0) {
              stack.push(Math.abs(n1));
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 25 /* sign */:
            n1 = stack.pop();
            if (n1 !== void 0) {
              stack.push(Math.sign(n1));
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 26 /* plus */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              stack.push(n1 + n2);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 27 /* subt */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              stack.push(n1 - n2);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 28 /* mult */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              stack.push(n1 * n2);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 29 /* divr */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              if (n2 === 0) {
                throw new MachineError("Cannot divide by zero.");
              }
              n3 = n1 / n2;
              stack.push(Math.round(n3));
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 30 /* div */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              if (n2 === 0) {
                throw new MachineError("Cannot divide by zero.");
              }
              n3 = n1 / n2;
              stack.push(n3 > 0 ? Math.floor(n3) : Math.ceil(n3));
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 31 /* mod */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              stack.push(n1 % n2);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 32 /* eqal */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              stack.push(n1 === n2 ? -1 : 0);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 33 /* noeq */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              stack.push(n1 !== n2 ? -1 : 0);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 34 /* less */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              stack.push(n1 < n2 ? -1 : 0);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 35 /* more */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              stack.push(n1 > n2 ? -1 : 0);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 36 /* lseq */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              stack.push(n1 <= n2 ? -1 : 0);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 37 /* mreq */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              stack.push(n1 >= n2 ? -1 : 0);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 38 /* maxi */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              stack.push(Math.max(n1, n2));
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 39 /* mini */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              stack.push(Math.min(n1, n2));
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 40 /* seql */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              s2 = getHeapString(n2);
              s1 = getHeapString(n1);
              stack.push(s1 === s2 ? -1 : 0);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 41 /* sneq */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              s2 = getHeapString(n2);
              s1 = getHeapString(n1);
              stack.push(s1 !== s2 ? -1 : 0);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 42 /* sles */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              s2 = getHeapString(n1);
              s1 = getHeapString(n2);
              stack.push(n1 < n2 ? -1 : 0);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 43 /* smor */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              s2 = getHeapString(n2);
              s1 = getHeapString(n1);
              stack.push(n1 > n2 ? -1 : 0);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 44 /* sleq */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              s2 = getHeapString(n2);
              s1 = getHeapString(n1);
              stack.push(s1 <= s2 ? -1 : 0);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 45 /* smeq */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              s2 = getHeapString(n2);
              s1 = getHeapString(n1);
              stack.push(s1 >= s2 ? -1 : 0);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 46 /* smax */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              s2 = getHeapString(n2);
              s1 = getHeapString(n1);
              makeHeapString(s2 > s1 ? s2 : s1);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 47 /* smin */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              s2 = getHeapString(n2);
              s1 = getHeapString(n1);
              makeHeapString(s2 < s1 ? s2 : s1);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 48 /* divm */:
            n3 = stack.pop();
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0 && n3 !== void 0) {
              stack.push(Math.round(n1 / n2 * n3));
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 49 /* sqrt */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              stack.push(Math.round(Math.sqrt(n1) * n2));
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 50 /* hyp */:
            n3 = stack.pop();
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0 && n3 !== void 0) {
              stack.push(Math.round(Math.sqrt(n1 * n1 + n2 * n2) * n3));
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 51 /* root */:
            n4 = stack.pop();
            n3 = stack.pop();
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0 && n3 !== void 0 && n4 !== void 0) {
              stack.push(Math.round(Math.pow(n1 / n2, 1 / n3) * n4));
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 52 /* powr */:
            n4 = stack.pop();
            n3 = stack.pop();
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0 && n3 !== void 0 && n4 !== void 0) {
              stack.push(Math.round(Math.pow(n1 / n2, n3) * n4));
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 53 /* log */:
            n3 = stack.pop();
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0 && n3 !== void 0) {
              stack.push(Math.round(Math.log(n1 / n2) / Math.LN10 * n3));
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 54 /* alog */:
            n3 = stack.pop();
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0 && n3 !== void 0) {
              stack.push(Math.round(Math.pow(10, n1 / n2) * n3));
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 55 /* ln */:
            n3 = stack.pop();
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0 && n3 !== void 0) {
              stack.push(Math.round(Math.log(n1 / n2) * n3));
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 56 /* exp */:
            n3 = stack.pop();
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0 && n3 !== void 0) {
              stack.push(Math.round(Math.exp(n1 / n2) * n3));
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 57 /* sin */:
            n4 = stack.pop();
            n3 = stack.pop();
            n2 = stack.pop();
            if (n2 !== void 0 && n3 !== void 0 && n4 !== void 0) {
              n1 = n2 / n3 * (2 * Math.PI) / getTurtA();
              stack.push(Math.round(Math.sin(n1) * n4));
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 58 /* cos */:
            n4 = stack.pop();
            n3 = stack.pop();
            n2 = stack.pop();
            if (n2 !== void 0 && n3 !== void 0 && n4 !== void 0) {
              n1 = n2 / n3 * (2 * Math.PI) / getTurtA();
              stack.push(Math.round(Math.cos(n1) * n4));
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 59 /* tan */:
            n4 = stack.pop();
            n3 = stack.pop();
            n2 = stack.pop();
            if (n2 !== void 0 && n3 !== void 0 && n4 !== void 0) {
              n1 = n2 / n3 * (2 * Math.PI) / getTurtA();
              stack.push(Math.round(Math.tan(n1) * n4));
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 60 /* asin */:
            n4 = stack.pop();
            n3 = stack.pop();
            n2 = stack.pop();
            if (n2 !== void 0 && n3 !== void 0 && n4 !== void 0) {
              n1 = getTurtA() / (2 * Math.PI);
              stack.push(Math.round(Math.asin(n2 / n3) * n4 * n1));
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 61 /* acos */:
            n4 = stack.pop();
            n3 = stack.pop();
            n2 = stack.pop();
            if (n2 !== void 0 && n3 !== void 0 && n4 !== void 0) {
              n1 = getTurtA() / (2 * Math.PI);
              stack.push(Math.round(Math.acos(n2 / n3) * n4 * n1));
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 62 /* atan */:
            n4 = stack.pop();
            n3 = stack.pop();
            n2 = stack.pop();
            if (n2 !== void 0 && n3 !== void 0 && n4 !== void 0) {
              n1 = getTurtA() / (2 * Math.PI);
              stack.push(Math.round(Math.atan2(n2, n3) * n4 * n1));
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 63 /* pi */:
            n1 = stack.pop();
            if (n1 !== void 0) {
              stack.push(Math.round(Math.PI * n1));
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 64 /* scat */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              s2 = getHeapString(n2);
              s1 = getHeapString(n1);
              makeHeapString(s1 + s2);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 65 /* slen */:
            n1 = stack.pop();
            if (n1 !== void 0) {
              stack.push(main[n1]);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 66 /* case */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              s1 = getHeapString(n1);
              switch (n2) {
                case 1:
                  makeHeapString(s1.toLowerCase());
                  break;
                case 2:
                  makeHeapString(s1.toUpperCase());
                  break;
                case 3:
                  if (s1.length > 0) {
                    makeHeapString(s1[0].toUpperCase() + s1.slice(1));
                  } else {
                    makeHeapString(s1);
                  }
                  break;
                case 4:
                  s1 = s1.split(" ").map((x) => x[0].toUpperCase() + x.slice(1).toLowerCase()).join(" ");
                  makeHeapString(s1);
                  break;
                case 5:
                  s1 = s1.split("").map((x) => x === x.toLowerCase() ? x.toUpperCase() : x.toLowerCase()).join("");
                  makeHeapString(s1);
                  break;
                default:
                  makeHeapString(s1);
                  break;
              }
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 67 /* copy */:
            n3 = stack.pop();
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0 && n3 !== void 0) {
              s1 = getHeapString(n1);
              makeHeapString(s1.substr(n2 - 1, n3));
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 68 /* dels */:
            n4 = stack.pop();
            n3 = stack.pop();
            n2 = stack.pop();
            if (n2 !== void 0 && n3 !== void 0 && n4 !== void 0) {
              s2 = getHeapString(n2);
              s1 = s2.substr(0, n3 - 1) + s2.substr(n3 - 1 + n4);
              makeHeapString(s1);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 69 /* inss */:
            n4 = stack.pop();
            n3 = stack.pop();
            n2 = stack.pop();
            if (n2 !== void 0 && n3 !== void 0 && n4 !== void 0) {
              s3 = getHeapString(n3);
              s2 = getHeapString(n2);
              s1 = s3.substr(0, n4 - 1) + s2 + s3.substr(n4 - 1);
              makeHeapString(s1);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 70 /* poss */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              s2 = getHeapString(n2);
              s1 = getHeapString(n1);
              stack.push(s2.indexOf(s1) + 1);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 71 /* repl */:
            n4 = stack.pop();
            n3 = stack.pop();
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0 && n3 !== void 0 && n4 !== void 0) {
              s3 = getHeapString(n3);
              s2 = getHeapString(n2);
              s1 = getHeapString(n1);
              if (n4 > 0) {
                while (n4 > 0) {
                  s1 = s1.replace(s2, s3);
                  n4 = n4 - 1;
                }
                makeHeapString(s1);
              } else {
                makeHeapString(s1.replace(new RegExp(s2, "g"), s3));
              }
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 72 /* spad */:
            n3 = stack.pop();
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0 && n3 !== void 0) {
              s2 = getHeapString(n2);
              s1 = getHeapString(n1);
              while (s1.length + s2.length <= Math.abs(n3)) {
                if (n3 < 0) {
                  s1 = s1 + s2;
                } else {
                  s1 = s2 + s1;
                }
              }
              makeHeapString(s1);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 73 /* trim */:
            n1 = stack.pop();
            if (n1 !== void 0) {
              s1 = getHeapString(n1);
              makeHeapString(s1.trim());
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 80 /* home */:
            n1 = startx + sizex / 2;
            n2 = starty + sizey / 2;
            setTurtX(Math.round(n1));
            setTurtY(Math.round(n2));
            setTurtD(0);
            send("turtxChanged", getTurtX());
            send("turtyChanged", getTurtY());
            send("turtdChanged", getTurtD());
            coords.push([getTurtX(), getTurtY()]);
            break;
          case 81 /* setx */:
            n1 = stack.pop();
            if (n1 !== void 0) {
              setTurtX(n1);
              send("turtxChanged", n1);
              coords.push([getTurtX(), getTurtY()]);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 82 /* sety */:
            n1 = stack.pop();
            if (n1 !== void 0) {
              setTurtY(n1);
              send("turtyChanged", n1);
              coords.push([getTurtX(), getTurtY()]);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 83 /* setd */:
            n2 = stack.pop();
            if (n2 !== void 0) {
              n1 = n2 % getTurtA();
              setTurtD(n1);
              send("turtdChanged", n1);
            }
            break;
          case 84 /* angl */:
            n1 = stack.pop();
            if (n1 !== void 0) {
              if (getTurtA() === 0) {
                setTurtA(n1);
              }
              if (n1 === 0) {
                throw new MachineError("Angles cannot be set to zero.");
              }
              n2 = Math.round(n1 + getTurtD() * n1 / getTurtA());
              setTurtD(n2 % n1);
              setTurtA(n1);
              send("turtdChanged", n2 % n1);
              send("turtaChanged", n1);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 85 /* thik */:
            n1 = stack.pop();
            if (n1 !== void 0) {
              n2 = Math.abs(n1);
              bool1 = n1 < 0;
              bool2 = getTurtT() < 0;
              if (bool1) {
                setTurtT(bool2 ? n2 : -n2);
              } else {
                setTurtT(bool2 ? -n2 : n2);
              }
              send("turttChanged", getTurtT());
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 87 /* colr */:
            n1 = stack.pop();
            if (n1 !== void 0) {
              setTurtC(n1);
              send("turtcChanged", hex(n1));
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 86 /* pen */:
            n1 = stack.pop();
            if (n1 !== void 0) {
              bool1 = n1 !== 0;
              n2 = Math.abs(getTurtT());
              n3 = bool1 ? n2 : -n2;
              setTurtT(n3);
              send("turttChanged", n3);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 88 /* toxy */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              setTurtX(n1);
              setTurtY(n2);
              send("turtxChanged", n1);
              send("turtyChanged", n2);
              coords.push([n1, n2]);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 89 /* mvxy */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              n2 += getTurtY();
              n1 += getTurtX();
              setTurtX(n1);
              setTurtY(n2);
              send("turtxChanged", n1);
              send("turtyChanged", n2);
              coords.push([n1, n2]);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 90 /* drxy */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              n2 += getTurtY();
              n1 += getTurtX();
              if (getTurtT() > 0) {
                send("line", { turtle: turtle(), x: turtx(n1), y: turty(n2) });
                if (update) {
                  drawCount += 1;
                }
              }
              setTurtX(n1);
              setTurtY(n2);
              send("turtxChanged", n1);
              send("turtyChanged", n2);
              coords.push([n1, n2]);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 91 /* fwrd */:
            n3 = stack.pop();
            if (n3 !== void 0) {
              n4 = getTurtD();
              n2 = Math.cos(n4 * Math.PI / (getTurtA() / 2));
              n2 = -Math.round(n2 * n3);
              n2 += getTurtY();
              n1 = Math.sin(n4 * Math.PI / (getTurtA() / 2));
              n1 = Math.round(n1 * n3);
              n1 += getTurtX();
              if (getTurtT() > 0) {
                send("line", { turtle: turtle(), x: turtx(n1), y: turty(n2) });
                if (update) {
                  drawCount += 1;
                }
              }
              setTurtX(n1);
              setTurtY(n2);
              send("turtxChanged", n1);
              send("turtyChanged", n2);
              coords.push([n1, n2]);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 92 /* back */:
            n3 = stack.pop();
            if (n3 !== void 0) {
              n4 = getTurtD();
              n2 = Math.cos(n4 * Math.PI / (getTurtA() / 2));
              n2 = Math.round(n2 * n3);
              n2 += getTurtY();
              n1 = Math.sin(n4 * Math.PI / (getTurtA() / 2));
              n1 = -Math.round(n1 * n3);
              n1 += getTurtX();
              if (getTurtT() > 0) {
                send("line", { turtle: turtle(), x: turtx(n1), y: turty(n2) });
                if (update) {
                  drawCount += 1;
                }
              }
              setTurtX(n1);
              setTurtY(n2);
              send("turtxChanged", n1);
              send("turtyChanged", n2);
              coords.push([n1, n2]);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 93 /* left */:
            n1 = stack.pop();
            if (n1 !== void 0) {
              n2 = (getTurtD() - n1) % getTurtA();
              setTurtD(n2);
              send("turtdChanged", n2);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 94 /* rght */:
            n1 = stack.pop();
            if (n1 !== void 0) {
              n2 = (getTurtD() + n1) % getTurtA();
              setTurtD(n2);
              send("turtdChanged", n2);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 95 /* turn */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              if (Math.abs(n2) >= Math.abs(n1)) {
                n3 = Math.atan(-n1 / n2);
                if (n2 > 0) {
                  n3 += Math.PI;
                } else if (n1 < 0) {
                  n3 += 2;
                  n3 *= Math.PI;
                }
              } else {
                n3 = Math.atan(n2 / n1);
                if (n1 > 0) {
                  n3 += Math.PI;
                } else {
                  n3 += 3;
                  n3 *= Math.PI;
                }
                n3 /= 2;
              }
              n3 = Math.round(n3 * getTurtA() / Math.PI / 2) % getTurtA();
              setTurtD(n3);
              send("turtdChanged", n1);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 96 /* blnk */:
            n1 = stack.pop();
            if (n1 !== void 0) {
              send("blank", hex(n1));
              if (update) {
                drawCount += 1;
              }
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 97 /* rcol */:
            n3 = stack.pop();
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0 && n3 !== void 0) {
              send("flood", { x: turtx(n1), y: turty(n2), c1: n3, c2: 0, boundary: false });
              if (update) {
                drawCount += 1;
              }
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 98 /* fill */:
            n4 = stack.pop();
            n3 = stack.pop();
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0 && n3 !== void 0 && n4 !== void 0) {
              send("flood", { x: turtx(n1), y: turty(n2), c1: n3, c2: n4, boundary: true });
              if (update) {
                drawCount += 1;
              }
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 99 /* pixc */:
            n3 = stack.pop();
            n2 = stack.pop();
            if (n2 !== void 0 && n3 !== void 0) {
              image = context.getImageData(turtx(n2), turty(n3), 1, 1);
              stack.push(image.data[0] * 65536 + image.data[1] * 256 + image.data[2]);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 100 /* pixs */:
            n3 = stack.pop();
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0 && n3 !== void 0) {
              send("pixset", { x: turtx(n1), y: turty(n2), c: n3, doubled });
              if (update) {
                drawCount += 1;
              }
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 101 /* rgb */:
            n1 = stack.pop();
            if (n1 !== void 0) {
              n1 = n1 % 50;
              if (n1 <= 0) {
                n1 += 50;
              }
              n1 = colours[n1 - 1].value;
              stack.push(n1);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 102 /* mixc */:
            n4 = stack.pop();
            n3 = stack.pop();
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0 && n3 !== void 0 && n4 !== void 0) {
              r = mixBytes(Math.floor(n1 / 65536), Math.floor(n2 / 65536), n3, n4);
              g = mixBytes(Math.floor((n1 & 65280) / 256), Math.floor((n2 & 65280) / 256), n3, n4);
              b = mixBytes(n1 & 255, n2 & 255, n3, n4);
              stack.push(r * 65536 + g * 256 + b);
            }
            break;
          case 103 /* rmbr */:
            coords.push([getTurtX(), getTurtY()]);
            break;
          case 104 /* frgt */:
            n1 = stack.pop();
            if (n1 !== void 0) {
              coords.length -= n1;
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 105 /* poly */:
            n3 = stack.pop();
            if (n3 !== void 0) {
              n2 = coords.length;
              n1 = n3 > n2 ? 0 : n2 - n3;
              send("poly", { turtle: turtle(), coords: coords.slice(n1, n2).map(vcoords), fill: false });
              if (update) {
                drawCount += 1;
              }
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 106 /* pfil */:
            n3 = stack.pop();
            if (n3 !== void 0) {
              n2 = coords.length;
              n1 = n3 > n2 ? 0 : n2 - n3;
              send("poly", { turtle: turtle(), coords: coords.slice(n1, n2).map(vcoords), fill: true });
              if (update) {
                drawCount += 1;
              }
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 107 /* circ */:
            n1 = stack.pop();
            if (n1 !== void 0) {
              send("arc", { turtle: turtle(), x: turtx(n1 + startx), y: turty(n1 + starty), fill: false });
              if (update) {
                drawCount += 1;
              }
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 108 /* blot */:
            n1 = stack.pop();
            if (n1 !== void 0) {
              send("arc", { turtle: turtle(), x: turtx(n1 + startx), y: turty(n1 + starty), fill: true });
              if (update) {
                drawCount += 1;
              }
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 109 /* elps */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              send("arc", { turtle: turtle(), x: turtx(n1 + startx), y: turty(n2 + starty), fill: false });
              if (update) {
                drawCount += 1;
              }
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 110 /* eblt */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              send("arc", { turtle: turtle(), x: turtx(n1 + startx), y: turty(n2 + starty), fill: true });
              if (update) {
                drawCount += 1;
              }
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 111 /* box */:
            n4 = stack.pop();
            n3 = stack.pop();
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0 && n3 !== void 0 && n4 !== void 0) {
              bool1 = n4 !== 0;
              n2 += getTurtY();
              n1 += getTurtX();
              send("box", { turtle: turtle(), x: turtx(n1), y: turty(n2), fill: hex(n3), border: bool1 });
              if (update) {
                drawCount += 1;
              }
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 112 /* ldin */:
            n1 = pcode[line][code2 + 1];
            stack.push(n1);
            code2 += 1;
            break;
          case 113 /* ldvg */:
            n1 = pcode[line][code2 + 1];
            stack.push(peek(n1));
            code2 += 1;
            break;
          case 114 /* ldvv */:
            n1 = pcode[line][code2 + 1];
            n2 = pcode[line][code2 + 2];
            stack.push(main[main[n1] + n2]);
            code2 += 2;
            break;
          case 115 /* ldvr */:
            n1 = pcode[line][code2 + 1];
            n2 = pcode[line][code2 + 2];
            stack.push(main[main[main[n1] + n2]]);
            code2 += 2;
            break;
          case 116 /* ldag */:
            n1 = pcode[line][code2 + 1];
            stack.push(n1);
            code2 += 1;
            break;
          case 117 /* ldav */:
            n1 = pcode[line][code2 + 1];
            n2 = pcode[line][code2 + 2];
            stack.push(main[n1] + n2);
            code2 += 2;
            break;
          case 118 /* lstr */:
            code2 += 1;
            n1 = pcode[line][code2];
            n2 = code2 + n1;
            s1 = "";
            while (code2 < n2) {
              code2 += 1;
              s1 += String.fromCharCode(pcode[line][code2]);
            }
            makeHeapString(s1);
            break;
          case 119 /* stvg */:
            n1 = stack.pop();
            if (n1 !== void 0) {
              main[pcode[line][code2 + 1]] = n1;
              code2 += 1;
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 120 /* stvv */:
            n1 = pcode[line][code2 + 1];
            n2 = pcode[line][code2 + 2];
            n3 = stack.pop();
            if (n3 !== void 0) {
              main[main[n1] + n2] = n3;
              code2 += 2;
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 121 /* stvr */:
            n1 = pcode[line][code2 + 1];
            n2 = pcode[line][code2 + 2];
            n3 = stack.pop();
            if (n3 !== void 0) {
              main[main[main[n1] + n2]] = n3;
              code2 += 2;
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 122 /* lptr */:
            n1 = stack.pop();
            if (n1 !== void 0) {
              stack.push(main[n1]);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 123 /* sptr */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              main[n2] = n1;
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 124 /* zptr */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              zero(n1, n2);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 125 /* cptr */:
            n3 = stack.pop();
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0 && n3 !== void 0) {
              copy(n1, n2, n3);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 126 /* cstr */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              n4 = main[n2 - 1];
              n3 = main[n1];
              copy(n1, n2, Math.min(n3, n4) + 1);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 127 /* test */:
            n2 = stack[stack.length - 1];
            n1 = stack[stack.length - 2];
            if (n1 !== void 0 && n2 !== void 0) {
              if (n1 < 0 || n1 > main[n2]) {
                throw new MachineError(`Array index out of range (${line}, ${code2}).`);
              }
            }
            break;
          case 128 /* jump */:
            line = pcode[line][code2 + 1] - 1;
            code2 = -1;
            break;
          case 129 /* ifno */:
            n1 = stack.pop();
            if (n1 !== void 0) {
              if (n1 === 0) {
                line = pcode[line][code2 + 1] - 1;
                code2 = -1;
              } else {
                code2 += 1;
              }
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 130 /* halt */:
            halt();
            return;
          case 131 /* subr */:
            if (getHeapGlobal() === -1) {
              setHeapGlobal(getHeapPerm());
            }
            returnStack.push(line + 1);
            line = pcode[line][code2 + 1] - 1;
            code2 = -1;
            break;
          case 132 /* retn */:
            n1 = returnStack.pop();
            if (n1 !== void 0) {
              line = n1;
              code2 = -1;
            } else {
              throw new MachineError("RETN called on empty return stack.");
            }
            break;
          case 133 /* pssr */:
            subroutineStack.push(pcode[line][code2 + 1]);
            code2 += 1;
            break;
          case 134 /* plsr */:
            subroutineStack.pop();
            break;
          case 135 /* psrj */:
            stack.push(line + 1);
            break;
          case 136 /* plrj */:
            returnStack.pop();
            n1 = stack.pop();
            if (n1 !== void 0) {
              line = n1 - 1;
              code2 = -1;
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 137 /* ldmt */:
            stack.push(memoryStack.length - 1);
            break;
          case 138 /* stmt */:
            n1 = stack.pop();
            if (n1 !== void 0) {
              memoryStack.push(n1);
              setStackTop(n1);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 139 /* memc */:
            n1 = pcode[line][code2 + 1];
            n2 = pcode[line][code2 + 2];
            n3 = memoryStack.pop();
            if (n3 !== void 0) {
              if (n3 + n2 > options.stackSize) {
                throw new MachineError("Memory stack has overflowed into memory heap. Probable cause is unterminated recursion.");
              }
              memoryStack.push(main[n1]);
              setStackTop(main[n1]);
              main[n1] = n3;
              memoryStack.push(n3 + n2);
              setStackTop(n3 + n2);
              code2 += 2;
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 140 /* memr */:
            memoryStack.pop();
            n1 = pcode[line][code2 + 1];
            n2 = memoryStack.pop();
            if (n2 !== void 0) {
              memoryStack.push(main[n1]);
              setStackTop(main[n1]);
              main[n1] = n2;
              code2 += 2;
            } else {
              throw new MachineError("MEMR called on empty memory stack.");
            }
            break;
          case 141 /* hfix */:
            heapFix();
            break;
          case 142 /* hclr */:
            break;
          case 143 /* hrst */:
            heapReset();
            break;
          case 144 /* canv */:
            n4 = stack.pop();
            n3 = stack.pop();
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0 && n3 !== void 0 && n4 !== void 0) {
              sizey = n4;
              sizex = n3;
              starty = n2;
              startx = n1;
              send("canvas", {
                startx,
                starty,
                sizex,
                sizey,
                width,
                height,
                doubled
              });
              setTurtX(Math.round(startx + sizex / 2));
              setTurtY(Math.round(starty + sizey / 2));
              setTurtD(0);
              send("turtxChanged", getTurtX());
              send("turtyChanged", getTurtY());
              send("turtdChanged", getTurtD());
              coords.push([getTurtX(), getTurtY()]);
              drawCount = options.drawCountMax;
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 145 /* reso */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              if (Math.min(n1, n2) <= options.smallSize) {
                n1 *= 2;
                n2 *= 2;
                doubled = true;
              } else {
                doubled = false;
              }
              width = n1;
              height = n2;
              send("resolution", { width: n1, height: n2 });
              send("blank", "#FFFFFF");
              drawCount = options.drawCountMax;
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 146 /* udat */:
            n1 = stack.pop();
            if (n1 !== void 0) {
              bool1 = n1 !== 0;
              update = bool1;
              if (bool1) {
                drawCount = options.drawCountMax;
              }
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 147 /* seed */:
            n1 = stack.pop();
            if (n1 !== void 0) {
              if (n1 === 0) {
                stack.push(seed);
              } else {
                seed = n1;
                stack.push(n1);
              }
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 152 /* trac */:
            stack.pop();
            break;
          case 153 /* memw */:
            stack.pop();
            break;
          case 154 /* dump */:
            send("memoryDumped", dump());
            if (options.showMemoryOnDump) {
              send("selectTab", "memory");
            }
            break;
          case 155 /* peek */:
            n1 = stack.pop();
            if (n1 !== void 0) {
              stack.push(main[n1]);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 156 /* poke */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              main[n1] = n2;
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 160 /* inpt */:
            n1 = stack.pop();
            if (n1 !== void 0) {
              if (n1 < 0) {
                stack.push(query[-n1]);
              } else {
                stack.push(keys[n1]);
              }
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 161 /* iclr */:
            n1 = stack.pop();
            if (n1 !== void 0) {
              if (n1 < 0) {
                query[-n1] = -1;
              } else if (n1 === 0) {
                main[main[1] + 1] = main[1] + 3;
                main[main[1] + 2] = main[1] + 3;
              } else {
                keys[n1] = -1;
              }
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 162 /* bufr */:
            n1 = stack.pop();
            if (n1 !== void 0) {
              if (n1 > 0) {
                n2 = getHeapTemp() + 3;
                stack.push(getHeapTemp() + 1);
                main[getHeapTemp() + 1] = n1 + n2;
                main[getHeapTemp() + 2] = n2 + 1;
                main[getHeapTemp() + 3] = n2 + 1;
                main.fill(0, n2 + 1, n2 + n1);
                setHeapTemp(n2 + n1);
                setHeapMax(getHeapTemp());
              }
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 163 /* read */:
            n1 = stack.pop();
            n2 = main[1];
            n3 = main[main[1]];
            s1 = "";
            r = main[n2 + 1];
            g = main[n2 + 2];
            if (n1 !== void 0) {
              if (n1 === 0) {
                while (r !== g) {
                  s1 += String.fromCharCode(main[r]);
                  r = r < n3 ? r + 1 : n3 + 3;
                }
              } else {
                while (r !== g && s1.length <= n1) {
                  s1 += String.fromCharCode(main[r]);
                  if (r < n3) {
                    r += 1;
                  } else {
                    r = n3 + 3;
                  }
                }
                main[n2 + 1] = r;
              }
              makeHeapString(s1);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 164 /* rdln */:
            n1 = Math.pow(2, 31) - 1;
            code2 += 1;
            if (code2 === pcode[line].length) {
              line += 1;
              code2 = 0;
            }
            readlineTimeoutID = window.setTimeout(execute, n1);
            window.addEventListener("keyup", readline);
            return;
          case 165 /* kech */:
            n1 = stack.pop();
            if (n1 !== void 0) {
              bool1 = n1 !== 0;
              keyecho = bool1;
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 166 /* outp */:
            n3 = stack.pop();
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0 && n3 !== void 0) {
              bool2 = n3 !== 0;
              bool1 = n1 !== 0;
              send("output", { clear: bool1, colour: hex(n2) });
              if (bool2) {
                send("selectTab", "output");
              } else {
                send("selectTab", "canvas");
              }
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 167 /* cons */:
            n3 = stack.pop();
            n2 = stack.pop();
            if (n2 !== void 0 && n3 !== void 0) {
              bool1 = n2 !== 0;
              send("console", { clear: bool1, colour: hex(n3) });
            }
            break;
          case 168 /* prnt */:
            n3 = stack.pop();
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0 && n3 !== void 0) {
              s1 = getHeapString(n1);
              send("print", { turtle: turtle(), string: s1, font: n2, size: n3 });
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 169 /* writ */:
            n1 = stack.pop();
            if (n1 !== void 0) {
              s1 = getHeapString(n1);
              send("write", s1);
              send("log", s1);
              if (options.showOutputOnWrite) {
                send("selectTab", "output");
              }
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 170 /* newl */:
            send("write", "\n");
            send("log", "\n");
            break;
          case 171 /* curs */:
            n1 = stack.pop();
            if (n1 !== void 0) {
              send("cursor", n1);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 172 /* time */:
            n1 = Date.now();
            n1 = n1 - startTime;
            stack.push(n1);
            break;
          case 173 /* tset */:
            n1 = Date.now();
            n2 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              startTime = n1 - n2;
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            break;
          case 174 /* wait */:
            n1 = stack.pop();
            if (n1 !== void 0) {
              code2 += 1;
              if (code2 === pcode[line].length) {
                line += 1;
                code2 = 0;
              }
              window.setTimeout(execute, n1);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            return;
          case 175 /* tdet */:
            n2 = stack.pop();
            n1 = stack.pop();
            if (n1 !== void 0 && n2 !== void 0) {
              stack.push(0);
              code2 += 1;
              if (code2 === pcode[line].length) {
                line += 1;
                code2 = 0;
              }
              detectKeycode = n2;
              detectTimeoutID = window.setTimeout(execute, n1);
              window.addEventListener("keyup", detect);
            } else {
              throw new MachineError("Stack operation called on empty stack.");
            }
            return;
          case 176 /* chdr */:
          case 177 /* file */:
          case 178 /* diry */:
          case 179 /* open */:
          case 180 /* clos */:
          case 181 /* fbeg */:
          case 182 /* eof */:
          case 183 /* eoln */:
          case 184 /* frds */:
          case 185 /* frln */:
          case 186 /* fwrs */:
          case 187 /* fwln */:
          case 188 /* ffnd */:
          case 189 /* fdir */:
          case 190 /* fnxt */:
          case 191 /* fmov */:
            throw new MachineError("File processing has not yet been implemented in the online Turtle System. We are working on introducing this very soon. In the meantime, please run this program using the downloable system.");
          default:
            console.log(line);
            console.log(code2);
            throw new MachineError(`Unknown PCode 0x${pcode[line][code2].toString(16)}.`);
        }
        codeCount += 1;
        code2 += 1;
        if (!pcode[line]) {
          throw new MachineError("The program has tried to jump to a line that does not exist. This is either a bug in our compiler, or in your assembled code.");
        }
        if (code2 === pcode[line].length) {
          line += 1;
          code2 = 0;
        }
      }
    } catch (error) {
      halt();
      send("error", error);
    }
    setTimeout(execute, 0);
  }
  function storeKey(event) {
    if (event.key === "Backspace") {
      event.preventDefault();
      const buffer = main[1];
      if (buffer > 0) {
        if (main[buffer + 1] !== main[buffer + 2]) {
          if (main[buffer + 2] === buffer + 3) {
            main[buffer + 2] = main[buffer];
          } else {
            main[buffer + 2] -= 1;
          }
          if (keyecho) {
            send("backspace");
          }
        }
        if (main[buffer + 2] >= main[buffer + 1]) {
          keys[0] = main[buffer + 2] - main[buffer + 1];
        } else {
          keys[0] = main[buffer + 2] - main[buffer + 1] + main[buffer] - buffer - 2;
        }
      }
    }
    if (event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
    }
    const keycode2 = event.keyCode;
    query[9] = keycode2;
    query[10] = 128;
    if (event.shiftKey) {
      query[10] += 8;
    }
    if (event.altKey) {
      query[10] += 16;
    }
    if (event.ctrlKey) {
      query[10] += 32;
    }
    keys[keycode2] = query[10];
  }
  function releaseKey(event) {
    const keycode2 = event.keyCode;
    query[9] = -Math.abs(query[9]);
    query[10] = -Math.abs(query[10]);
    keys[keycode2] = -Math.abs(keys[keycode2]);
  }
  function putInBuffer(event) {
    const keycode2 = event.keyCode;
    const buffer = main[1];
    if (buffer > 0) {
      let next = 0;
      if (main[buffer + 2] === main[buffer]) {
        next = buffer + 3;
      } else {
        next = main[buffer + 2] + 1;
      }
      if (next !== main[buffer + 1]) {
        main[main[buffer + 2]] = keycode2;
        main[buffer + 2] = next;
        if (main[buffer + 2] >= main[buffer + 1]) {
          keys[0] = main[buffer + 2] - main[buffer + 1];
        } else {
          keys[0] = main[buffer + 2] - main[buffer + 1] + main[buffer] - buffer - 2;
        }
        if (keyecho) {
          send("log", String.fromCharCode(keycode2));
        }
      }
    }
  }
  function storeMouseXY(event) {
    switch (event.type) {
      case "mousemove":
        query[7] = virtx(event.clientX);
        query[8] = virty(event.clientY);
        break;
      case "touchmove":
      case "touchstart":
        query[7] = virtx(event.touches[0].clientX);
        query[8] = virty(event.touches[0].clientY);
        break;
    }
  }
  function storeClickXY(event) {
    const now = Date.now();
    query[4] = 128;
    if (event.shiftKey) {
      query[4] += 8;
    }
    if (event.altKey) {
      query[4] += 16;
    }
    if (event.ctrlKey) {
      query[4] += 32;
    }
    if (now - query[11] < 300) {
      query[4] += 64;
    }
    query[11] = now;
    switch (event.type) {
      case "mousedown":
        query[5] = virtx(event.clientX);
        query[6] = virty(event.clientY);
        switch (event.button) {
          case 0:
            query[4] += 1;
            query[1] = query[4];
            query[2] = -1;
            query[3] = -1;
            break;
          case 1:
            query[4] += 4;
            query[1] = -1;
            query[2] = -1;
            query[3] = query[4];
            break;
          case 2:
            query[4] += 2;
            query[1] = -1;
            query[2] = query[4];
            query[3] = -1;
            break;
        }
        break;
      case "touchstart":
        query[5] = virtx(event.touches[0].clientX);
        query[6] = virty(event.touches[0].clientY);
        query[4] += 1;
        query[1] = query[4];
        query[2] = -1;
        query[3] = -1;
        storeMouseXY(event);
        break;
    }
  }
  function releaseClickXY(event) {
    query[4] = -query[4];
    switch (event.type) {
      case "mouseup":
        switch (event.button) {
          case 0:
            query[1] = -query[1];
            break;
          case 1:
            query[2] = -query[3];
            break;
          case 2:
            query[2] = -query[2];
            break;
        }
        break;
      case "touchend":
        query[1] = -query[1];
        break;
    }
  }
  function preventDefault(event) {
    event.preventDefault();
  }
  function detect(event) {
    if (event.keyCode === detectKeycode) {
      stack.pop();
      stack.push(-1);
      window.clearTimeout(detectTimeoutID);
      execute();
    }
  }
  function readline(event) {
    if (event.key === "Enter") {
      const bufferAddress = main[1];
      const bufferEndAddress = main[main[1]];
      let string2 = "";
      let readNextAddress = main[bufferAddress + 1];
      const readLastAddress = main[bufferAddress + 2];
      while (readNextAddress !== readLastAddress && main[readNextAddress] !== 13) {
        string2 += String.fromCharCode(main[readNextAddress]);
        readNextAddress = readNextAddress < bufferEndAddress ? readNextAddress + 1 : bufferEndAddress + 3;
      }
      main[bufferAddress + 1] = readNextAddress < bufferEndAddress ? readNextAddress + 1 : bufferEndAddress + 3;
      makeHeapString(string2);
      window.clearTimeout(readlineTimeoutID);
      execute();
    }
  }
  function turtle() {
    return {
      x: turtx(getTurtX()),
      y: turty(getTurtY()),
      d: getTurtD(),
      a: getTurtA(),
      p: turtt(getTurtT()),
      c: hex(getTurtC())
    };
  }
  function turtx(x) {
    const exact = (x - startx) * width / sizex;
    return doubled ? Math.round(exact) + 1 : Math.round(exact);
  }
  function turty(y) {
    const exact = (y - starty) * height / sizey;
    return doubled ? Math.round(exact) + 1 : Math.round(exact);
  }
  function turtt(t) {
    return doubled ? t * 2 : t;
  }
  function vcoords(coords2) {
    return [turtx(coords2[0]), turty(coords2[1])];
  }
  function virtx(x) {
    const { left, width: width2 } = canvas.getBoundingClientRect();
    const exact = (x - left) * sizex / width2 + startx;
    return Math.round(exact);
  }
  function virty(y) {
    const { height: height2, top } = canvas.getBoundingClientRect();
    const exact = (y - top) * sizey / height2 + starty;
    return Math.round(exact);
  }

  // client/lexer/token.ts
  var Token = class {
    constructor(type8, content, line2, character) {
      this.type = type8;
      this.content = content;
      this.line = line2;
      this.character = character;
    }
  };

  // client/constants/commands.ts
  var Command = class {
    constructor(names, code3, parameters7, returns, category, level, description) {
      this.names = names;
      this.code = code3;
      this.parameters = parameters7;
      this.returns = returns;
      this.category = category;
      this.level = level;
      this.description = description;
    }
    get type() {
      return this.returns === null ? "procedure" : "function";
    }
  };
  var Parameter = class {
    constructor(name, type8, isReferenceParameter, length) {
      this.name = name;
      this.type = type8;
      this.isReferenceParameter = isReferenceParameter;
      this.length = length;
    }
  };
  var commands = [
    new Command({ BASIC: "FORWARD", C: "forward", Java: "forward", Pascal: "forward", Python: "forward", TypeScript: "forward" }, [91 /* fwrd */], [new Parameter("n", "integer", false, 1)], null, 0, 0, "Moves the Turtle forward <code>n</code> units, drawing as it goes (unless the pen is up)."),
    new Command({ BASIC: "BACK", C: "back", Java: "back", Pascal: "back", Python: "back", TypeScript: "back" }, [92 /* back */], [new Parameter("n", "integer", false, 1)], null, 0, 0, "Moves the Turtle back <code>n</code> units, drawing as it goes (unless the pen is up)."),
    new Command({ BASIC: "LEFT", C: "left", Java: "left", Pascal: "left", Python: "left", TypeScript: "left" }, [93 /* left */], [new Parameter("n", "integer", false, 1)], null, 0, 0, "Rotates the Turtle left by <code>n</code> degrees."),
    new Command({ BASIC: "RIGHT", C: "right", Java: "right", Pascal: "right", Python: "right", TypeScript: "right" }, [94 /* rght */], [new Parameter("n", "integer", false, 1)], null, 0, 0, "Rotates the Turtle right by <code>n</code> degrees."),
    new Command({ BASIC: "DRAWXY", C: "drawxy", Java: "drawXY", Pascal: "drawxy", Python: "drawxy", TypeScript: "drawXY" }, [90 /* drxy */], [
      new Parameter("x", "integer", false, 1),
      new Parameter("y", "integer", false, 1)
    ], null, 0, 1, "Moves the Turtle in a straight line to a point <code>x</code> units away along the x-axis and <code>y</code> units away along the y-axis, drawing as it goes (unless the pen is up)."),
    new Command({ BASIC: "MOVEXY", C: "movexy", Java: "moveXY", Pascal: "movexy", Python: "movexy", TypeScript: "moveXY" }, [89 /* mvxy */], [
      new Parameter("x", "integer", false, 1),
      new Parameter("y", "integer", false, 1)
    ], null, 0, 1, "Moves the Turtle in a straight line to a point <code>x</code> units away along the x-axis and <code>y</code> units away along the y-axis, <em>without</em> drawing (regardless of the current pen status)."),
    new Command({ BASIC: "HOME", C: "home", Java: "home", Pascal: "home", Python: "home", TypeScript: "home" }, [80 /* home */], [], null, 1, 0, "Moves the Turtle back to its starting position in the centre of the canvas, facing north, drawing as it goes (unless the pen is up)."),
    new Command({ BASIC: "SETX", C: "setx", Java: "setX", Pascal: "setx", Python: "setx", TypeScript: "setX" }, [81 /* setx */], [new Parameter("x", "integer", false, 1)], null, 1, 0, "Sets the Turtle&rsquo;s <code>x</code> coordinate directly (without movement or drawing on the canvas). This can also be achieved by direct assignment of the global variable <code>turtx</code>."),
    new Command({ BASIC: "SETY", C: "sety", Java: "setY", Pascal: "sety", Python: "sety", TypeScript: "setY" }, [82 /* sety */], [new Parameter("y", "integer", false, 1)], null, 1, 0, "Sets the Turtle&rsquo;s <code>y</code> coordinate directly (without movement or drawing on the canvas). This can also be achieved by direct assignment of the global variable <code>turty</code>."),
    new Command({ BASIC: "SETXY", C: "setxy", Java: "setXY", Pascal: "setxy", Python: "setxy", TypeScript: "setXY" }, [88 /* toxy */], [
      new Parameter("x", "integer", false, 1),
      new Parameter("y", "integer", false, 1)
    ], null, 1, 0, "Sets the Turtle&rsquo;s <code>x</code> and <code>y</code> coordinates directly (without movement or drawing on the canvas). This can also be achieved by direct assingment of the global variables <code>turtx</code> and <code>turty</code>."),
    new Command({ BASIC: "DIRECTION", C: "direction", Java: "direction", Pascal: "direction", Python: "direction", TypeScript: "direction" }, [83 /* setd */], [new Parameter("n", "integer", false, 1)], null, 1, 0, "Sets the Turtle&rsquo;s direction to <code>n</code> degrees (0 for north, 90 for east, 180 for south, 270 for west). This can also be achieved by direct assignment of the global variable <code>turtd</code>. Note that the number of degrees in a circle (360 by default) can be changed with the <code>angles</code> command."),
    new Command({ BASIC: "ANGLES", C: "angles", Java: "angles", Pascal: "angles", Python: "angles", TypeScript: "angles" }, [84 /* angl */], [new Parameter("degrees", "integer", false, 1)], null, 1, 1, "Sets the number of <code>degrees</code> in a circle (360 by default)."),
    new Command({ BASIC: "TURNXY", C: "turnxy", Java: "turnXY", Pascal: "turnxy", Python: "turnxy", TypeScript: "turnXY" }, [95 /* turn */], [
      new Parameter("x", "integer", false, 1),
      new Parameter("y", "integer", false, 1)
    ], null, 1, 1, "Turns the Turtle to face the point <code>x</code> units away alongthe x-axis and <code>y</code> units away along the y-axis."),
    new Command({ BASIC: "CIRCLE", C: "circle", Java: "circle", Pascal: "circle", Python: "circle", TypeScript: "circle" }, [107 /* circ */], [new Parameter("radius", "integer", false, 1)], null, 2, 0, "Draws a circle outline in the Turtle&rsquo;s current colour and thickness, of the given <code>radius</code>, centred on the Turtle&rsquo;s current location."),
    new Command({ BASIC: "BLOT", C: "blot", Java: "blot", Pascal: "blot", Python: "blot", TypeScript: "blot" }, [108 /* blot */], [new Parameter("radius", "integer", false, 1)], null, 2, 0, "Draws a filled circle in the Turtle&rsquo;s current colour, of the given <code>radius</code>, centred on the Turtle&rsquo;s current location."),
    new Command({ BASIC: "ELLIPSE", C: "ellipse", Java: "ellipse", Pascal: "ellipse", Python: "ellipse", TypeScript: "ellipse" }, [109 /* elps */], [
      new Parameter("Xradius", "integer", false, 1),
      new Parameter("Yradius", "integer", false, 1)
    ], null, 2, 0, "Draws an ellipse outline in the Turtle&rsquo;s current colour and thickness, of the given <code>Xradius</code> and <code>Yradius</code>, centred on the Turtle&rsquo;s current location."),
    new Command({ BASIC: "ELLBLOT", C: "ellblot", Java: "ellblot", Pascal: "ellblot", Python: "ellblot", TypeScript: "ellblot" }, [110 /* eblt */], [
      new Parameter("Xradius", "integer", false, 1),
      new Parameter("Yradius", "integer", false, 1)
    ], null, 2, 0, "Draws a filled ellipse in the Turtle&rsquo;s current colour, of the given <code>Xradius</code> and <code>Yradius</code>, centred on the Turtle&rsquo;s current location."),
    new Command({ BASIC: "POLYLINE", C: "polyline", Java: "polyline", Pascal: "polyline", Python: "polyline", TypeScript: "polyline" }, [105 /* poly */], [new Parameter("n", "integer", false, 1)], null, 2, 1, "Draws a polygon outline in the Turtle&rsquo;s current colour and thickness, connecting the last <code>n</code> locations that the Turtle has visited."),
    new Command({ BASIC: "POLYGON", C: "polygon", Java: "polygon", Pascal: "polygon", Python: "polygon", TypeScript: "polygon" }, [106 /* pfil */], [new Parameter("n", "integer", false, 1)], null, 2, 1, "Draws a filled polygon in the Turtle&rsquo;s current colour and thickness, connecting the last <code>n</code> locations that the Turtle has visited."),
    new Command({ BASIC: "FORGET", C: "forget", Java: "forget", Pascal: "forget", Python: "forget", TypeScript: "forget" }, [104 /* frgt */], [new Parameter("n", "integer", false, 1)], null, 2, 1, "Makes the Turtle &ldquo;forget&rdquo; the last <code>n</code> points it has visited. Used in conjunction with <code>polyline</code> and <code>polygon</code>."),
    new Command({ BASIC: "REMEMBER", C: "remember", Java: "remember", Pascal: "remember", Python: "remember", TypeScript: "remember" }, [103 /* rmbr */], [], null, 2, 1, "Makes the Turtle &ldquo;remember&rdquo; its current location. This is only necessary if its current location was set by a direct assignment of the global variables <code>turtx</code> and <code>turty</code>; when using the standard moving commands, the Turtle automatically remembers where it has been."),
    new Command({ BASIC: "BOX", C: "box", Java: "box", Pascal: "box", Python: "box", TypeScript: "box" }, [111 /* box */], [
      new Parameter("x", "integer", false, 1),
      new Parameter("y", "integer", false, 1),
      new Parameter("colour", "integer", false, 1),
      new Parameter("border", "boolean", false, 1)
    ], null, 2, 1, "Draws a box of width <code>x</code> and height <code>y</code>, with the top left corner in the Turtle&rsquo;s current location, filled with the specified <code>colour</code>. If <code>border</code> is <code>true</code>, a border is drawn around the box in the Turtle&rsquo;s current colour and and thickness. This is intended to be used with the <code>print</code> command, to provide a box for framing text."),
    new Command({ BASIC: "COLOUR", C: "colour", Java: "colour", Pascal: "colour", Python: "colour", TypeScript: "colour" }, [87 /* colr */], [new Parameter("colour", "integer", false, 1)], null, 3, 0, "Sets the <code>colour</code> of the Turtle&rsquo;s pen. Takes as an argument either an RGB value, or one of the Turtle System&rsquo;s fifty predefined colour constants (see the <b>Colours</b> tab). This can also be achieved by direct assignment of the global variable <code>turtc</code>."),
    new Command({ BASIC: "RNDCOL", C: "randcol", Java: "randCol", Pascal: "randcol", Python: "randcol", TypeScript: "randCol" }, [7 /* rand */, 4 /* incr */, 101 /* rgb */, 87 /* colr */], [new Parameter("n", "integer", false, 1)], null, 3, 0, "Assigns a random colour to the Turte&rsquo;s pen, between 1 and <code>n</code> (maximum 50). The colours are taken from the Turtle System&rsquo;s fifty predefined colours, which are each assigned a number between 1 and 50 (see the <b>Colours</b> tab)."),
    new Command({ BASIC: "THICKNESS", C: "thickness", Java: "thickness", Pascal: "thickness", Python: "thickness", TypeScript: "thickness" }, [85 /* thik */], [new Parameter("thickness", "integer", false, 1)], null, 3, 0, "Sets the <code>thickness</code> of the Turtle&rsquo;s pen (for line drawing, and outlines of circles, ellipses, boxes, and polygons). This can also be achieved by direct assignment of the global variable <code>turtt</code>."),
    new Command({ BASIC: "PENUP", C: "penup", Java: "penUp", Pascal: "penup", Python: "penup", TypeScript: "penUp" }, [112 /* ldin */, 0, 86 /* pen */], [], null, 3, 0, "Lifts the Turtle&rsquo;s pen, so that subsequent movement will not draw a line on the Canvas."),
    new Command({ BASIC: "PENDOWN", C: "pendown", Java: "penDown", Pascal: "pendown", Python: "pendown", TypeScript: "penDown" }, [112 /* ldin */, -1, 86 /* pen */], [], null, 3, 0, "Lowers the Turtle&rsquo;s pen, so that subsequent movement will draw a line on the Canvas."),
    new Command({ BASIC: "OUTPUT", C: "output", Java: "output", Pascal: "output", Python: "output", TypeScript: "output" }, [166 /* outp */], [
      new Parameter("clear", "boolean", false, 1),
      new Parameter("colour", "integer", false, 1),
      new Parameter("tofront", "boolean", false, 1)
    ], null, 3, 1, "Modifies the textual output. If the first argument is <code>true</code>, it clears any existing text. The second argument specifies the background colour, and the third argument is for switching the display. If the third argument is <code>true</code>, it switches to the <b>Output</b> tab, while if it is <code>false</code>, it switches to the <b>Canvas and Console</b> tab."),
    new Command({ BASIC: "CONSOLE", C: "console", Java: "console", Pascal: "console", Python: "console", TypeScript: "console" }, [167 /* cons */], [
      new Parameter("clear", "boolean", false, 1),
      new Parameter("colour", "integer", false, 1)
    ], null, 3, 1, "Modifies the Console; if the first argument is <code>true</code>, it clears any existing text, while the second argument specifies the background colour."),
    new Command({ BASIC: "RGB", C: "rgb", Java: "rgb", Pascal: "rgb", Python: "rgb", TypeScript: "rgb" }, [101 /* rgb */], [new Parameter("colour", "integer", false, 1)], "integer", 3, 2, "Returns the RGB value of the input <code>colour</code> (an integer between 1 and 50). For example, <code>rgb(red)=255</code>."),
    new Command({ BASIC: "MIXCOLS", C: "mixcols", Java: "mixCols", Pascal: "mixcols", Python: "mixcols", TypeScript: "mixCols" }, [102 /* mixc */], [
      new Parameter("colour1", "integer", false, 1),
      new Parameter("colour1", "integer", false, 1),
      new Parameter("proportion1", "integer", false, 1),
      new Parameter("proportion2", "integer", false, 1)
    ], "integer", 3, 2, "Mixes the given colours in the given proportions."),
    new Command({ BASIC: "NEWTURTLE", C: "newturtle", Java: "newTurtle", Pascal: "newturtle", Python: "newturtle", TypeScript: "newTurtle" }, [112 /* ldin */, 0, 123 /* sptr */], [new Parameter("array", "integer", false, 5)], null, 3, 2, "Points the Turtle to a custom array in memory (this must be an array of five integers, corresponding to the Turtle&rsquo;s five properties, <code>turtx</code>, <code>turty</code>, <code>turtd</code>, <code>turtt</code>, and <code>turtc</code>). Use repeatedly to simulate multiple Turtles."),
    new Command({ BASIC: "OLDTURTLE", C: "oldturtle", Java: "oldTurtle", Pascal: "oldturtle", Python: "oldturtle", TypeScript: "oldTurtle" }, [229 /* oldt */], [], null, 3, 2, "Points the Turtle back to the default (built-in) array in memory. Use in conjunction with <code>newturtle</code>."),
    new Command({ BASIC: "UPDATE", C: "update", Java: "update", Pascal: "update", Python: "update", TypeScript: "update" }, [112 /* ldin */, -1, 146 /* udat */], [], null, 4, 0, "Makes the Machine update the Canvas, and continue updating with all subsequent drawing commands. Used in conjunction with <em>noupdate</em>."),
    new Command({ BASIC: "NOUPDATE", C: "noupdate", Java: "noUpdate", Pascal: "noupdate", Python: "noupdate", TypeScript: "noUpdate" }, [112 /* ldin */, 0, 146 /* udat */], [], null, 4, 0, "Makes the Machine refrain from updating the Canvas when executing all subsequent drawing commands, until <em>update</em> is called. Use this to create smooth animations, by queueing up several drawing commands to execute simultaneously."),
    new Command({ BASIC: "BLANK", C: "blank", Java: "blank", Pascal: "blank", Python: "blank", TypeScript: "blank" }, [96 /* blnk */], [new Parameter("colour", "integer", false, 1)], null, 4, 0, "Blanks the entire Canvas with the specified <code>colour</code>."),
    new Command({ BASIC: "CANVAS", C: "canvas", Java: "canvas", Pascal: "canvas", Python: "canvas", TypeScript: "canvas" }, [144 /* canv */], [
      new Parameter("x1", "integer", false, 1),
      new Parameter("y1", "integer", false, 1),
      new Parameter("x2", "integer", false, 1),
      new Parameter("y2", "integer", false, 1)
    ], null, 4, 1, "Sets the top left Canvas coordinate to <code>(x1,y1)</code>, and the Canvas width and height to <code>x2</code> and <code>y2</code> respectively. Note that the width and height fix the number of virtual points on the Canvas, not the number of actual pixels."),
    new Command({ BASIC: "RESOLUTION", C: "resolution", Java: "resolution", Pascal: "resolution", Python: "resolution", TypeScript: "resolution" }, [145 /* reso */], [
      new Parameter("x", "integer", false, 1),
      new Parameter("y", "integer", false, 1)
    ], null, 4, 1, "Sets the Canvas resolution, i.e. the number of actual pixels in the <code>x</code> and <code>y</code> dimensions. To be used in conjunction with the <code>canvas</code> command, typically to set the number of actual pixels equal to the number of virtual points on the Canvas."),
    new Command({ BASIC: "PIXSET", C: "pixset", Java: "pixSet", Pascal: "pixset", Python: "pixset", TypeScript: "pixSet" }, [100 /* pixs */], [
      new Parameter("x", "integer", false, 1),
      new Parameter("y", "integer", false, 1),
      new Parameter("colour", "integer", false, 1)
    ], null, 4, 2, "Sets the <code>colour</code> at point <code>(x,y)</code>."),
    new Command({ BASIC: "PIXCOL", C: "pixcol", Java: "pixCol", Pascal: "pixcol", Python: "pixcol", TypeScript: "pixCol" }, [99 /* pixc */], [
      new Parameter("x", "integer", false, 1),
      new Parameter("y", "integer", false, 1)
    ], "integer", 4, 2, "Returns the RGB value of the colour at point <code>(x,y)</code>."),
    new Command({ BASIC: "RECOLOUR", C: "recolour", Java: "recolour", Pascal: "recolour", Python: "recolour", TypeScript: "recolour" }, [97 /* rcol */], [
      new Parameter("x", "integer", false, 1),
      new Parameter("y", "integer", false, 1),
      new Parameter("colour", "integer", false, 1)
    ], null, 4, 2, "Floods the Canvas with the specified <code>colour</code>, starting at point <code>(x,y)</code>, until reaching any different colour."),
    new Command({ BASIC: "FILL", C: "fill", Java: "fill", Pascal: "fill", Python: "fill", TypeScript: "fill" }, [98 /* fill */], [
      new Parameter("x", "integer", false, 1),
      new Parameter("y", "integer", false, 1),
      new Parameter("colour", "integer", false, 1),
      new Parameter("boundary", "integer", false, 1)
    ], null, 4, 2, "Floods the Canvas with the specified <code>colour</code>, starting at point <code>(x,y)</code>, until reaching the <code>boundary</code> colour."),
    new Command({ BASIC: "INC", C: null, Java: null, Pascal: "inc", Python: null, TypeScript: null }, [1 /* dupl */, 122 /* lptr */, 4 /* incr */, 2 /* swap */, 123 /* sptr */], [new Parameter("variable", "integer", true, 1)], null, 5, 0, "Increments the specified <code>variable</code> by 1."),
    new Command({ BASIC: "DEC", C: null, Java: null, Pascal: "dec", Python: null, TypeScript: null }, [1 /* dupl */, 122 /* lptr */, 5 /* decr */, 2 /* swap */, 123 /* sptr */], [new Parameter("variable", "integer", true, 1)], null, 5, 0, "Decrements the specified <code>variable</code> by 1."),
    new Command({ BASIC: "ABS", C: "abs", Java: "abs", Pascal: "abs", Python: "abs", TypeScript: "abs" }, [24 /* abs */], [new Parameter("n", "integer", false, 1)], "integer", 5, 0, "Returns the absolute value of <code>n</code>, i.e. <code>n</code> if positive, <code>-n</code> if negative."),
    new Command({ BASIC: "SGN", C: "sign", Java: "sign", Pascal: "sign", Python: "sign", TypeScript: "sign" }, [25 /* sign */], [new Parameter("a", "integer", false, 1)], "integer", 5, 1, "Returns <code>+1</code> if <code>a</code> is positive, <code>-1</code> if <code>a</code> is negative, and <code>0</code> otherwise."),
    new Command({ BASIC: "MAX", C: "max", Java: "max", Pascal: "max", Python: "max", TypeScript: "max" }, [38 /* maxi */], [
      new Parameter("a", "integer", false, 1),
      new Parameter("b", "integer", false, 1)
    ], "integer", 5, 1, "Returns the maximum of <code>a</code> and <code>b</code>."),
    new Command({ BASIC: "MIN", C: "min", Java: "min", Pascal: "min", Python: "min", TypeScript: "min" }, [39 /* mini */], [
      new Parameter("a", "integer", false, 1),
      new Parameter("b", "integer", false, 1)
    ], "integer", 5, 1, "Returns the minimum of <code>a</code> and <code>b</code>."),
    new Command({ BASIC: "SQR", C: "sqrt", Java: "sqrt", Pascal: "sqrt", Python: "sqrt", TypeScript: "sqrt" }, [49 /* sqrt */], [
      new Parameter("a", "integer", false, 1),
      new Parameter("mult", "integer", false, 1)
    ], "integer", 5, 1, "Returns <code>&radic;a</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."),
    new Command({ BASIC: "HYPOT", C: "hypot", Java: "hypot", Pascal: "hypot", Python: "hypot", TypeScript: "hypot" }, [50 /* hyp */], [
      new Parameter("a", "integer", false, 1),
      new Parameter("b", "integer", false, 1),
      new Parameter("mult", "integer", false, 1)
    ], "integer", 5, 1, "Returns <code>&radic;(a<sup>2</sup>+b<sup>2</sup>)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."),
    new Command({ BASIC: "RND", C: null, Java: null, Pascal: null, Python: null, TypeScript: null }, [7 /* rand */, 4 /* incr */], [new Parameter("n", "integer", false, 1)], "integer", 5, 1, "Returns a random integer between 1 and <code>n</code>."),
    new Command({ BASIC: null, C: "rand", Java: "randInt", Pascal: "random", Python: "randrange", TypeScript: "randInt" }, [7 /* rand */], [new Parameter("n", "integer", false, 1)], "integer", 5, 1, "Returns a random non-negative integer less than <code>n</code>."),
    new Command({ BASIC: null, C: null, Java: null, Pascal: null, Python: "randint", TypeScript: null }, [2 /* swap */, 1 /* dupl */, 3 /* rota */, 4 /* incr */, 2 /* swap */, 27 /* subt */, 7 /* rand */, 26 /* plus */], [
      new Parameter("a", "integer", false, 1),
      new Parameter("b", "integer", false, 1)
    ], "integer", 5, 1, "Returns a random integer between <code>a</code> and <code>b</code>."),
    new Command({ BASIC: "RNDSEED", C: "srand", Java: "seed", Pascal: "randseed", Python: "seed", TypeScript: "seed" }, [147 /* seed */], [new Parameter("seed", "integer", false, 1)], "integer", 5, 1, "Initialises the random number generator with the given <code>seed</code>, and returns that seed. If <code>seed</code> is 0, the seed is set from the current system clock."),
    new Command({ BASIC: "POWER", C: "pow", Java: "power", Pascal: "power", Python: "power", TypeScript: "pow" }, [52 /* powr */], [
      new Parameter("a", "integer", false, 1),
      new Parameter("b", "integer", false, 1),
      new Parameter("c", "integer", false, 1),
      new Parameter("mult", "integer", false, 1)
    ], "integer", 5, 2, "Returns <code>(a/b)<sup>c</sup></code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."),
    new Command({ BASIC: "ROOT", C: "root", Java: "root", Pascal: "root", Python: "root", TypeScript: "root" }, [51 /* root */], [
      new Parameter("a", "integer", false, 1),
      new Parameter("b", "integer", false, 1),
      new Parameter("c", "integer", false, 1),
      new Parameter("mult", "integer", false, 1)
    ], "integer", 5, 2, "Returns <code><sup>c</sup>&radic;(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."),
    new Command({ BASIC: "DIVMULT", C: "divmult", Java: "divmult", Pascal: "divmult", Python: "divmult", TypeScript: "divmult" }, [48 /* divm */], [
      new Parameter("a", "integer", false, 1),
      new Parameter("b", "integer", false, 1),
      new Parameter("mult", "integer", false, 1)
    ], "integer", 5, 2, "Returns <code>a/b</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."),
    new Command({ BASIC: "MAXINT", C: "maxint", Java: "maxInt", Pascal: "maxint", Python: "maxint", TypeScript: "maxInt" }, [6 /* mxin */], [], "integer", 5, 2, "Returns the maximum integer that the Machine can deal with (2<sup>31</sup>-1)."),
    new Command({ BASIC: null, C: null, Java: null, Pascal: "shl", Python: null, TypeScript: null }, [22 /* shft */], [
      new Parameter("number", "integer", false, 1),
      new Parameter("shift", "integer", false, 1)
    ], "integer", 5, 2, "Shift bits left."),
    new Command({ BASIC: null, C: null, Java: null, Pascal: "shr", Python: null, TypeScript: null }, [23 /* neg */, 22 /* shft */], [
      new Parameter("number", "integer", false, 1),
      new Parameter("shift", "integer", false, 1)
    ], "integer", 5, 2, "Shift bits right."),
    new Command({ BASIC: "SIN", C: "sin", Java: "sin", Pascal: "sin", Python: "sin", TypeScript: "sin" }, [57 /* sin */], [
      new Parameter("a", "integer", false, 1),
      new Parameter("b", "integer", false, 1),
      new Parameter("mult", "integer", false, 1)
    ], "integer", 6, 1, "Returns <code>sin(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."),
    new Command({ BASIC: "COS", C: "cos", Java: "cos", Pascal: "cos", Python: "cos", TypeScript: "cos" }, [58 /* cos */], [
      new Parameter("a", "integer", false, 1),
      new Parameter("b", "integer", false, 1),
      new Parameter("mult", "integer", false, 1)
    ], "integer", 6, 1, "Returns <code>cos(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."),
    new Command({ BASIC: "TAN", C: "tan", Java: "tan", Pascal: "tan", Python: "tan", TypeScript: "tan" }, [59 /* tan */], [
      new Parameter("a", "integer", false, 1),
      new Parameter("b", "integer", false, 1),
      new Parameter("mult", "integer", false, 1)
    ], "integer", 6, 1, "Returns <code>tan(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."),
    new Command({ BASIC: "PI", C: "pi", Java: "pi", Pascal: "pi", Python: "pi", TypeScript: "PI" }, [63 /* pi */], [new Parameter("mult", "integer", false, 1)], "integer", 6, 1, "Returns the value of Pi, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."),
    new Command({ BASIC: "EXP", C: "exp", Java: "exp", Pascal: "exp", Python: "exp", TypeScript: "exp" }, [56 /* exp */], [
      new Parameter("a", "integer", false, 1),
      new Parameter("b", "integer", false, 1),
      new Parameter("mult", "integer", false, 1)
    ], "integer", 6, 1, "Returns <code>a<sup>b</sup></code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."),
    new Command({ BASIC: "LN", C: "log", Java: "log", Pascal: "ln", Python: "log", TypeScript: "log" }, [55 /* ln */], [
      new Parameter("a", "integer", false, 1),
      new Parameter("b", "integer", false, 1),
      new Parameter("mult", "integer", false, 1)
    ], "integer", 6, 1, "Returns <code>ln(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."),
    new Command({ BASIC: "ANTILOG", C: "antilog", Java: "antilog", Pascal: "antilog", Python: "antilog", TypeScript: "antilog" }, [54 /* alog */], [
      new Parameter("a", "integer", false, 1),
      new Parameter("b", "integer", false, 1),
      new Parameter("mult", "integer", false, 1)
    ], "integer", 6, 2, "Returns <code>antilog<sub>10</sub>(a/b)</code> - i.e. <code>10<sup>a/b</sub></code> - multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."),
    new Command({ BASIC: "LOG10", C: "log10", Java: "log10", Pascal: "log10", Python: "log10", TypeScript: "log10" }, [53 /* log */], [
      new Parameter("a", "integer", false, 1),
      new Parameter("b", "integer", false, 1),
      new Parameter("mult", "integer", false, 1)
    ], "integer", 6, 2, "Returns <code>log<sub>10</sub>(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."),
    new Command({ BASIC: "ASN", C: "asin", Java: "asin", Pascal: "arcsin", Python: "asin", TypeScript: "asin" }, [60 /* asin */], [
      new Parameter("a", "integer", false, 1),
      new Parameter("b", "integer", false, 1),
      new Parameter("mult", "integer", false, 1)
    ], "integer", 6, 2, "Returns <code>arcsin(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."),
    new Command({ BASIC: "ACS", C: "acos", Java: "acos", Pascal: "arccos", Python: "acos", TypeScript: "acos" }, [61 /* acos */], [
      new Parameter("a", "integer", false, 1),
      new Parameter("b", "integer", false, 1),
      new Parameter("mult", "integer", false, 1)
    ], "integer", 6, 2, "Returns <code>arccos(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."),
    new Command({ BASIC: "ATN", C: "atan", Java: "atan", Pascal: "arctan", Python: "atan", TypeScript: "atan" }, [62 /* atan */], [
      new Parameter("a", "integer", false, 1),
      new Parameter("b", "integer", false, 1),
      new Parameter("mult", "integer", false, 1)
    ], "integer", 6, 2, "Returns <code>arctan(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers."),
    new Command({ BASIC: "WRITE", C: "write", Java: "write", Pascal: "write", Python: null, TypeScript: null }, [169 /* writ */], [new Parameter("string", "string", false, 1)], null, 7, 0, "Writes the input <code>string</code> to the console and textual output area of the System."),
    new Command({ BASIC: "WRITELN", C: "writeline", Java: "writeLine", Pascal: "writeln", Python: "print", TypeScript: "log" }, [169 /* writ */, 170 /* newl */], [new Parameter("string", "string", false, 1)], null, 7, 0, "Writes the input <code>string</code> to the console and textual output area of the System, followed by a line break."),
    new Command({ BASIC: "DISPLAY", C: "display", Java: "display", Pascal: "display", Python: "display", TypeScript: "display" }, [168 /* prnt */], [
      new Parameter("string", "string", false, 1),
      new Parameter("font", "integer", false, 1),
      new Parameter("size", "integer", false, 1)
    ], null, 7, 0, "Prints the input <code>string</code> in the Turtle&rsquo;s current colour and at the Turtle&rsquo;s current location, in the specified <code>font</code> and <code>size</code>. Can be used in conjunction with the <code>box</code> drawing command. For a list of available fonts, see the <b>Constants</b> tab."),
    new Command({ BASIC: "LCASE$", C: "strlwr", Java: "toLowerCase", Pascal: "lowercase", Python: "lower", TypeScript: "toLowerCase" }, [112 /* ldin */, 1, 66 /* case */], [new Parameter("string", "string", false, 1)], "string", 7, 1, "Returns the input <code>string</code> as all lowercase."),
    new Command({ BASIC: "UCASE$", C: "strupr", Java: "toUpperCase", Pascal: "uppercase", Python: "upper", TypeScript: "toUpperCase" }, [112 /* ldin */, 2, 66 /* case */], [new Parameter("string", "string", false, 1)], "string", 7, 1, "Returns the input <code>string</code> as all uppercase."),
    new Command({ BASIC: "CCASE$", C: "strcap", Java: "capitalize", Pascal: "initcap", Python: "capitalize", TypeScript: "capitalize" }, [112 /* ldin */, 3, 66 /* case */], [new Parameter("string", "string", false, 1)], "string", 7, 1, "Returns the input <code>string</code> with the first letter capitalized."),
    new Command({ BASIC: "TCASE$", C: "strtitle", Java: "toTitleCase", Pascal: "titlecase", Python: "title", TypeScript: "toTitleCase" }, [112 /* ldin */, 4, 66 /* case */], [new Parameter("string", "string", false, 1)], "string", 7, 1, "Returns the input <code>string</code> in title case (i.e. the first letter of each word capitalized)."),
    new Command({ BASIC: "SCASE$", C: "strswap", Java: "swapCase", Pascal: "swapcase", Python: "swapcase", TypeScript: "swapCase" }, [112 /* ldin */, 5, 66 /* case */], [new Parameter("string", "string", false, 1)], "string", 7, 1, "Returns the input <code>string</code> with all the cases swapped."),
    new Command({ BASIC: "LEN", C: "strlen", Java: "length", Pascal: "length", Python: "len", TypeScript: "length" }, [65 /* slen */], [new Parameter("string", "string", false, 1)], "integer", 7, 1, "Returns the length of the input <code>string</code> (i.e. the number of characters)."),
    new Command({ BASIC: "DEL$", C: null, Java: null, Pascal: "delete", Python: null, TypeScript: null }, [68 /* dels */], [
      new Parameter("string", "string", false, 1),
      new Parameter("index", "integer", false, 1),
      new Parameter("length", "integer", false, 1)
    ], "string", 7, 2, "Returns the input <code>string</code> with some characters removed, starting at the given <code>index</code> and of the specified <code>length</code>."),
    new Command({ BASIC: null, C: "strdel", Java: "delete", Pascal: null, Python: "delete", TypeScript: "delete" }, [2 /* swap */, 4 /* incr */, 2 /* swap */, 68 /* dels */], [
      new Parameter("string", "string", false, 1),
      new Parameter("index", "integer", false, 1),
      new Parameter("length", "integer", false, 1)
    ], "string", 7, 2, "Returns the input <code>string</code> with some characters removed, starting at the given <code>index</code> and of the specified <code>length</code>."),
    new Command({ BASIC: "LEFT$", C: null, Java: null, Pascal: null, Python: null, TypeScript: null }, [112 /* ldin */, 1, 2 /* swap */, 67 /* copy */], [
      new Parameter("string", "string", false, 1),
      new Parameter("length", "integer", false, 1)
    ], "string", 7, 2, "Returns a copy of the characters in the input <code>string</code>, starting on the left and of the specified <code>length</code>."),
    new Command({ BASIC: "MID$", C: null, Java: null, Pascal: "copy", Python: null, TypeScript: null }, [67 /* copy */], [
      new Parameter("string", "string", false, 1),
      new Parameter("index", "integer", false, 1),
      new Parameter("length", "integer", false, 1)
    ], "string", 7, 2, "Returns a copy of the characters in the input <code>string</code>, starting at the given <code>index</code> and of the specified <code>length</code>."),
    new Command({ BASIC: null, C: "strcpy", Java: "copy", Pascal: null, Python: "copy", TypeScript: "copy" }, [2 /* swap */, 4 /* incr */, 2 /* swap */, 67 /* copy */], [
      new Parameter("string", "string", false, 1),
      new Parameter("index", "integer", false, 1),
      new Parameter("length", "integer", false, 1)
    ], "string", 7, 2, "Returns a copy of the characters in the input <code>string</code>, starting at the given <code>index</code> and of the specified <code>length</code>."),
    new Command({ BASIC: "RIGHT$", C: null, Java: null, Pascal: null, Python: null, TypeScript: null }, [2 /* swap */, 1 /* dupl */, 65 /* slen */, 4 /* incr */, 3 /* rota */, 27 /* subt */, 6 /* mxin */, 67 /* copy */], [
      new Parameter("string", "string", false, 1),
      new Parameter("length", "integer", false, 1)
    ], "string", 7, 2, "Returns a copy of the characters in the input <code>string</code>, starting on the right and of the specified <code>length</code>."),
    new Command({ BASIC: "INSERT$", C: null, Java: null, Pascal: null, Python: null, TypeScript: null }, [3 /* rota */, 3 /* rota */, 69 /* inss */], [
      new Parameter("string", "string", false, 1),
      new Parameter("index", "integer", false, 1),
      new Parameter("substr", "string", false, 1)
    ], "string", 7, 2, "Returns the input <code>string</code> with the specified <code>substring</code> inserted at the given <code>index</code>."),
    new Command({ BASIC: null, C: "strins", Java: "insert", Pascal: null, Python: "insert", TypeScript: "insert" }, [3 /* rota */, 3 /* rota */, 2 /* swap */, 3 /* rota */, 4 /* incr */, 69 /* inss */], [
      new Parameter("string", "string", false, 1),
      new Parameter("substr", "string", false, 1),
      new Parameter("index", "integer", false, 1)
    ], "string", 7, 2, "Returns the input <code>string</code> with the specified <code>substring</code> inserted at the given <code>index</code>."),
    new Command({ BASIC: null, C: null, Java: null, Pascal: "insert", Python: null, TypeScript: null }, [69 /* inss */], [
      new Parameter("substr", "string", false, 1),
      new Parameter("string", "string", false, 1),
      new Parameter("index", "integer", false, 1)
    ], "string", 7, 2, "Returns the input <code>string</code> with the specified <code>substring</code> inserted at the given <code>index</code>."),
    new Command({ BASIC: "PAD$", C: "strpad", Java: "pad", Pascal: "pad", Python: "pad", TypeScript: null }, [72 /* spad */], [
      new Parameter("string", "string", false, 1),
      new Parameter("padding", "string", false, 1),
      new Parameter("length", "integer", false, 1)
    ], "string", 7, 2, "Returns the input <code>string</code> with the input <code>padding</code> added either before or after to make a string of minimum given <code>length</cope>. The <code>padding</code> is placed before if <code>length</code> is positive, after if it is negative."),
    new Command({ BASIC: null, C: null, Java: null, Pascal: null, Python: null, TypeScript: "padStart" }, [72 /* spad */], [
      new Parameter("string", "string", false, 1),
      new Parameter("padding", "string", false, 1),
      new Parameter("length", "integer", false, 1)
    ], "string", 7, 2, "Returns the input <code>string</code> with the input <code>padding</code> added before to make a string of minimum given <code>length</cope>."),
    new Command({ BASIC: null, C: null, Java: null, Pascal: null, Python: null, TypeScript: "padEnd" }, [23 /* neg */, 72 /* spad */], [
      new Parameter("string", "string", false, 1),
      new Parameter("padding", "string", false, 1),
      new Parameter("length", "integer", false, 1)
    ], "string", 7, 2, "Returns the input <code>string</code> with the input <code>padding</code> added after to make a string of minimum given <code>length</cope>."),
    new Command({ BASIC: "REPLACE$", C: "strrepl", Java: "replace", Pascal: "replace", Python: "replace", TypeScript: null }, [71 /* repl */], [
      new Parameter("string", "string", false, 1),
      new Parameter("substr", "string", false, 1),
      new Parameter("replace", "string", false, 1),
      new Parameter("n", "integer", false, 1)
    ], "string", 7, 2, "Returns the input <code>string</code> with up to <code>n</code> occurences of <code>substring</code> replaced by <code>replace</code>. Set <code>n</code> equal to <code>0</code> to replace every occurence."),
    new Command({ BASIC: "INSTR", C: null, Java: null, Pascal: null, Python: null, TypeScript: null }, [2 /* swap */, 70 /* poss */], [
      new Parameter("string", "string", false, 1),
      new Parameter("substr", "string", false, 1)
    ], "integer", 7, 2, "Searches for the input <code>substring</code> within the given <code>string</code>; returns the index of the first character if found, 0 otherwise."),
    new Command({ BASIC: null, C: "strpos", Java: "indexOf", Pascal: null, Python: "find", TypeScript: "indexOf" }, [2 /* swap */, 70 /* poss */, 5 /* decr */], [
      new Parameter("string", "string", false, 1),
      new Parameter("substr", "string", false, 1)
    ], "integer", 7, 2, "Searches for the input <code>substring</code> within the given <code>string</code>; returns the index of the first character if found, 0 otherwise."),
    new Command({ BASIC: null, C: null, Java: null, Pascal: "pos", Python: null, TypeScript: null }, [70 /* poss */], [
      new Parameter("substr", "string", false, 1),
      new Parameter("string", "string", false, 1)
    ], "integer", 7, 2, "Searches for the input <code>substring</code> within the given <code>string</code>; returns the index of the first character if found, 0 otherwise."),
    new Command({ BASIC: "STR$", C: "itoa", Java: "toString", Pascal: "str", Python: "str", TypeScript: "toString" }, [11 /* itos */], [new Parameter("n", "integer", false, 1)], "string", 8, 0, "Returns the integer <code>n</code> as a string, e.g. <code>str(12)='12'</code>."),
    new Command({ BASIC: "VAL", C: "atoi", Java: "parseInt", Pascal: "val", Python: "int", TypeScript: "parseInt" }, [112 /* ldin */, 0, 13 /* sval */], [new Parameter("string", "string", false, 1)], "integer", 8, 0, "Returns the input <code>string</code> as an integer, e.g. <code>val('12')=12</code>. Returns <code>0</code> if the string cannot be converted (i.e. if it is not an integer string)."),
    new Command({ BASIC: "VALDEF", C: "atoidef", Java: "parseIntDef", Pascal: "valdef", Python: "intdef", TypeScript: "parseIntDef" }, [13 /* sval */], [
      new Parameter("string", "string", false, 1),
      new Parameter("default", "integer", false, 1)
    ], "integer", 8, 0, "Returns the input <code>string</code> as an integer, e.g. <code>val('12')=12</code>. Returns the specified <code>default</code> value if the string cannot be converted (i.e. if it is not an integer string)."),
    new Command({ BASIC: "QSTR$", C: "qitoa", Java: "toStringQ", Pascal: "qstr", Python: "qstr", TypeScript: "toStringQ" }, [14 /* qtos */], [
      new Parameter("a", "integer", false, 1),
      new Parameter("b", "integer", false, 1),
      new Parameter("decplaces", "integer", false, 1)
    ], "string", 8, 1, "Returns the value of <code>a/b</code> to the specified number of decimal places, as a decimal string, e.g. <code>qstr(2,3,4)='0.6667'</code>."),
    new Command({ BASIC: "QVAL", C: "qatoi", Java: "parseIntQ", Pascal: "qval", Python: "qint", TypeScript: "parseIntQ" }, [15 /* qval */], [
      new Parameter("string", "string", false, 1),
      new Parameter("mult", "integer", false, 1),
      new Parameter("default", "integer", false, 1)
    ], "integer", 8, 1, "Returns the input decimal <code>string</code> as an integer, multiplied by <code>mult</code> and rounded to the nearest integer, e.g. <code>qval('1.5',10)=15</code>. Returns the specified <code>default</code> value if the string cannot be converted (i.e. if it is not a decimal string)."),
    new Command({ BASIC: "CHR$", C: null, Java: null, Pascal: null, Python: "chr", TypeScript: "fromCharCode" }, [9 /* ctos */], [new Parameter("n", "integer", false, 1)], "string", 8, 2, "Returns the character with ASCII character code <code>n</code>."),
    new Command({ BASIC: null, C: null, Java: "fromCharCode", Pascal: "chr", Python: null, TypeScript: null }, [], [new Parameter("n", "integer", false, 1)], "character", 8, 2, "Returns the character with ASCII character code <code>n</code>."),
    new Command({ BASIC: "ASC", C: null, Java: "charCode", Pascal: null, Python: "ord", TypeScript: "charCode" }, [10 /* sasc */], [new Parameter("char", "string", false, 1)], "integer", 8, 2, "Returns the ASCII code of the input character, or of the first character of the input string."),
    new Command({ BASIC: null, C: null, Java: null, Pascal: "ord", Python: null, TypeScript: null }, [], [new Parameter("char", "character", false, 1)], "integer", 8, 2, "Returns the ASCII code of the input character."),
    new Command({ BASIC: null, C: null, Java: null, Pascal: "boolint", Python: null, TypeScript: null }, [], [new Parameter("boolean", "boolean", false, 1)], "integer", 8, 2, "Returns the input <code>boolean</code> as an integer (-1 for <code>true</code>, 0 for <code>false</code>)."),
    new Command({ BASIC: null, C: null, Java: null, Pascal: null, Python: "int", TypeScript: null }, [], [new Parameter("boolean", "boolean", false, 1)], "integer", 8, 2, "Returns the input <code>boolean</code> as an integer (1 for <code>true</code>, 0 for <code>false</code>)."),
    new Command({ BASIC: null, C: null, Java: null, Pascal: null, Python: "bool", TypeScript: null }, [112 /* ldin */, 0, 33 /* noeq */], [new Parameter("integer", "integer", false, 1)], "boolean", 8, 2, "Returns the input <code>integer</code> as a boolean (0 is <code>false</code>, everything else is <code>true</code>)."),
    new Command({ BASIC: "HEX$", C: "itoahex", Java: "toStringHex", Pascal: "hexstr", Python: "hex", TypeScript: "toStringHex" }, [12 /* hexs */], [
      new Parameter("n", "integer", false, 1),
      new Parameter("minlength", "integer", false, 1)
    ], "string", 8, 2, "Returns a string representation of integer <code>n</code> in hexadecimal format, padded with leading zeros as up to <code>minlength</code>, e.g. <code>hexstr(255,6)='0000FF'</code>."),
    new Command({ BASIC: "PAUSE", C: "pause", Java: "pause", Pascal: "pause", Python: "pause", TypeScript: "pause" }, [174 /* wait */], [new Parameter("m", "integer", false, 1)], null, 9, 0, "Makes the Turtle Machine wait <code>m</code> milliseconds before performing the next operation. This is useful for controlling the speed of animations."),
    new Command({ BASIC: "HALT", C: "exit", Java: "halt", Pascal: "halt", Python: "halt", TypeScript: "halt" }, [130 /* halt */], [], null, 9, 0, "Halts the program."),
    new Command({ BASIC: "GETLINE$", C: "gets", Java: "readLine", Pascal: "readln", Python: "readline", TypeScript: "readLine" }, [164 /* rdln */], [], "string", 9, 0, "Waits for the RETURN key to be pressed, then returns everything in the keybuffer up to (and not including) the new line character."),
    new Command({ BASIC: "INPUT$", C: "scan", Java: "input", Pascal: "input", Python: "input", TypeScript: "input" }, [169 /* writ */, 170 /* newl */, 164 /* rdln */], [new Parameter("prompt", "string", false, 1)], "string", 9, 0, "Gives an input prompt, then returns the input when the RETURN key is pressed (using the keybuffer)."),
    new Command({ BASIC: "CURSOR", C: "cursor", Java: "cursor", Pascal: "cursor", Python: "cursor", TypeScript: "cursor" }, [171 /* curs */], [new Parameter("cursorcode", "integer", false, 1)], null, 9, 1, "Sets which cursor to display (1-15) when the mouse pointer is over the canvas. 0 hides the cursor; any value outside the range 0-15 resets the default cursor. For a list of available cursors, see the <b>Cursors</b> tab."),
    new Command({ BASIC: "KEYECHO", C: "keyecho", Java: "keyEcho", Pascal: "keyecho", Python: "keyecho", TypeScript: "keyEcho" }, [165 /* kech */], [new Parameter("on", "boolean", false, 1)], null, 9, 1, "Turns the keyboard echo to the console on (<code>true</code>) or off (<code>false</code>)."),
    new Command({ BASIC: "DETECT", C: "detect", Java: "detect", Pascal: "detect", Python: "detect", TypeScript: "detect" }, [175 /* tdet */], [
      new Parameter("inputcode", "integer", false, 1),
      new Parameter("m", "integer", false, 1)
    ], "integer", 9, 1, "Waits a maximum of <code>m</code> milliseconds for the key with the specified <code>inputcode</code> to be pressed; returns its current input value if pressed (and stops waiting), and <code>0</code> otherwise."),
    new Command({ BASIC: "GET$", C: "get", Java: "read", Pascal: "read", Python: "read", TypeScript: "read" }, [163 /* read */], [new Parameter("n", "integer", false, 1)], "string", 9, 1, "Returns the first <code>n</code> characters from the keybuffer as a string."),
    new Command({ BASIC: "TIME", C: "time", Java: "time", Pascal: "time", Python: "time", TypeScript: "time" }, [172 /* time */], [], "integer", 9, 1, "Returns the time (in milliseconds) since the program began."),
    new Command({ BASIC: "TIMESET", C: "timeset", Java: "timeSet", Pascal: "timeset", Python: "timeset", TypeScript: "timeSet" }, [173 /* tset */], [new Parameter("m", "integer", false, 1)], null, 9, 1, "Artificially sets the time since the program began to <code>m</code> milliseconds."),
    new Command({ BASIC: "RESET", C: "reset", Java: "reset", Pascal: "reset", Python: "reset", TypeScript: "reset" }, [161 /* iclr */], [new Parameter("\\inputcode", "integer", false, 1)], null, 9, 2, "Resets the specified <code>\\inputcode</code> (<code>\\mousex</code>, <code>\\mousey</code>, <code>\\backspace</code>, <code>\\enter</code>, etc.) to its initial value (i.e. -1)."),
    new Command({ BASIC: "STATUS", C: "status", Java: "status", Pascal: "status", Python: "status", TypeScript: "status" }, [PCode.stat], [new Parameter("\\inputcode", "integer", false, 1)], "integer", 9, 2, "Returns the <code>?kshift</code> value for the most recent press/click of the input with the specified <code>\\inputcode</code>."),
    new Command({ BASIC: "KEYBUFFER", C: "keybuffer", Java: "keyBuffer", Pascal: "keybuffer", Python: "keybuffer", TypeScript: "keyBuffer" }, [162 /* bufr */, 112 /* ldin */, 1, 123 /* sptr */, 141 /* hfix */], [new Parameter("n", "integer", false, 1)], null, 9, 2, "Creates a new custom keybuffer of length <code>n</code>. A keybuffer of length 32 is available by default; use this command if you need a larger buffer."),
    new Command({ BASIC: "CHDIR", C: null, Java: null, Pascal: "chdir", Python: null, TypeScript: null }, [176 /* chdr */], [new Parameter("directory name", "string", false, 1)], null, 10, 1, "Changes the current directory."),
    new Command({ BASIC: "RMDIR", C: null, Java: null, Pascal: "rmdir", Python: null, TypeScript: null }, [112 /* ldin */, 1, 178 /* diry */, 112 /* ldin */, 128, 34 /* less */], [new Parameter("subdirectory name", "string", false, 1)], "boolean", 10, 1, "Removes a subdirectory."),
    new Command({ BASIC: "MKDIR", C: null, Java: null, Pascal: "mkdir", Python: null, TypeScript: null }, [112 /* ldin */, 2, 178 /* diry */, 112 /* ldin */, 127, 35 /* more */], [new Parameter("subdirectory name", "string", false, 1)], "boolean", 10, 1, "Creates a subdirectory."),
    new Command({ BASIC: null, C: null, Java: null, Pascal: "openfile", Python: null, TypeScript: null }, [179 /* open */], [
      new Parameter("filename", "string", false, 1),
      new Parameter("mode", "integer", false, 1)
    ], "integer", 10, 1, "Opens a file (1: read, 2: append, 3: write)."),
    new Command({ BASIC: "OPENIN", C: null, Java: null, Pascal: null, Python: null, TypeScript: null }, [112 /* ldin */, 1, 179 /* open */], [new Parameter("filename", "string", false, 1)], "integer", 10, 1, "Open a file for reading."),
    new Command({ BASIC: "OPENUP", C: null, Java: null, Pascal: null, Python: null, TypeScript: null }, [112 /* ldin */, 2, 179 /* open */], [new Parameter("filename", "string", false, 1)], "integer", 10, 1, "Opens a file for appending."),
    new Command({ BASIC: "OPENOUT", C: null, Java: null, Pascal: null, Python: null, TypeScript: null }, [112 /* ldin */, 4, 179 /* open */], [new Parameter("filename", "string", false, 1)], "integer", 10, 1, "Opens a file for writing."),
    new Command({ BASIC: "CLOSE#", C: null, Java: null, Pascal: "closefile", Python: null, TypeScript: null }, [180 /* clos */], [new Parameter("file handle", "integer", false, 1)], null, 10, 1, "Closes a file."),
    new Command({ BASIC: "DELETEFILE", C: null, Java: null, Pascal: "deletefile", Python: null, TypeScript: null }, [112 /* ldin */, 1, 177 /* file */, 112 /* ldin */, 128, 34 /* less */], [new Parameter("filename", "string", false, 1)], "boolean", 10, 1, "Deletes a file."),
    new Command({ BASIC: "FREAD#", C: null, Java: null, Pascal: "fread", Python: null, TypeScript: null }, [184 /* frds */], [
      new Parameter("file handle", "integer", false, 1),
      new Parameter("n", "integer", false, 1)
    ], "string", 10, 1, "Reads n characters (maximum) from a file."),
    new Command({ BASIC: "FREADLN#", C: null, Java: null, Pascal: "freadln", Python: null, TypeScript: null }, [185 /* frln */], [new Parameter("file handle", "integer", false, 1)], "string", 10, 1, "Reads a line from a file."),
    new Command({ BASIC: "FWRITE#", C: null, Java: null, Pascal: "fwrite", Python: null, TypeScript: null }, [186 /* fwrs */], [
      new Parameter("file handle", "integer", false, 1),
      new Parameter("string", "string", false, 1)
    ], null, 10, 1, "Writes a string to a file."),
    new Command({ BASIC: "FWRITELN#", C: null, Java: null, Pascal: "fwriteln", Python: null, TypeScript: null }, [187 /* fwln */], [
      new Parameter("file handle", "integer", false, 1),
      new Parameter("string", "string", false, 1)
    ], null, 10, 1, "Writes a line to a file."),
    new Command({ BASIC: "EOF#", C: null, Java: null, Pascal: "eof", Python: null, TypeScript: null }, [182 /* eof */], [new Parameter("file handle", "integer", false, 1)], "boolean", 10, 1, "Tests for the end of file."),
    new Command({ BASIC: "CHECKDIR", C: null, Java: null, Pascal: "checkdir", Python: null, TypeScript: null }, [112 /* ldin */, 0, 178 /* diry */, 112 /* ldin */, 127, 35 /* more */], [
      new Parameter("directory name", "string", false, 1),
      new Parameter("code", "integer", false, 1)
    ], "integer", 10, 2, "Creates/deletes/checks a directory."),
    new Command({ BASIC: "CHECKFILE", C: null, Java: null, Pascal: "checkfile", Python: null, TypeScript: null }, [112 /* ldin */, 0, 177 /* file */, 112 /* ldin */, 127, 35 /* more */], [
      new Parameter("filename", "string", false, 1),
      new Parameter("code", "integer", false, 1)
    ], "integer", 10, 2, "Creates/deletes/checks a file."),
    new Command({ BASIC: "COPYFILE", C: null, Java: null, Pascal: "copyfile", Python: null, TypeScript: null }, [112 /* ldin */, 3, 191 /* fmov */], [
      new Parameter("old name", "string", false, 1),
      new Parameter("new name", "string", false, 1)
    ], "boolean", 10, 2, "Copies a file."),
    new Command({ BASIC: "DIREXISTS", C: null, Java: null, Pascal: "direxists", Python: null, TypeScript: null }, [112 /* ldin */, 0, 178 /* diry */, 112 /* ldin */, 127, 35 /* more */], [new Parameter("subdirectory name", "string", false, 1)], "boolean", 10, 2, "Checks whether a subdirectory exists."),
    new Command({ BASIC: "FILEEXISTS", C: null, Java: null, Pascal: "fileexists", Python: null, TypeScript: null }, [112 /* ldin */, 0, 177 /* file */, 112 /* ldin */, 127, 35 /* more */], [new Parameter("filename", "string", false, 1)], "boolean", 10, 2, "Checks whether a file exists."),
    new Command({ BASIC: "FINDDIR", C: null, Java: null, Pascal: "finddir", Python: null, TypeScript: null }, [1 /* dupl */, 122 /* lptr */, 3 /* rota */, 189 /* fdir */, 2 /* swap */, 3 /* rota */, 123 /* sptr */], [
      new Parameter("directory name pattern", "string", false, 1),
      new Parameter("file handle", "integer", false, 1)
    ], "string", 10, 2, "Finds the first directory matching the pattern."),
    new Command({ BASIC: "FINDFIRST", C: null, Java: null, Pascal: "findfirst", Python: null, TypeScript: null }, [1 /* dupl */, 122 /* lptr */, 3 /* rota */, 188 /* ffnd */, 2 /* swap */, 3 /* rota */, 123 /* sptr */], [
      new Parameter("filename pattern", "string", false, 1),
      new Parameter("file handle", "integer", false, 1)
    ], "string", 10, 2, "Finds the first file matching the pattern."),
    new Command({ BASIC: "FINDNEXT", C: null, Java: null, Pascal: "findnext", Python: null, TypeScript: null }, [190 /* fnxt */], [new Parameter("file handle", "integer", false, 1)], "string", 10, 2, "Finds the next file/directory matching a pattern."),
    new Command({ BASIC: "RENAMEFILE", C: null, Java: null, Pascal: "renamefile", Python: null, TypeScript: null }, [112 /* ldin */, 1, 191 /* fmov */], [
      new Parameter("old filename", "string", false, 1),
      new Parameter("new filename", "string", false, 1)
    ], "boolean", 10, 2, "Rename file"),
    new Command({ BASIC: "MOVEFILE", C: null, Java: null, Pascal: "movefile", Python: null, TypeScript: null }, [112 /* ldin */, 2, 191 /* fmov */], [
      new Parameter("old filename", "string", false, 1),
      new Parameter("new filename", "string", false, 1)
    ], "boolean", 10, 2, "Moves a file."),
    new Command({ BASIC: "RESTARTFILE", C: null, Java: null, Pascal: "restartfile", Python: null, TypeScript: null }, [181 /* fbeg */], [new Parameter("file handle", "integer", false, 1)], null, 10, 2, "Restarts reading a file."),
    new Command({ BASIC: "EOLN#", C: null, Java: null, Pascal: "eoln", Python: null, TypeScript: null }, [183 /* eoln */], [new Parameter("file handle", "integer", false, 1)], "boolean", 10, 2, "Tests for end of line in a file."),
    new Command({ BASIC: "DUMP", C: "dump", Java: "dump", Pascal: "dump", Python: "dump", TypeScript: "dump" }, [154 /* dump */], [], null, 11, 2, "&ldquo;Dumps&rdquo; the current memory state into the display in the memory tab."),
    new Command({ BASIC: "HEAPRESET", C: "heapreset", Java: "heapReset", Pascal: "heapreset", Python: "heapreset", TypeScript: "heapReset" }, [143 /* hrst */], [], null, 11, 2, "Resets the memory heap to the initial global value."),
    new Command({ BASIC: "ADDRESS", C: "address", Java: "address", Pascal: "address", Python: "address", TypeScript: "address" }, [], [new Parameter("variable", "integer", true, 1)], "integer", 11, 2, "Returns the address in memory of the given <code>variable</code>."),
    new Command({ BASIC: "PEEK", C: "peek", Java: "peek", Pascal: "peek", Python: "peek", TypeScript: "peek" }, [155 /* peek */], [new Parameter("address", "integer", false, 1)], "integer", 11, 2, "Peek at the value of the memory at the given <code>address</code>."),
    new Command({ BASIC: "POKE", C: "poke", Java: "poke", Pascal: "poke", Python: "poke", TypeScript: "poke" }, [156 /* poke */], [
      new Parameter("address", "integer", false, 1),
      new Parameter("value", "integer", false, 1)
    ], null, 11, 2, "Poke the <code>value</code> into the memory at the given <code>address</code>."),
    new Command({ BASIC: "TRACE", C: "trace", Java: "trace", Pascal: "trace", Python: "trace", TypeScript: "trace" }, [152 /* trac */], [new Parameter("on", "boolean", false, 1)], null, 11, 2, "Turns the PCode trace facility on (<code>true</code>) or off (<code>false</code>)."),
    new Command({ BASIC: "WATCH", C: "watch", Java: "watch", Pascal: "watch", Python: "watch", TypeScript: "watch" }, [153 /* memw */], [new Parameter("address", "integer", false, 1)], null, 11, 2, "Sets an <code>address</code> in memory for the trace facility to watch.")
  ];

  // client/constants/inputs.ts
  var Input = class {
    constructor(name, value) {
      this.names = {
        BASIC: name.length > 2 ? name.toUpperCase() : name,
        C: name,
        Java: name,
        Pascal: name,
        Python: name,
        TypeScript: name
      };
      this.value = value;
    }
  };
  var inputs = [
    new Input("?kshift", -10),
    new Input("?key", -9),
    new Input("?mousey", -8),
    new Input("?mousex", -7),
    new Input("?clicky", -6),
    new Input("?clickx", -5),
    new Input("?click", -4),
    new Input("?mmouse", -3),
    new Input("?rmouse", -2),
    new Input("?lmouse", -1),
    new Input("\\keybuffer", 0),
    new Input("\\backspace", 8),
    new Input("\\tab", 9),
    new Input("\\enter", 13),
    new Input("\\return", 13),
    new Input("\\shift", 16),
    new Input("\\ctrl", 17),
    new Input("\\alt", 18),
    new Input("\\pause", 19),
    new Input("\\capslock", 20),
    new Input("\\escape", 27),
    new Input("\\space", 32),
    new Input("\\pgup", 33),
    new Input("\\pgdn", 34),
    new Input("\\end", 35),
    new Input("\\home", 36),
    new Input("\\left", 37),
    new Input("\\up", 38),
    new Input("\\right", 39),
    new Input("\\down", 40),
    new Input("\\insert", 45),
    new Input("\\delete", 46),
    new Input("\\0", 48),
    new Input("\\1", 49),
    new Input("\\2", 50),
    new Input("\\3", 51),
    new Input("\\4", 52),
    new Input("\\5", 53),
    new Input("\\6", 54),
    new Input("\\7", 55),
    new Input("\\8", 56),
    new Input("\\9", 57),
    new Input("\\a", 65),
    new Input("\\b", 66),
    new Input("\\c", 67),
    new Input("\\d", 68),
    new Input("\\e", 69),
    new Input("\\f", 70),
    new Input("\\g", 71),
    new Input("\\h", 72),
    new Input("\\i", 73),
    new Input("\\j", 74),
    new Input("\\k", 75),
    new Input("\\l", 76),
    new Input("\\m", 77),
    new Input("\\n", 78),
    new Input("\\o", 79),
    new Input("\\p", 80),
    new Input("\\q", 81),
    new Input("\\r", 82),
    new Input("\\s", 83),
    new Input("\\t", 84),
    new Input("\\u", 85),
    new Input("\\v", 86),
    new Input("\\w", 87),
    new Input("\\x", 88),
    new Input("\\y", 89),
    new Input("\\z", 90),
    new Input("\\lwin", 91),
    new Input("\\rwin", 92),
    new Input("\\#0", 96),
    new Input("\\#1", 97),
    new Input("\\#2", 98),
    new Input("\\#3", 99),
    new Input("\\#4", 100),
    new Input("\\#5", 101),
    new Input("\\#6", 102),
    new Input("\\#7", 103),
    new Input("\\#8", 104),
    new Input("\\#9", 105),
    new Input("\\multiply", 106),
    new Input("\\add", 107),
    new Input("\\subtract", 109),
    new Input("\\decimal", 110),
    new Input("\\divide", 111),
    new Input("\\f1", 112),
    new Input("\\f2", 113),
    new Input("\\f3", 114),
    new Input("\\f4", 115),
    new Input("\\f5", 116),
    new Input("\\f6", 117),
    new Input("\\f7", 118),
    new Input("\\f8", 119),
    new Input("\\f9", 120),
    new Input("\\f10", 121),
    new Input("\\f11", 122),
    new Input("\\f12", 123),
    new Input("\\numlock", 144),
    new Input("\\scrolllock", 145),
    new Input("\\semicolon", 186),
    new Input("\\equals", 187),
    new Input("\\comma", 188),
    new Input("\\dash", 189),
    new Input("\\fullstop", 190),
    new Input("\\forwardslash", 191),
    new Input("\\singlequote", 192),
    new Input("\\openbracket", 219),
    new Input("\\backslash", 220),
    new Input("\\closebracket", 221),
    new Input("\\hash", 222),
    new Input("\\backtick", 223)
  ];

  // client/constants/keywords.ts
  var Keyword = class {
    constructor(category, level, name) {
      this.category = category;
      this.level = level;
      this.name = name;
    }
  };
  var BASIC = [
    new Keyword(20, 0, "IF"),
    new Keyword(20, 0, "ELSE"),
    new Keyword(20, 0, "FOR"),
    new Keyword(20, 1, "REPEAT"),
    new Keyword(20, 1, "WHILE"),
    new Keyword(20, 1, "DEF"),
    new Keyword(21, 1, "LOCAL"),
    new Keyword(21, 2, "PRIVATE"),
    new Keyword(22, 0, "RETURN"),
    new Keyword(22, 0, "CONST"),
    new Keyword(22, 0, "DIM"),
    new Keyword(22, 0, "END"),
    new Keyword(22, 0, "ENDPROC"),
    new Keyword(22, 0, "THEN"),
    new Keyword(22, 0, "ENDIF"),
    new Keyword(22, 0, "TO"),
    new Keyword(22, 0, "STEP"),
    new Keyword(22, 0, "NEXT"),
    new Keyword(22, 0, "UNTIL"),
    new Keyword(22, 0, "ENDWHILE")
  ];
  var C = [
    new Keyword(20, 0, "if"),
    new Keyword(20, 0, "else"),
    new Keyword(20, 0, "for"),
    new Keyword(20, 1, "while"),
    new Keyword(20, 1, "do"),
    new Keyword(22, 0, "const"),
    new Keyword(22, 0, "return")
  ];
  var Java = [
    new Keyword(20, 0, "if"),
    new Keyword(20, 0, "else"),
    new Keyword(20, 0, "for"),
    new Keyword(20, 1, "while"),
    new Keyword(20, 1, "do"),
    new Keyword(22, 0, "class"),
    new Keyword(22, 0, "final"),
    new Keyword(22, 0, "return")
  ];
  var Pascal = [
    new Keyword(20, 0, "if"),
    new Keyword(20, 0, "else"),
    new Keyword(20, 0, "for"),
    new Keyword(20, 1, "repeat"),
    new Keyword(20, 1, "while"),
    new Keyword(20, 1, "procedure"),
    new Keyword(20, 2, "function"),
    new Keyword(22, 0, "program"),
    new Keyword(22, 0, "var"),
    new Keyword(22, 0, "const"),
    new Keyword(22, 0, "array"),
    new Keyword(22, 0, "of"),
    new Keyword(22, 0, "begin"),
    new Keyword(22, 0, "end"),
    new Keyword(22, 0, "then"),
    new Keyword(22, 0, "to"),
    new Keyword(22, 0, "downto"),
    new Keyword(22, 0, "do"),
    new Keyword(22, 0, "until")
  ];
  var Python = [
    new Keyword(20, 0, "if"),
    new Keyword(20, 0, "else"),
    new Keyword(20, 0, "elif"),
    new Keyword(20, 0, "for"),
    new Keyword(20, 1, "while"),
    new Keyword(20, 1, "def"),
    new Keyword(21, 1, "global"),
    new Keyword(21, 2, "nonlocal"),
    new Keyword(22, 0, "in"),
    new Keyword(22, 0, "pass"),
    new Keyword(22, 0, "return")
  ];
  var TypeScript = [
    new Keyword(20, 0, "if"),
    new Keyword(20, 0, "else"),
    new Keyword(20, 0, "for"),
    new Keyword(20, 1, "while"),
    new Keyword(20, 1, "do"),
    new Keyword(20, 1, "function"),
    new Keyword(22, 0, "var"),
    new Keyword(22, 0, "const"),
    new Keyword(22, 0, "return")
  ];
  var keywords = { BASIC, C, Java, Pascal, Python, TypeScript };

  // client/lexer/tokenize.ts
  function tokenize(code3, language2) {
    const tokens = [];
    let line2 = 1;
    let character = 1;
    while (code3.length > 0) {
      const token = spaces(code3, language2, line2, character) || newline(code3, language2, line2, character) || comment(code3, language2, line2, character) || operatorOrDelimiter(code3, language2, line2, character) || string(code3, language2, line2, character) || boolean(code3, language2, line2, character) || binary(code3, language2, line2, character) || octal(code3, language2, line2, character) || hexadecimal(code3, language2, line2, character) || decimal(code3, language2, line2, character) || keyword(code3, language2, line2, character) || type(code3, language2, line2, character) || keycode(code3, language2, line2, character) || query2(code3, language2, line2, character) || turtle2(code3, language2, line2, character) || identifier(code3, language2, line2, character) || illegal(code3, language2, line2, character);
      tokens.push(token);
      code3 = code3.slice(token.content.length);
      if (token.type === "newline") {
        line2 += 1;
        character = 1;
      } else {
        character += token.content.length;
      }
    }
    return tokens;
  }
  function spaces(code3, language2, line2, character) {
    const test = code3.match(/^( +)/);
    return test ? new Token("spaces", test[0], line2, character) : false;
  }
  function newline(code3, language2, line2, character) {
    const test = code3[0] === "\n";
    return test ? new Token("newline", "\n", line2, character) : false;
  }
  function comment(code3, language2, line2, character) {
    switch (language2) {
      case "BASIC":
        const startBASIC = code3.match(/^REM/);
        return startBASIC ? new Token("comment", code3.split("\n")[0], line2, character) : false;
      case "C":
      case "Java":
      case "TypeScript":
        const startCorTS = code3.match(/^\/\//);
        return startCorTS ? new Token("comment", code3.split("\n")[0], line2, character) : false;
      case "Pascal":
        const start = code3[0] === "{";
        const end = code3.match(/}/);
        if (start && end) {
          return new Token("comment", code3.slice(0, end.index + 1), line2, character);
        }
        if (start) {
          return new Token("unterminated-comment", code3.split("\n")[0], line2, character);
        }
        return false;
      case "Python":
        const startPython = code3.match(/^#/);
        return startPython ? new Token("comment", code3.split("\n")[0], line2, character) : false;
    }
  }
  function operatorOrDelimiter(code3, language2, line2, character) {
    switch (language2) {
      case "BASIC":
      case "C":
      case "Java":
      case "TypeScript":
        return operator(code3, language2, line2, character) || delimiter(code3, language2, line2, character);
      case "Pascal":
        return operator(code3, language2, line2, character) || delimiter(code3, language2, line2, character);
      case "Python":
        return delimiter(code3, language2, line2, character) || operator(code3, language2, line2, character);
    }
  }
  function operator(code3, language2, line2, character) {
    const tests = {
      BASIC: /^(\+|-|\*|\/|DIV\b|MOD\b|=|<>|<=|>=|<|>|ANDL\b|ORL\b|NOT\b|AND\b|OR\b|EOR\b)/,
      C: /^(\+|-|\*|\/|div\b|%|==|!=|<=|>=|<|>|=|!|&&|\|\||~|&|\||\^)/,
      Java: /^(\+|-|\*|\/|div\b|%|==|!=|<=|>=|<|>|=|!|&&|\|\||~|&|\||\^)/,
      Pascal: /^(\+|-|\*|\/|div\b|mod\b|=|<>|<=|>=|<|>|:=|andl\b|orl\b|not\b|and\b|or\b|xor\b)/i,
      Python: /^(\+|-|\*|\/\/|\/|%|==|!=|<=|>=|<|>|=|not\b|and\b|or\b|~|&|\||\^)/,
      TypeScript: /^(\+|-|\*|\/|div\b|%|==|!=|<=|>=|<|>|=|!|&&|\|\||~|&|\||\^)/
    };
    const test = code3.match(tests[language2]);
    return test ? new Token("operator", test[0], line2, character) : false;
  }
  function delimiter(code3, language2, line2, character) {
    const tests = {
      BASIC: /^(\(|\)|,|:)/,
      C: /^(\(|\)|{|}|\[|\]|,|;)/,
      Java: /^(\(|\)|{|}|\[|\]|,|;)/,
      Pascal: /^(\(|\)|\[|\]|,|:|;|\.\.|\.)/,
      Python: /^(\(|\)|\[|\]|,|:|;|->)/,
      TypeScript: /^(\(|\)|{|}|\[|\]|,|;|:)/
    };
    const test = code3.match(tests[language2]);
    return test ? new Token("delimiter", test[0], line2, character) : false;
  }
  function string(code3, language2, line2, character) {
    code3 = code3.split("\n")[0];
    switch (language2) {
      case "BASIC":
      case "Pascal":
        if (code3[0] === "'" || code3[0] === '"') {
          const quote = code3[0];
          let length = 1;
          let end = false;
          while (code3[length] && !end) {
            if (code3[length] === "\n") {
              return new Token("unterminated-string", code3.slice(0, length), line2, character);
            }
            if (code3[length] !== quote) {
              length += 1;
            } else {
              length += 1;
              if (code3[length] !== quote) {
                end = true;
              } else {
                length += 1;
              }
            }
          }
          if (!end) {
            return new Token("unterminated-string", code3.slice(0, length), line2, character);
          }
          return new Token("string", code3.slice(0, length), line2, character);
        }
        return false;
      case "C":
      case "Java":
      case "Python":
      case "TypeScript":
        const start1 = code3[0] === "'";
        const start2 = code3[0] === '"';
        const end1 = code3.match(/[^\\](')/);
        const end2 = code3.match(/[^\\](")/);
        if (start1 && end1) {
          return new Token("string", code3.slice(0, end1.index + 2), line2, character);
        }
        if (start1) {
          return new Token("unterminated-string", code3.split("\n")[0], line2, character);
        }
        if (start2 && end2) {
          return new Token("string", code3.slice(0, end2.index + 2), line2, character);
        }
        if (start2) {
          return new Token("unterminated-string", code3.split("\n")[0], line2, character);
        }
        return false;
    }
  }
  function boolean(code3, language2, line2, character) {
    const tests = {
      BASIC: /^(TRUE|FALSE)\b/,
      C: /^(true|false)\b/,
      Java: /^(true|false)\b/,
      Pascal: /^(true|false)\b/i,
      Python: /^(True|False)\b/,
      TypeScript: /^(true|false)\b/
    };
    const test = code3.match(tests[language2]);
    return test ? new Token("boolean", test[0], line2, character) : false;
  }
  function binary(code3, language2, line2, character) {
    switch (language2) {
      case "BASIC":
      case "Pascal":
        const good = code3.match(/^(%[01]+)\b/);
        const bad = code3.match(/^(0b[01]+)\b/);
        if (good) {
          return new Token("binary", good[0], line2, character);
        }
        if (bad) {
          return new Token("bad-binary", bad[0], line2, character);
        }
        return false;
      case "C":
      case "Java":
      case "Python":
      case "TypeScript":
        const test = code3.match(/^(0b[01]+)\b/);
        if (test) {
          return new Token("binary", test[0], line2, character);
        }
        return false;
    }
  }
  function octal(code3, language2, line2, character) {
    switch (language2) {
      case "BASIC":
        return false;
      case "Pascal":
        const goodPascal = code3.match(/^(&[0-7]+)\b/);
        const badPascal = code3.match(/^(0o[0-7]+)\b/);
        if (goodPascal) {
          return new Token("octal", goodPascal[0], line2, character);
        }
        if (badPascal) {
          return new Token("bad-octal", badPascal[0], line2, character);
        }
        return false;
      case "C":
      case "Java":
      case "Python":
      case "TypeScript":
        const testPython = code3.match(/^(0o[0-7]+)\b/);
        if (testPython) {
          return new Token("octal", testPython[0], line2, character);
        }
        return false;
    }
  }
  function hexadecimal(code3, language2, line2, character) {
    const bads = {
      BASIC: /^((\$|(0x))[A-Fa-f0-9]+)\b/,
      C: /^((&|#|\$)[A-Fa-f0-9]+)\b/,
      Java: /^((&|#|\$)[A-Fa-f0-9]+)\b/,
      Pascal: /^((&|(0x))[A-Fa-f0-9]+)\b/,
      Python: /^((&|#|\$)[A-Fa-f0-9]+)\b/,
      TypeScript: /^((&|#|\$)[A-Fa-f0-9]+)\b/
    };
    const goods = {
      BASIC: /^((&|#)[A-Fa-f0-9]+)\b/,
      C: /^((0x|#)[A-Fa-f0-9]+)\b/,
      Java: /^((0x|#)[A-Fa-f0-9]+)\b/,
      Pascal: /^((\$|#)[A-Fa-f0-9]+)\b/,
      Python: /^(0x[A-Fa-f0-9]+)\b/,
      TypeScript: /^((0x|#)[A-Fa-f0-9]+)\b/
    };
    const bad = code3.match(bads[language2]);
    const good = code3.match(goods[language2]);
    if (bad) {
      return new Token("bad-hexadecimal", bad[0], line2, character);
    }
    if (good) {
      return new Token("hexadecimal", good[0], line2, character);
    }
    return false;
  }
  function decimal(code3, language2, line2, character) {
    const good = code3.match(/^(\d+)\b/);
    const bad = code3.match(/^(\d+\.\d+)/);
    if (bad) {
      return new Token("real", bad[0], line2, character);
    }
    if (good) {
      return new Token("decimal", good[0], line2, character);
    }
    return false;
  }
  function keyword(code3, language2, line2, character) {
    const names = keywords[language2].map((x) => x.name).join("|");
    const regex = language2 === "Pascal" ? new RegExp(`^(${names})\\b`, "i") : new RegExp(`^(${names})\\b`);
    const test = code3.match(regex);
    return test ? new Token("keyword", test[0], line2, character) : false;
  }
  function type(code3, language2, line2, character) {
    let test = null;
    switch (language2) {
      case "C":
        test = code3.match(/^(void|bool|char|int|string)\b/);
        break;
      case "Java":
        test = code3.match(/^(void|boolean|char|int|String)\b/);
        break;
      case "Pascal":
        test = code3.match(/^(boolean|char|integer|string)\b/i);
        break;
      case "TypeScript":
        test = code3.match(/^(void|boolean|number|string)\b/);
        break;
    }
    return test ? new Token("type", test[0], line2, character) : false;
  }
  function keycode(code3, language2, line2, character) {
    const names = inputs.filter((x) => x.value >= 0).map((x) => x.names[language2].replace(/\\/, "\\\\")).join("|");
    const regex = language2 === "Pascal" ? new RegExp(`^(${names})\\b`, "i") : new RegExp(`^(${names})\\b`);
    const good = code3.match(regex);
    const bad = code3.match(/^(\\[#a-zA-Z0-9]*)\b/);
    if (good) {
      return new Token("keycode", good[0], line2, character);
    }
    if (bad) {
      return new Token("bad-keycode", bad[0], line2, character);
    }
    return false;
  }
  function query2(code3, language2, line2, character) {
    const names = inputs.filter((x) => x.value < 0).map((x) => x.names[language2].replace(/\?/, "\\?")).join("|");
    const regex = language2 === "Pascal" ? new RegExp(`^(${names})\\b`, "i") : new RegExp(`^(${names})\\b`);
    const good = code3.match(regex);
    const bad = code3.match(/^(\?[#a-zA-Z0-9]*)\b/);
    if (good) {
      return new Token("query", good[0], line2, character);
    }
    if (bad) {
      return new Token("bad-query", bad[0], line2, character);
    }
    return false;
  }
  function turtle2(code3, language2, line2, character) {
    const tests = {
      BASIC: /^(turt[xydatc]%)/,
      C: /^(turt[xydatc])\b/,
      Java: /^(turt[xydatc])\b/,
      Pascal: /^(turt[xydatc])\b/i,
      Python: /^(turt[xydatc])\b/,
      TypeScript: /^(turt[xydatc])\b/
    };
    const test = code3.match(tests[language2]);
    return test ? new Token("turtle", test[0], line2, character) : false;
  }
  function identifier(code3, language2, line2, character) {
    const test = language2 === "BASIC" ? code3.match(/^([_a-zA-Z][_a-zA-Z0-9]*\$\d*|[_a-zA-Z][_a-zA-Z0-9]*%?)/) : code3.match(/^([_a-zA-Z][_a-zA-Z0-9]*)\b/);
    if (test) {
      const name = language2 === "Pascal" ? test[0].toLowerCase() : test[0];
      const colour2 = colours.find((x) => x.names[language2] === name);
      const command2 = commands.find((x) => x.names[language2] === name);
      if (colour2) {
        return new Token("colour", test[0], line2, character);
      }
      if (command2) {
        return new Token("command", test[0], line2, character);
      }
      if (language2 === "Python" && name === "range") {
        return new Token("command", test[0], line2, character);
      }
      return new Token("identifier", test[0], line2, character);
    }
    return false;
  }
  function illegal(code3, language2, line2, character) {
    return new Token("illegal", code3.split(/\s/)[0], line2, character);
  }

  // client/lexer/lexeme.ts
  var LexemeClass = class {
    constructor(line2, character, content) {
      this.line = line2;
      this.character = character;
      this.content = content;
    }
  };
  var NewlineLexeme = class extends LexemeClass {
    constructor(token) {
      super(token.line, token.character, "[newline]");
      this.type = "newline";
    }
  };
  var IndentLexeme = class extends LexemeClass {
    constructor(token) {
      super(token.line, token.character, "[dedent]");
      this.type = "indent";
    }
  };
  var DedentLexeme = class extends LexemeClass {
    constructor(token) {
      super(token.line, token.character, "[dedent]");
      this.type = "dedent";
    }
  };
  var CommentLexeme = class extends LexemeClass {
    constructor(token, language2) {
      super(token.line, token.character, token.content);
      this.type = "comment";
      this.subtype = null;
      switch (language2) {
        case "BASIC":
          this.value = token.content.slice(3).trim();
          break;
        case "C":
        case "Java":
        case "TypeScript":
          this.value = token.content.slice(2).trim();
          break;
        case "Pascal":
          this.value = token.content.slice(1, -1).trim();
          break;
        case "Python":
          this.value = token.content.slice(1).trim();
          break;
      }
    }
  };
  var KeywordLexeme = class extends LexemeClass {
    constructor(token) {
      super(token.line, token.character, token.content);
      this.type = "keyword";
      this.subtype = token.content.toLowerCase();
    }
  };
  var TypeLexeme = class extends LexemeClass {
    constructor(token) {
      super(token.line, token.character, token.content);
      this.type = "type";
      this.subtype = null;
      switch (token.content) {
        case "bool":
        case "boolean":
          this.subtype = "boolean";
          break;
        case "char":
          this.subtype = "character";
          break;
        case "int":
        case "integer":
        case "number":
          this.subtype = "integer";
          break;
        case "string":
        case "String":
          this.subtype = "string";
          break;
      }
    }
  };
  var OperatorLexeme = class extends LexemeClass {
    constructor(token, language2) {
      super(token.line, token.character, token.content);
      this.type = "operator";
      this.subtype = "asgn";
      switch (token.content.toLowerCase()) {
        case "+":
          this.subtype = "plus";
          break;
        case "-":
          this.subtype = "subt";
          break;
        case "*":
          this.subtype = "mult";
          break;
        case "/":
          this.subtype = "divr";
          break;
        case "div":
        case "//":
          this.subtype = "div";
          break;
        case "mod":
        case "%":
          this.subtype = "mod";
          break;
        case "=":
          this.subtype = language2 === "BASIC" || language2 === "Pascal" ? "eqal" : "asgn";
          break;
        case "==":
          this.subtype = "eqal";
          break;
        case "<>":
        case "!=":
          this.subtype = "noeq";
          break;
        case "<=":
          this.subtype = "lseq";
          break;
        case ">=":
          this.subtype = "mreq";
          break;
        case "<":
          this.subtype = "less";
          break;
        case ">":
          this.subtype = "more";
          break;
        case "not":
        case "~":
        case "!":
          this.subtype = "not";
          break;
        case "and":
          this.subtype = language2 === "Python" ? "andl" : "and";
          break;
        case "or":
          this.subtype = language2 === "Python" ? "orl" : "or";
          break;
        case "andl":
        case "&&":
          this.subtype = "andl";
          break;
        case "&":
          this.subtype = "and";
          break;
        case "orl":
        case "||":
          this.subtype = "orl";
          break;
        case "|":
          this.subtype = "or";
          break;
        case "eor":
        case "xor":
        case "^":
          this.subtype = "xor";
          break;
      }
    }
  };
  var DelimiterLexeme = class extends LexemeClass {
    constructor(token) {
      super(token.line, token.character, token.content);
      this.type = "delimiter";
      this.subtype = token.content;
    }
  };
  var BooleanLexeme = class extends LexemeClass {
    constructor(token, language2) {
      super(token.line, token.character, token.content);
      this.type = "literal";
      this.subtype = "boolean";
      if (language2 === "C" || language2 === "Python") {
        this.value = token.content.toLowerCase() === "true" ? 1 : 0;
      } else {
        this.value = token.content.toLowerCase() === "true" ? -1 : 0;
      }
    }
  };
  var IntegerLexeme = class extends LexemeClass {
    constructor(token, radix) {
      super(token.line, token.character, token.content);
      this.type = "literal";
      this.subtype = "integer";
      const firstNonInteger = token.content.match(/[^0-9]/);
      const trimmedContent = firstNonInteger ? token.content.slice((firstNonInteger.index || 0) + 1) : token.content;
      this.value = parseInt(trimmedContent, radix);
      this.radix = radix;
    }
  };
  var CharacterLexeme = class extends LexemeClass {
    constructor(lexeme) {
      super(lexeme.line, lexeme.character, lexeme.content);
      this.type = "literal";
      this.subtype = "character";
      this.value = lexeme.value.charCodeAt(0);
    }
  };
  var StringLexeme = class extends LexemeClass {
    constructor(token, language2) {
      super(token.line, token.character, token.content);
      this.type = "literal";
      this.subtype = "string";
      switch (language2) {
        case "BASIC":
          this.value = token.content.slice(1, -1).replace(/""/g, '"');
          break;
        case "Pascal":
          if (token.content[0] === "'") {
            this.value = token.content.slice(1, -1).replace(/''/g, "'");
          } else {
            this.value = token.content.slice(1, -1).replace(/""/g, '"');
          }
          break;
        case "C":
        case "Java":
          this.value = token.content.slice(1, -1).replace(/\\('|")/g, "$1");
          break;
        case "Python":
        case "TypeScript":
          this.value = token.content.slice(1, -1).replace(/\\('|")/g, "$1");
          break;
      }
    }
  };
  var KeycodeLexeme = class extends LexemeClass {
    constructor(token, language2) {
      super(token.line, token.character, token.content);
      this.type = "input";
      this.subtype = "keycode";
      this.value = language2 === "Pascal" ? token.content.toLowerCase() : token.content;
    }
  };
  var QueryLexeme = class extends LexemeClass {
    constructor(token, language2) {
      super(token.line, token.character, token.content);
      this.type = "input";
      this.subtype = "query";
      this.value = language2 === "Pascal" ? token.content.toLowerCase() : token.content;
    }
  };
  var IdentifierLexeme = class extends LexemeClass {
    constructor(token, language2) {
      super(token.line, token.character, token.content);
      this.type = "identifier";
      this.subtype = token.type === "turtle" ? "turtle" : "identifier";
      this.value = language2 === "Pascal" ? token.content.toLowerCase() : token.content;
    }
  };

  // client/lexer/lexify.ts
  function lexify(code3, language2) {
    const tokens = typeof code3 === "string" ? tokenize(code3, language2) : code3;
    const lexemes = [];
    const indents = [0];
    let index = 0;
    let indent = indents[0];
    while (index < tokens.length) {
      switch (tokens[index].type) {
        case "spaces":
          break;
        case "newline":
          if (language2 === "BASIC" || language2 === "Python" || language2 === "TypeScript") {
            if (lexemes[lexemes.length - 1]) {
              if (lexemes[lexemes.length - 1].type !== "newline" && lexemes[lexemes.length - 1].type !== "comment") {
                lexemes.push(new NewlineLexeme(tokens[index]));
              }
            }
            while (tokens[index + 1] && tokens[index + 1].type === "newline") {
              index += 1;
            }
          }
          if (language2 === "Python") {
            indent = tokens[index + 1] && tokens[index + 1].type === "spaces" ? tokens[index + 1].content.length : 0;
            if (indent > indents[indents.length - 1]) {
              indents.push(indent);
              lexemes.push(new IndentLexeme(tokens[index + 1]));
            } else {
              while (indent < indents[indents.length - 1]) {
                indents.pop();
                lexemes.push(new DedentLexeme(tokens[index + 1] || tokens[index]));
              }
              if (indent !== indents[indents.length - 1]) {
                throw new CompilerError(`Inconsistent indentation at line ${(tokens[index + 1] || tokens[index]).line}.`);
              }
            }
          }
          break;
        case "comment":
          lexemes.push(new CommentLexeme(tokens[index], language2));
          if (language2 === "BASIC" || language2 === "Python") {
            lexemes.push(new NewlineLexeme(tokens[index + 1] || tokens[index]));
          }
          break;
        case "keyword":
          lexemes.push(new KeywordLexeme(tokens[index]));
          break;
        case "type":
          lexemes.push(new TypeLexeme(tokens[index]));
          break;
        case "operator":
          lexemes.push(new OperatorLexeme(tokens[index], language2));
          break;
        case "delimiter":
          lexemes.push(new DelimiterLexeme(tokens[index]));
          break;
        case "string":
          const stringLexeme = new StringLexeme(tokens[index], language2);
          const isCharacter = stringLexeme.value.length === 1;
          if (isCharacter && (language2 === "C" || language2 === "Java" || language2 === "Pascal")) {
            lexemes.push(new CharacterLexeme(stringLexeme));
          } else {
            lexemes.push(stringLexeme);
          }
          break;
        case "boolean":
          lexemes.push(new BooleanLexeme(tokens[index], language2));
          break;
        case "binary":
          lexemes.push(new IntegerLexeme(tokens[index], 2));
          break;
        case "octal":
          lexemes.push(new IntegerLexeme(tokens[index], 8));
          break;
        case "hexadecimal":
          lexemes.push(new IntegerLexeme(tokens[index], 16));
          break;
        case "decimal":
          lexemes.push(new IntegerLexeme(tokens[index], 10));
          break;
        case "keycode":
          lexemes.push(new KeycodeLexeme(tokens[index], language2));
          break;
        case "query":
          lexemes.push(new QueryLexeme(tokens[index], language2));
          break;
        case "command":
        case "turtle":
        case "colour":
        case "identifier":
          lexemes.push(new IdentifierLexeme(tokens[index], language2));
          break;
        case "unterminated-comment":
          throw new CompilerError("Unterminated comment.", tokens[index]);
        case "unterminated-string":
          throw new CompilerError("Unterminated string.", tokens[index]);
        case "bad-binary":
        case "bad-octal":
        case "bad-hexadecimal":
          throw new CompilerError("Ill-formed integer literal.", tokens[index]);
        case "real":
          throw new CompilerError("The Turtle System does not support real numbers.", tokens[index]);
        case "bad-keycode":
          throw new CompilerError("Unrecognised input keycode.", tokens[index]);
        case "bad-query":
          throw new CompilerError("Unrecognised input query.", tokens[index]);
        case "illegal":
          throw new CompilerError("Illegal character in this context.", tokens[index]);
      }
      index += 1;
    }
    return lexemes;
  }

  // client/parser/basic/identifier.ts
  function identifier2(lexemes) {
    const identifier8 = lexemes.get();
    if (!identifier8) {
      throw new CompilerError("{lex} must be followed by an identifier.", lexemes.get(-1));
    }
    if (identifier8.type !== "identifier") {
      throw new CompilerError("{lex} is not a valid identifier.", identifier8);
    }
    if (identifier8.subtype === "turtle") {
      throw new CompilerError("{lex} is already the name of a predefined Turtle property.", identifier8);
    }
    lexemes.next();
    return identifier8.content;
  }
  function subroutineName(lexemes) {
    const name = identifier2(lexemes);
    let subroutineType;
    if (name.slice(0, 4) === "PROC") {
      subroutineType = "procedure";
    } else if (name.slice(0, 2) === "FN") {
      subroutineType = "function";
    } else {
      throw new CompilerError('{lex} is not a valid subroutine name. (Procedure names must begin with "PROC", and function names must begin with "FN".)', lexemes.get(-1));
    }
    const test = name.match(/\$(\d+)$/);
    let type8 = "boolint";
    let stringLength = 32;
    if (name.slice(-1) === "$") {
      type8 = "string";
    } else if (test) {
      type8 = "string";
      stringLength = parseInt(test[1], 10);
    }
    return [name, subroutineType, type8, stringLength];
  }
  function variableName(lexemes) {
    const name = identifier2(lexemes);
    const test = name.match(/\$(\d+)$/);
    let type8;
    let stringLength = 32;
    if (name.slice(-1) === "%") {
      type8 = "boolint";
    } else if (name.slice(-1) === "$") {
      type8 = "string";
    } else if (test) {
      type8 = "string";
      stringLength = parseInt(test[1], 10);
    } else {
      throw new CompilerError('{lex} is not the name of any recognised command or a valid variable name. (Boolean and integer variables end with "%", and string variables end with "$".)', lexemes.get(-1));
    }
    return [name, type8, stringLength];
  }

  // client/parser/definitions/routine.ts
  var Routine = class {
    constructor(language2, name) {
      this.name = "!";
      this.index = 0;
      this.start = 0;
      this.end = 0;
      this.constants = [];
      this.variables = [];
      this.subroutines = [];
      this.statements = [];
      this.language = language2;
      if (name) {
        this.name = language2 === "Pascal" ? name.toLowerCase() : name;
      }
    }
    get parameters() {
      return this.variables.filter((x) => x.isParameter);
    }
    get memoryNeeded() {
      return this.variables.reduce((x, y) => x + y.length, 0);
    }
    get allSubroutines() {
      const allSubroutines = [];
      for (const subroutine8 of this.subroutines) {
        allSubroutines.push(...subroutine8.allSubroutines);
        allSubroutines.push(subroutine8);
      }
      return allSubroutines;
    }
  };

  // client/parser/definitions/program.ts
  var Program = class extends Routine {
    constructor(language2, name) {
      super(language2, name);
      this.baseGlobals = 12;
      this.baseOffset = 11;
    }
    get turtleAddress() {
      const subroutinePointers = this.allSubroutines.some((x) => x.type === "function") ? this.allSubroutines.length + 1 : this.allSubroutines.length;
      return subroutinePointers + this.baseGlobals;
    }
    turt(name) {
      const fullname = this.language === "BASIC" ? `turt${name}%` : `turt${name}`;
      const variable7 = new Variable(fullname, this);
      variable7.type = "integer";
      variable7.typeIsCertain = true;
      variable7.turtle = ["x", "y", "d", "a", "t", "c"].indexOf(name) + 1;
      return variable7;
    }
    get turtleVariables() {
      return [
        this.turt("x"),
        this.turt("y"),
        this.turt("d"),
        this.turt("a"),
        this.turt("t"),
        this.turt("c")
      ];
    }
    get resultAddress() {
      return this.allSubroutines.length + this.baseGlobals;
    }
  };

  // client/parser/definitions/variable.ts
  var Variable = class {
    constructor(name, routine) {
      this.isParameter = false;
      this.isReferenceParameter = false;
      this.isPointer = false;
      this.type = "boolint";
      this.stringLength = 32;
      this.arrayDimensions = [];
      this.name = routine.language === "Pascal" ? name.toLowerCase() : name;
      this.routine = routine;
      this.typeIsCertain = routine.language === "Python" ? false : true;
    }
    get isArray() {
      return this.arrayDimensions.length > 0;
    }
    get isGlobal() {
      return this.routine instanceof Program;
    }
    get baseLength() {
      return this.type === "string" ? this.stringLength + 3 : 1;
    }
    get elementLength() {
      return this.arrayDimensions.length > 1 ? 1 : this.baseLength;
    }
    get elementCount() {
      return this.isArray ? this.arrayDimensions[0][1] - this.arrayDimensions[0][0] + 1 : 0;
    }
    get length() {
      if (this.isReferenceParameter || this.isPointer) {
        return 1;
      }
      if (this.isArray) {
        return this.subVariables[0].length * this.elementCount + 2;
      }
      return this.baseLength;
    }
    get subVariables() {
      const subVariables = [];
      if (this.isArray) {
        for (let i2 = 0; i2 < this.elementCount; i2 += 1) {
          const subVariable = new SubVariable(this, i2);
          subVariables.push(subVariable);
        }
      }
      return subVariables;
    }
    get address() {
      const arrayIndex = this.routine.variables.indexOf(this);
      const routine = new Routine(this.routine.language);
      routine.variables = this.routine.variables.slice(0, arrayIndex);
      return this.routine instanceof Program ? this.routine.turtleAddress + this.routine.turtleVariables.length + routine.memoryNeeded + 1 : routine.memoryNeeded + 1;
    }
    get lengthByteAddress() {
      return this.address + 1;
    }
  };
  var SubVariable = class extends Variable {
    constructor(variable7, index) {
      super(`${variable7.name}_${index.toString(10)}`, variable7.routine);
      this.variable = variable7;
      this.index = index;
      this.type = variable7.type;
      this.isParameter = variable7.isParameter;
      this.isReferenceParameter = variable7.isReferenceParameter;
      this.stringLength = variable7.stringLength;
      this.arrayDimensions = variable7.arrayDimensions.slice(1);
      this.private = variable7.private;
    }
    get address() {
      return this.variable.lengthByteAddress + this.index + 1;
    }
    get lengthByteAddress() {
      const base = this.variable.lengthByteAddress + this.variable.elementCount + 1;
      return base + (this.length - 1) * this.index;
    }
  };

  // client/parser/definitions/subroutine.ts
  var Subroutine = class extends Routine {
    constructor(lexeme, parent, name) {
      super(parent.language, name);
      this.level = -1;
      this.hasReturnStatement = false;
      this.globals = [];
      this.nonlocals = [];
      this.indent = 0;
      this.startLine = 0;
      this.lexeme = lexeme;
      this.parent = parent;
      this.typeIsCertain = parent.language === "Python" ? false : true;
    }
    get program() {
      return this.parent instanceof Program ? this.parent : this.parent.program;
    }
    get result() {
      return this.variables.find((x) => this.language === "Pascal" ? x.name === "result" : x.name === "!result");
    }
    get returns() {
      return this.result ? this.result.type : null;
    }
    get type() {
      return this.result === void 0 ? "procedure" : "function";
    }
    get address() {
      return this.index + this.program.baseOffset;
    }
  };

  // client/parser/find.ts
  function constant(routine, name) {
    const searchName = routine.language === "Pascal" ? name.toLowerCase() : name;
    const match = routine.constants.find((x) => x.name === searchName);
    if (match) {
      return match;
    }
    if (routine instanceof Subroutine) {
      return constant(routine.parent, name);
    }
  }
  function colour(routine, name) {
    const tempName = routine.language === "Pascal" ? name.toLowerCase() : name;
    const searchName = tempName.replace(/gray$/, "grey").replace(/GRAY$/, "GREY");
    return colours.find((x) => x.names[routine.language] === searchName);
  }
  function input2(routine, name) {
    const searchName = routine.language === "Pascal" ? name.toLowerCase() : name;
    return inputs.find((x) => x.names[routine.language] === searchName);
  }
  function variable(routine, name) {
    const searchName = routine.language === "Pascal" ? name.toLowerCase() : name;
    const turtleVariables = routine instanceof Program ? routine.turtleVariables : routine.program.turtleVariables;
    const turtleVariable = turtleVariables.find((x) => x.name === searchName);
    if (turtleVariable) {
      return turtleVariable;
    }
    if (routine.language === "Python" && routine instanceof Subroutine) {
      const isGlobal = routine.globals.indexOf(name) > -1;
      if (isGlobal) {
        return variable(routine.program, name);
      }
    }
    let match = routine.variables.find((x) => x.name === name);
    if (match === void 0 && routine instanceof Subroutine) {
      match = variable(routine.parent, name);
    }
    if (match) {
      if (match.private && match.private !== routine) {
        return void 0;
      }
      return match;
    }
  }
  function isDuplicate(routine, name) {
    const searchName = routine.language === "Pascal" ? name.toLowerCase() : name;
    if (routine.constants.some((x) => x.name === searchName))
      return true;
    if (routine.language === "Python" && routine instanceof Subroutine) {
      if (routine.globals.some((x) => x === searchName))
        return true;
      if (routine.nonlocals.some((x) => x === searchName))
        return true;
    }
    if (routine.variables.some((x) => x.name === searchName))
      return true;
    if (routine.subroutines.some((x) => x.name === searchName))
      return true;
    return false;
  }
  function subroutine(routine, name) {
    const searchName = routine.language === "Pascal" ? name.toLowerCase() : name;
    const match = routine.subroutines.find((x) => x.name === searchName);
    if (match) {
      return match;
    }
    if (routine instanceof Subroutine) {
      if (routine.name === searchName) {
        return routine;
      }
      return subroutine(routine.parent, searchName);
    }
  }
  function nativeCommand(routine, name) {
    const searchName = routine.language === "Pascal" ? name.toLowerCase() : name;
    return commands.find((x) => x.names[routine.language] === searchName);
  }
  function command(routine, name) {
    return subroutine(routine, name) || nativeCommand(routine, name);
  }

  // client/parser/basic/body.ts
  function body(lexemes, routine) {
    lexemes.index = routine.start;
    while (lexemes.index < routine.end) {
      routine.statements.push(statement(lexemes.get(), lexemes, routine));
    }
  }

  // client/parser/definitions/statement.ts
  var VariableAssignment = class {
    constructor(lexeme, variable7, indexes, value) {
      this.statementType = "variableAssignment";
      this.lexeme = lexeme;
      this.variable = variable7;
      this.indexes = indexes;
      this.value = value;
    }
  };
  var ProcedureCall = class {
    constructor(lexeme, command2) {
      this.statementType = "procedureCall";
      this.arguments = [];
      this.lexeme = lexeme;
      this.command = command2;
    }
  };
  var IfStatement = class {
    constructor(lexeme, condition) {
      this.statementType = "ifStatement";
      this.ifStatements = [];
      this.elseStatements = [];
      this.variables = [];
      this.constants = [];
      this.lexeme = lexeme;
      this.condition = condition;
    }
  };
  var ForStatement = class {
    constructor(lexeme, initialisation, condition, change) {
      this.statementType = "forStatement";
      this.statements = [];
      this.variables = [];
      this.constants = [];
      this.lexeme = lexeme;
      this.initialisation = initialisation;
      this.condition = condition;
      this.change = change;
    }
  };
  var RepeatStatement = class {
    constructor(lexeme, condition) {
      this.statementType = "repeatStatement";
      this.statements = [];
      this.variables = [];
      this.constants = [];
      this.lexeme = lexeme;
      this.condition = condition;
    }
  };
  var WhileStatement = class {
    constructor(lexeme, condition) {
      this.statementType = "whileStatement";
      this.statements = [];
      this.variables = [];
      this.constants = [];
      this.lexeme = lexeme;
      this.condition = condition;
    }
  };
  var ReturnStatement = class {
    constructor(lexeme, routine, value) {
      this.statementType = "returnStatement";
      this.lexeme = lexeme;
      this.routine = routine;
      this.value = value;
    }
  };
  var PassStatement = class {
    constructor() {
      this.statementType = "passStatement";
    }
  };

  // client/parser/definitions/operators.ts
  function type2(operator4) {
    switch (operator4) {
      case "plus":
        return "integer";
      case "scat":
        return "string";
      case "subt":
        return "integer";
      case "or":
        return "boolint";
      case "orl":
        return "boolint";
      case "xor":
        return "boolint";
      case "and":
        return "boolint";
      case "andl":
        return "boolint";
      case "div":
        return "integer";
      case "divr":
        return "integer";
      case "mod":
        return "integer";
      case "mult":
        return "integer";
      case "neg":
        return "integer";
      default:
        return "boolean";
    }
  }
  var operators = [
    ["eqal", "less", "lseq", "more", "mreq", "noeq", "seql", "sles", "sleq", "smor", "smeq", "sneq"],
    ["plus", "scat", "subt", "or", "orl", "xor"],
    ["and", "andl", "div", "divr", "mod", "mult"],
    ["neg", "not"]
  ];
  function operator2(lexeme, level) {
    return operators[level].find((x) => lexeme.type === "operator" && lexeme.subtype === x);
  }
  function stringOperator(operator4) {
    switch (operator4) {
      case "eqal":
        return "seql";
      case "less":
        return "sles";
      case "lseq":
        return "sleq";
      case "more":
        return "smor";
      case "mreq":
        return "smeq";
      case "noeq":
        return "sneq";
      case "plus":
        return "scat";
      default:
        return operator4;
    }
  }

  // client/parser/definitions/expression.ts
  var IntegerValue = class {
    constructor(lexeme) {
      this.expressionType = "integer";
      this.lexeme = lexeme;
      this.value = lexeme.value;
    }
    get type() {
      return this.lexeme.subtype;
    }
  };
  var StringValue = class {
    constructor(lexeme) {
      this.expressionType = "string";
      this.type = "string";
      this.lexeme = lexeme;
      this.value = lexeme.value;
    }
  };
  var InputValue = class {
    constructor(lexeme, input3) {
      this.expressionType = "input";
      this.type = "integer";
      this.lexeme = lexeme;
      this.input = input3;
    }
  };
  var ColourValue = class {
    constructor(lexeme, colour2) {
      this.expressionType = "colour";
      this.type = "integer";
      this.lexeme = lexeme;
      this.colour = colour2;
    }
  };
  var ConstantValue = class {
    constructor(lexeme, constant7) {
      this.expressionType = "constant";
      this.indexes = [];
      this.lexeme = lexeme;
      this.constant = constant7;
    }
    get type() {
      switch (this.constant.language) {
        case "C":
        case "Java":
        case "Pascal":
          return this.constant.type === "string" && this.indexes.length > 0 ? "character" : this.constant.type;
        default:
          return this.constant.type;
      }
    }
  };
  var VariableAddress = class {
    constructor(lexeme, variable7) {
      this.expressionType = "address";
      this.indexes = [];
      this.type = "integer";
      this.lexeme = lexeme;
      this.variable = variable7;
    }
  };
  var VariableValue = class {
    constructor(lexeme, variable7) {
      this.expressionType = "variable";
      this.indexes = [];
      this.lexeme = lexeme;
      this.variable = variable7;
    }
    get type() {
      switch (this.variable.routine.language) {
        case "C":
        case "Java":
        case "Pascal":
          return this.variable.type === "string" && this.indexes.length > this.variable.arrayDimensions.length ? "character" : this.variable.type;
        default:
          return this.variable.type;
      }
    }
  };
  var FunctionCall = class {
    constructor(lexeme, command2) {
      this.expressionType = "function";
      this.arguments = [];
      this.lexeme = lexeme;
      this.command = command2;
      this.type = command2.returns || "boolint";
    }
  };
  var CompoundExpression = class {
    constructor(lexeme, left, right, operator4) {
      this.expressionType = "compound";
      this.lexeme = lexeme;
      this.left = left;
      this.right = right;
      this.operator = operator4;
      this.type = type2(operator4);
    }
  };
  var CastExpression = class {
    constructor(lexeme, type8, expression3) {
      this.expressionType = "cast";
      this.lexeme = lexeme;
      this.type = type8;
      this.expression = expression3;
    }
  };

  // client/parser/call.ts
  function procedureCall(lexeme, lexemes, routine, command2) {
    if (command2.type === "function") {
      throw new CompilerError("{lex} is a function, not a procedure.", lexeme);
    }
    if (command2 instanceof Subroutine) {
      command2.typeIsCertain = true;
    }
    const procedureCall3 = new ProcedureCall(lexeme, command2);
    brackets(lexeme, lexemes, routine, procedureCall3);
    if (procedureCall3.command instanceof Subroutine && procedureCall3.command !== routine) {
      if (routine.language === "BASIC" && procedureCall3.command.statements.length === 0) {
        const previousLexemeIndex = lexemes.index;
        body(lexemes, procedureCall3.command);
        lexemes.index = previousLexemeIndex;
      }
    }
    return procedureCall3;
  }
  function functionCall(lexeme, lexemes, routine, command2) {
    if (command2 instanceof Subroutine && !command2.typeIsCertain) {
      command2.typeIsCertain = true;
      command2.variables.unshift(new Variable("!result", command2));
    }
    if (command2.type === "procedure") {
      throw new CompilerError("{lex} is a procedure, not a function.", lexemes.get(-1));
    }
    const functionCall2 = new FunctionCall(lexeme, command2);
    brackets(lexeme, lexemes, routine, functionCall2);
    if (functionCall2.command instanceof Subroutine && functionCall2.command !== routine) {
      if (routine.language === "BASIC" && functionCall2.command.statements.length === 0) {
        const previousLexemeIndex = lexemes.index;
        body(lexemes, functionCall2.command);
        lexemes.index = previousLexemeIndex;
      }
    }
    return functionCall2;
  }
  function brackets(lexeme, lexemes, routine, commandCall) {
    if (commandCall.command.parameters.length > 0) {
      if (!lexemes.get() || lexemes.get()?.content !== "(") {
        throw new CompilerError("Opening bracket missing after command {lex}.", lexeme);
      }
      lexemes.next();
      _arguments(lexemes, routine, commandCall);
    } else {
      if (routine.language === "BASIC" || routine.language === "Pascal") {
        if (lexemes.get() && lexemes.get()?.content === "(") {
          throw new CompilerError("Command {lex} takes no arguments.", lexemes.get(-1));
        }
      } else {
        const openBracket = lexemes.get();
        const closeBracket = lexemes.get(1);
        if (!openBracket || openBracket.content !== "(") {
          throw new CompilerError("Opening bracket missing after command {lex}.", lexemes.get(-1));
        }
        if (!closeBracket || closeBracket.type === "newline" || closeBracket.content === ";") {
          throw new CompilerError("Closing bracket missing after command {lex}.", lexemes.get(-1));
        }
        if (closeBracket.content !== ")") {
          throw new CompilerError("Command {lex} takes no arguments.", lexemes.get(-1));
        }
        lexemes.next();
        lexemes.next();
      }
    }
  }
  function _arguments(lexemes, routine, commandCall) {
    const commandName = commandCall.command instanceof Command ? commandCall.command.names[routine.language] : commandCall.command.name;
    const argsExpected = commandCall.command.parameters.length;
    let argsGiven = 0;
    while (argsGiven < argsExpected && lexemes.get()?.content !== ")") {
      const parameter = commandCall.command.parameters[argsGiven];
      let argument = expression(lexemes, routine);
      if (commandCall.command instanceof Command) {
        switch (commandCall.command.names[routine.language]?.toLowerCase()) {
          case "address":
            break;
          case "length":
            if (!(argument instanceof VariableValue) || !argument.variable.isArray) {
              argument = typeCheck(argument, parameter);
            }
            break;
          default:
            argument = typeCheck(argument, parameter);
            break;
        }
      } else {
        argument = typeCheck(argument, parameter);
      }
      commandCall.arguments.push(argument);
      argsGiven += 1;
      if (argsGiven < argsExpected) {
        if (!lexemes.get()) {
          throw new CompilerError("Comma needed after parameter.", argument.lexeme);
        }
        if (lexemes.get()?.content === ")") {
          throw new CompilerError(`Not enough arguments given for command "${commandName}".`, commandCall.lexeme);
        }
        if (lexemes.get()?.content !== ",") {
          throw new CompilerError("Comma needed after parameter.", argument.lexeme);
        }
        lexemes.next();
      }
    }
    if (argsGiven < argsExpected) {
      throw new CompilerError("Too few arguments given for command {lex}.", commandCall.lexeme);
    }
    if (lexemes.get()?.content === ",") {
      throw new CompilerError("Too many arguments given for command {lex}.", commandCall.lexeme);
    }
    if (lexemes.get()?.content !== ")") {
      throw new CompilerError("Closing bracket missing after command {lex}.", commandCall.lexeme);
    }
    lexemes.next();
  }

  // client/parser/expression.ts
  function typeCheck(found, expected) {
    const expectedType = typeof expected === "string" ? expected : expected.type;
    if (expected instanceof Variable && !expected.typeIsCertain) {
      expected.type = found.type;
      expected.typeIsCertain = true;
      return found;
    }
    if (expected instanceof FunctionCall && expected.command instanceof Subroutine && (!expected.command.typeIsCertain || expected.command.result && !expected.command.result.typeIsCertain)) {
      const result = expected.command.result;
      if (result) {
        result.type = found.type;
        result.typeIsCertain = true;
      } else {
        const result2 = new Variable("!result", expected.command);
        result2.type = found.type;
        result2.typeIsCertain = true;
        expected.command.variables.unshift(result2);
      }
      expected.command.typeIsCertain = true;
      return found;
    }
    if (found instanceof VariableValue && !found.variable.typeIsCertain) {
      found.variable.type = expectedType;
      found.variable.typeIsCertain = true;
      return found;
    }
    if (found instanceof FunctionCall && found.command instanceof Subroutine && (!found.command.typeIsCertain || found.command.result && !found.command.result.typeIsCertain)) {
      const result = found.command.result;
      if (result) {
        result.type = found.type;
        result.typeIsCertain = true;
      } else {
        const result2 = new Variable("!result", found.command);
        result2.type = found.type;
        result2.typeIsCertain = true;
        found.command.variables.unshift(result2);
      }
      found.command.typeIsCertain = true;
      return found;
    }
    if (found.type === expectedType) {
      return found;
    }
    if (expectedType === "string" && found.type === "character") {
      return new CastExpression(found.lexeme, "string", found);
    }
    if (expectedType === "character" && found.type === "string") {
      return found;
    }
    if (expectedType === "character" && found.type === "integer") {
      return found;
    }
    if (expectedType === "integer" && found.type === "character") {
      return found;
    }
    if (expectedType === "boolint" && (found.type === "boolean" || found.type === "integer")) {
      return found;
    }
    if (found.type === "boolint" && (expectedType === "boolean" || expectedType === "integer")) {
      return found;
    }
    throw new CompilerError(`Type error: '${expectedType}' expected but '${found.type}' found.`, found.lexeme);
  }
  function expression(lexemes, routine, level = 0) {
    if (level > 2) {
      return factor(lexemes, routine);
    }
    let exp = expression(lexemes, routine, level + 1);
    while (lexemes.get() && operator2(lexemes.get(), level)) {
      const lexeme = lexemes.get();
      let op = operator2(lexeme, level);
      lexemes.next();
      let nextExp = expression(lexemes, routine, level + 1);
      exp = typeCheck(exp, nextExp.type);
      nextExp = typeCheck(nextExp, exp.type);
      if (exp.type === "string" || nextExp.type === "string") {
        op = stringOperator(op);
      }
      if (exp.type === "character" || nextExp.type === "character") {
        if (op === "plus") {
          op = stringOperator(op);
        }
      }
      exp = new CompoundExpression(lexeme, exp, nextExp, op);
    }
    return exp;
  }
  function factor(lexemes, routine) {
    const lexeme = lexemes.get();
    let exp;
    switch (lexeme.type) {
      case "operator":
        switch (lexeme.subtype) {
          case "subt":
            lexemes.next();
            exp = factor(lexemes, routine);
            exp = typeCheck(exp, "integer");
            return new CompoundExpression(lexeme, null, exp, "neg");
          case "not":
            lexemes.next();
            exp = factor(lexemes, routine);
            exp = typeCheck(exp, "boolint");
            return new CompoundExpression(lexeme, null, exp, "not");
          case "and": {
            if (routine.language !== "C") {
              throw new CompilerError("Expression cannot begin with {lex}.", lexemes.get());
            }
            lexemes.next();
            exp = factor(lexemes, routine);
            if (!(exp instanceof VariableValue)) {
              throw new CompilerError('Address operator "&" must be followed by a variable.', lexeme);
            }
            const variableAddress2 = new VariableAddress(exp.lexeme, exp.variable);
            variableAddress2.indexes.push(...exp.indexes);
            return variableAddress2;
          }
          default:
            throw new CompilerError("Expression cannot begin with {lex}.", lexeme);
        }
      case "literal":
        lexemes.next();
        return lexeme.subtype === "string" ? new StringValue(lexeme) : new IntegerValue(lexeme);
      case "input": {
        const input3 = input2(routine, lexeme.content);
        if (input3) {
          lexemes.next();
          return new InputValue(lexeme, input3);
        }
        throw new CompilerError("{lex} is not a valid input code.", lexeme);
      }
      case "identifier": {
        const constant7 = constant(routine, lexeme.value);
        if (constant7) {
          const constantValue2 = new ConstantValue(lexeme, constant7);
          lexemes.next();
          const open = routine.language === "BASIC" ? "(" : "[";
          const close = routine.language === "BASIC" ? ")" : "]";
          if (lexemes.get() && lexemes.get()?.content === open) {
            if (constant7.type === "string") {
              lexemes.next();
              let exp2 = expression(lexemes, routine);
              exp2 = typeCheck(exp2, "integer");
              constantValue2.indexes.push(exp2);
              if (!lexemes.get() || lexemes.get()?.content !== close) {
                throw new CompilerError(`Closing bracket "${close}" missing after string variable index.`, exp2.lexeme);
              }
              lexemes.next();
            } else {
              throw new CompilerError("{lex} is not a string constant.", lexeme);
            }
          }
          return constantValue2;
        }
        const variable7 = variable(routine, lexeme.value);
        if (variable7) {
          const variableValue2 = new VariableValue(lexeme, variable7);
          lexemes.next();
          const open = routine.language === "BASIC" ? "(" : "[";
          const close = routine.language === "BASIC" ? ")" : "]";
          if (lexemes.get() && lexemes.get()?.content === open) {
            if (variable7.isArray) {
              lexemes.next();
              while (lexemes.get() && lexemes.get()?.content !== close) {
                let exp2 = expression(lexemes, routine);
                exp2 = typeCheck(exp2, "integer");
                variableValue2.indexes.push(exp2);
                if (routine.language === "BASIC" || routine.language === "Pascal") {
                  if (lexemes.get()?.content === ",") {
                    lexemes.next();
                    if (lexemes.get()?.content === close) {
                      throw new CompilerError("Trailing comma at the end of array indexes.", lexemes.get(-1));
                    }
                  }
                } else {
                  if (lexemes.get()?.content === close && lexemes.get(1)?.content === open) {
                    lexemes.next();
                    lexemes.next();
                  }
                }
              }
              if (!lexemes.get()) {
                throw new CompilerError(`Closing bracket "${close}" needed after array indexes.`, lexemes.get(-1));
              }
              lexemes.next();
            } else if (variable7.type === "string") {
              lexemes.next();
              exp = expression(lexemes, routine);
              exp = typeCheck(exp, "integer");
              variableValue2.indexes.push(exp);
              if (!lexemes.get() || lexemes.get()?.content !== close) {
                throw new CompilerError(`Closing bracket "${close}" missing after string variable index.`, exp.lexeme);
              }
              lexemes.next();
            } else {
              throw new CompilerError("{lex} is not a string or array variable.", lexeme);
            }
          }
          if (variable7.isArray) {
            const allowedIndexes = variable7.type === "string" ? variable7.arrayDimensions.length + 1 : variable7.arrayDimensions.length;
            if (variableValue2.indexes.length > allowedIndexes) {
              throw new CompilerError("Too many indexes for array variable {lex}.", lexeme);
            }
          }
          return variableValue2;
        }
        const colour2 = colour(routine, lexeme.value);
        if (colour2) {
          lexemes.next();
          return new ColourValue(lexeme, colour2);
        }
        const command2 = command(routine, lexeme.value);
        if (command2) {
          lexemes.next();
          return functionCall(lexeme, lexemes, routine, command2);
        }
        throw new CompilerError("{lex} is not defined.", lexeme);
      }
      default:
        if ((routine.language === "C" || routine.language === "Java") && lexemes.get()?.content === "(" && lexemes.get(1)?.type === "type") {
          lexemes.next();
          const typeLexeme = lexemes.get();
          const type8 = typeLexeme.subtype;
          if (type8 === null) {
            throw new CompilerError("Expression cannot be cast as void.", typeLexeme);
          }
          lexemes.next();
          if (lexemes.get()?.content !== ")") {
            throw new CompilerError('Type in type cast expression must be followed by a closing bracket ")".', typeLexeme);
          }
          lexemes.next();
          exp = expression(lexemes, routine);
          if (type8 !== exp.type) {
            if (type8 === "boolean" && exp.type === "character") {
              throw new CompilerError("Characters cannot be cast as booleans.", typeLexeme);
            }
            if (type8 === "boolean" && exp.type === "string") {
              throw new CompilerError("Strings cannot be cast as booleans.", typeLexeme);
            }
            if (type8 === "string" && exp.type === "boolean") {
              throw new CompilerError("Booleans cannot be cast as strings.", typeLexeme);
            }
            if (type8 === "character" && exp.type === "boolean") {
              throw new CompilerError("Booleans cannot be cast as characters.", typeLexeme);
            }
            if (type8 === "character" && exp.type === "string") {
              throw new CompilerError("Strings cannot be cast as characters.", typeLexeme);
            }
            exp = new CastExpression(typeLexeme, type8, exp);
          }
          return exp;
        } else if (lexemes.get()?.content === "(") {
          lexemes.next();
          exp = expression(lexemes, routine);
          if (lexemes.get() && lexemes.get()?.content === ")") {
            lexemes.next();
            return exp;
          } else {
            throw new CompilerError("Closing bracket missing after expression.", exp.lexeme);
          }
        } else {
          throw new CompilerError("Expression cannot begin with {lex}.", lexeme);
        }
    }
  }

  // client/parser/evaluate.ts
  function evaluate(expression3, language2, context2) {
    const True = language2 === "BASIC" || language2 === "Pascal" ? -1 : 1;
    const False = 0;
    switch (expression3.expressionType) {
      case "address":
      case "variable":
        if (context2 === "constant") {
          throw new CompilerError("Constant value cannot refer to any variables.", expression3.lexeme);
        } else if (context2 === "string") {
          throw new CompilerError("String size specification cannot refer to any variables.", expression3.lexeme);
        } else if (context2 === "array") {
          throw new CompilerError("Array size specification cannot refer to any variables.", expression3.lexeme);
        } else {
          throw new CompilerError("FOR loop step change specification cannot refer to any variables.", expression3.lexeme);
        }
      case "function":
        if (context2 === "constant") {
          throw new CompilerError("Constant value cannot invoke any functions.", expression3.lexeme);
        } else if (context2 === "string") {
          throw new CompilerError("String size specification cannot invoke any functions.", expression3.lexeme);
        } else if (context2 === "array") {
          throw new CompilerError("Array size specification cannot invoke any functions.", expression3.lexeme);
        } else {
          throw new CompilerError("FOR loop step change specification cannot invoke any functions.", expression3.lexeme);
        }
      case "constant":
        return expression3.constant.value;
      case "integer":
      case "string":
        return expression3.value;
      case "input":
        return expression3.input.value;
      case "colour":
        return expression3.colour.value;
      case "cast":
        return evaluate(expression3.expression, language2, context2);
      case "compound":
        const left = expression3.left ? evaluate(expression3.left, language2, context2) : null;
        const right = evaluate(expression3.right, language2, context2);
        switch (expression3.operator) {
          case "eqal":
          case "seql":
            return left === right ? True : False;
          case "less":
          case "sles":
            return left < right ? True : False;
          case "lseq":
          case "sleq":
            return left <= right ? True : False;
          case "more":
          case "smor":
            return left > right ? True : False;
          case "mreq":
          case "smeq":
            return left >= right ? True : False;
          case "noeq":
          case "sneq":
            return left !== right ? True : False;
          case "plus":
            return left + right;
          case "scat":
            return left + right;
          case "subt":
            return left ? left - right : -right;
          case "neg":
            return -right;
          case "not":
            return right === 0 ? True : False;
          case "or":
            return left | right;
          case "orl":
            return left || right;
          case "xor":
            return left ^ right;
          case "and":
            return left & right;
          case "andl":
            return left && right;
          case "div":
            return Math.floor(left / right);
          case "divr":
            return Math.round(left / right);
          case "mod":
            return left % right;
          case "mult":
            return left * right;
        }
    }
  }

  // client/parser/basic/variable.ts
  function variable2(lexemes, routine) {
    const [name, type8, stringLength] = variableName(lexemes);
    if (isDuplicate(routine, name)) {
      throw new CompilerError("{lex} is already defined in the current scope.", lexemes.get(-1));
    }
    const variable7 = new Variable(name, routine);
    variable7.type = type8;
    variable7.stringLength = stringLength;
    return variable7;
  }
  function array(lexemes, routine) {
    const foo = variable2(lexemes, routine);
    if (!lexemes.get()) {
      throw new CompilerError('"DIM" variable identifier must be followed by dimensions in brackets.', lexemes.get(-1));
    }
    if (lexemes.get()?.content !== "(") {
      throw new CompilerError('"DIM" variable identifier must be followed by dimensions in brackets.', lexemes.get());
    }
    lexemes.next();
    while (lexemes.get()?.content !== ")") {
      if (!lexemes.get()) {
        throw new CompilerError("Expected array size specification.", lexemes.get(-1));
      }
      if (lexemes.get()?.type === "newline") {
        throw new CompilerError("Array declaration must be one a single line.", lexemes.get(-1));
      }
      const exp = expression(lexemes, routine);
      typeCheck(exp, "integer");
      const value = evaluate(exp, "BASIC", "array");
      if (typeof value === "string") {
        throw new CompilerError("Array size must be an integer.", lexemes.get());
      }
      if (value <= 0) {
        throw new CompilerError("Array size must be positive.", lexemes.get());
      }
      foo.arrayDimensions.push([0, value]);
      if (lexemes.get()?.content === ",") {
        lexemes.next();
        if (lexemes.get()?.content === ")") {
          throw new CompilerError("Trailing comma in array size specification.", lexemes.get());
        }
      }
    }
    if (!lexemes.get() || lexemes.get()?.content !== ")") {
      throw new CompilerError("Closing bracket missing after array size specification.", lexemes.get(-1));
    }
    if (foo.arrayDimensions.length === 0) {
      throw new CompilerError("Expected array size specification.", lexemes.get());
    }
    lexemes.next();
    return foo;
  }
  function variables(lexemes, routine) {
    const variables3 = [];
    while (lexemes.get()?.type !== "newline") {
      variables3.push(variable2(lexemes, routine));
      if (lexemes.get()?.content === ",") {
        lexemes.next();
        if (!lexemes.get() || lexemes.get()?.type === "newline") {
          throw new CompilerError("Trailing comma at end of line.", lexemes.get(-1));
        }
      }
    }
    return variables3;
  }

  // client/parser/definitions/constant.ts
  var Constant = class {
    constructor(language2, name, value) {
      this.name = language2 === "Pascal" ? name.toLowerCase() : name;
      this.language = language2;
      this.value = value;
    }
    get type() {
      return typeof this.value === "number" ? "boolint" : "string";
    }
  };

  // client/parser/basic/constant.ts
  function constant2(lexemes, routine) {
    const foo = variable2(lexemes, routine);
    if (!lexemes.get() || lexemes.get()?.content !== "=") {
      throw new CompilerError("Constant must be assigned a value.", lexemes.get(-1));
    }
    lexemes.next();
    let exp = expression(lexemes, routine);
    const value = evaluate(exp, "BASIC", "constant");
    exp = typeCheck(exp, foo.type);
    return new Constant("BASIC", foo.name, value);
  }

  // client/parser/basic/statement.ts
  function newLine(lexemes) {
    if (lexemes.get() && lexemes.get()?.type !== "newline") {
      throw new CompilerError("Statement must be on a new line.", lexemes.get());
    }
    while (lexemes.get()?.type === "newline") {
      lexemes.next();
    }
  }
  function statement(lexeme, lexemes, routine, oneLine = false) {
    let statement8;
    switch (lexeme.type) {
      case "newline":
        statement8 = new PassStatement();
        break;
      case "operator":
        if (lexeme.subtype === "eqal") {
          lexeme.subtype = "asgn";
          lexemes.next();
          statement8 = returnStatement(lexeme, lexemes, routine);
        } else {
          throw new CompilerError("Statement cannot begin with {lex}.", lexeme);
        }
        break;
      case "identifier":
        statement8 = simpleStatement(lexeme, lexemes, routine);
        break;
      case "keyword":
        switch (lexeme.subtype) {
          case "const":
            lexemes.next();
            routine.constants.push(constant2(lexemes, routine));
            statement8 = new PassStatement();
            break;
          case "dim":
            lexemes.next();
            routine.variables.push(array(lexemes, routine));
            statement8 = new PassStatement();
            break;
          case "local":
            if (routine instanceof Program) {
              throw new CompilerError("Main program cannot declare any LOCAL variables.", lexemes.get());
            }
            lexemes.next();
            routine.variables.push(...variables(lexemes, routine));
            statement8 = new PassStatement();
            break;
          case "private": {
            if (routine instanceof Program) {
              throw new CompilerError("Main program cannot declare any PRIVATE variables.", lexemes.get());
            }
            lexemes.next();
            const privateVariables = variables(lexemes, routine);
            for (const privateVariable of privateVariables) {
              privateVariable.private = routine;
            }
            routine.program.variables.push(...privateVariables);
            statement8 = new PassStatement();
            break;
          }
          case "if":
            lexemes.next();
            statement8 = ifStatement(lexeme, lexemes, routine);
            break;
          case "for":
            lexemes.next();
            statement8 = forStatement(lexeme, lexemes, routine);
            break;
          case "repeat":
            lexemes.next();
            statement8 = repeatStatement(lexeme, lexemes, routine);
            break;
          case "while":
            lexemes.next();
            statement8 = whileStatement(lexeme, lexemes, routine);
            break;
          case "def":
            if (routine instanceof Program) {
              throw new CompilerError('Subroutines must be defined after program "END".', lexeme);
            }
            throw new CompilerError("Subroutines cannot contain any nested subroutine definitions.", lexeme);
          default:
            throw new CompilerError("Statement cannot begin with {lex}.", lexemes.get());
        }
        break;
      default:
        throw new CompilerError("Statement cannot begin with {lex}.", lexemes.get());
    }
    if (!oneLine && lexemes.get()) {
      if (lexemes.get()?.content === ":" || lexemes.get()?.type === "newline") {
        while (lexemes.get()?.content === ":" || lexemes.get()?.type === "newline") {
          lexemes.next();
        }
      } else {
        throw new CompilerError("Statements must be separated by a colon or placed on different lines.", lexemes.get());
      }
    }
    return statement8;
  }
  function simpleStatement(lexeme, lexemes, routine) {
    const foo = command(routine, lexeme.content);
    if (foo) {
      lexemes.next();
      return procedureCall(lexeme, lexemes, routine, foo);
    }
    const bar = variable(routine, lexeme.content);
    if (bar) {
      lexemes.next();
      return variableAssignment(lexeme, lexemes, routine, bar);
    }
    const program3 = routine instanceof Program ? routine : routine.program;
    const baz = variable2(lexemes, program3);
    program3.variables.push(baz);
    return variableAssignment(lexeme, lexemes, routine, baz);
  }
  function variableAssignment(variableLexeme, lexemes, routine, variable7) {
    const indexes = [];
    if (lexemes.get()?.content === "(") {
      if (variable7.isArray) {
        lexemes.next();
        while (lexemes.get() && lexemes.get()?.content !== ")") {
          let exp = expression(lexemes, routine);
          exp = typeCheck(exp, "integer");
          indexes.push(exp);
          if (lexemes.get()?.content === ",") {
            lexemes.next();
            if (lexemes.get()?.content === ")") {
              throw new CompilerError("Trailing comma at the end of array indexes.", lexemes.get(-1));
            }
          }
        }
        if (!lexemes.get()) {
          throw new CompilerError('Closing bracket ")" needed after array indexes.', lexemes.get(-1));
        }
        lexemes.next();
      } else {
        throw new CompilerError("{lex} is not an array variable.", variableLexeme);
      }
    }
    if (variable7.isArray) {
      const allowedIndexes = variable7.type === "string" ? variable7.arrayDimensions.length + 1 : variable7.arrayDimensions.length;
      if (indexes.length > allowedIndexes) {
        throw new CompilerError("Too many indexes for array variable {lex}.", variableLexeme);
      }
    }
    const assignmentLexeme = lexemes.get();
    if (!assignmentLexeme) {
      throw new CompilerError('Variable must be followed by assignment operator "=".', lexemes.get(-1));
    }
    if (assignmentLexeme.type !== "operator" || assignmentLexeme.content !== "=") {
      throw new CompilerError('Variable must be followed by assignment operator "=".', assignmentLexeme);
    }
    lexemes.next();
    if (!lexemes.get()) {
      throw new CompilerError(`Variable "${variable7.name}" must be assigned a value.`, lexemes.get(-1));
    }
    let value = expression(lexemes, routine);
    value = typeCheck(value, variable7.type);
    return new VariableAssignment(assignmentLexeme, variable7, indexes, value);
  }
  function returnStatement(lexeme, lexemes, routine) {
    if (routine instanceof Program) {
      throw new CompilerError("Statement in the main program cannot begin with {lex}.", lexeme);
    }
    if (routine.type !== "function") {
      throw new CompilerError("Procedures cannot return a value.", lexeme);
    }
    let value = expression(lexemes, routine);
    value = typeCheck(value, routine.returns);
    return new ReturnStatement(lexeme, routine, value);
  }
  function ifStatement(lexeme, lexemes, routine) {
    let oneLine;
    if (!lexemes.get()) {
      throw new CompilerError('"IF" must be followed by a boolean expression.', lexeme);
    }
    let condition = expression(lexemes, routine);
    condition = typeCheck(condition, "boolean");
    if (!lexemes.get()) {
      throw new CompilerError('"IF ..." must be followed by "THEN".', lexemes.get(-1));
    }
    if (lexemes.get()?.content !== "THEN") {
      throw new CompilerError('"IF ..." must be followed by "THEN".', lexemes.get());
    }
    lexemes.next();
    const ifStatement8 = new IfStatement(lexeme, condition);
    const firstInnerLexeme = lexemes.get();
    if (!firstInnerLexeme) {
      throw new CompilerError('No statements found after "IF ... THEN".', lexemes.get());
    }
    if (firstInnerLexeme.type === "newline") {
      while (lexemes.get()?.type === "newline") {
        lexemes.next();
      }
      ifStatement8.ifStatements.push(...block(lexemes, routine, "IF"));
      oneLine = false;
    } else {
      oneLine = true;
      ifStatement8.ifStatements.push(statement(firstInnerLexeme, lexemes, routine, oneLine));
    }
    if (lexemes.get() && lexemes.get()?.content === "ELSE") {
      lexemes.next();
      const firstInnerLexeme2 = lexemes.get();
      if (!firstInnerLexeme2) {
        throw new CompilerError('No statements found after "ELSE".', lexemes.get(-1));
      }
      if (oneLine) {
        if (firstInnerLexeme2.type === "newline") {
          throw new CompilerError('Statement following "ELSE" cannot be on a new line.', lexemes.get(1));
        }
        ifStatement8.elseStatements.push(statement(firstInnerLexeme2, lexemes, routine, oneLine));
      } else {
        if (firstInnerLexeme2.type !== "newline") {
          throw new CompilerError('Statement following "ELSE" must be on a new line.', firstInnerLexeme2);
        }
        while (lexemes.get()?.type === "newline") {
          lexemes.next();
        }
        ifStatement8.elseStatements.push(...block(lexemes, routine, "ELSE"));
      }
    }
    return ifStatement8;
  }
  function forStatement(lexeme, lexemes, routine) {
    const variableLexeme = lexemes.get();
    if (!variableLexeme) {
      throw new CompilerError('"FOR" must be followed by an integer variable.', lexeme);
    }
    if (variableLexeme.type !== "identifier") {
      throw new CompilerError('"FOR" must be followed by an integer variable.', variableLexeme);
    }
    if (variableLexeme.subtype === "turtle") {
      throw new CompilerError('Turtle attribute cannot be used as a "FOR" variable.', variableLexeme);
    }
    let foo = variable(routine, variableLexeme.content);
    if (!foo) {
      const program3 = routine instanceof Program ? routine : routine.program;
      foo = variable2(lexemes, program3);
      program3.variables.push(foo);
    } else {
      lexemes.next();
    }
    if (foo.type !== "integer" && foo.type !== "boolint") {
      throw new CompilerError("{lex} is not an integer variable.", lexemes.get());
    }
    const initialisation = variableAssignment(variableLexeme, lexemes, routine, foo);
    if (!lexemes.get()) {
      throw new CompilerError('"FOR" loop initialisation must be followed by "TO".', lexemes.get(-1));
    }
    if (lexemes.get()?.content !== "TO") {
      throw new CompilerError('"FOR" loop initialisation must be followed by "TO".', lexemes.get());
    }
    lexemes.next();
    if (!lexemes.get()) {
      throw new CompilerError('"TO" must be followed by an integer (or integer constant).', lexemes.get(-1));
    }
    let finalValue = expression(lexemes, routine);
    finalValue = typeCheck(finalValue, "integer");
    const oneToken = new Token("decimal", "1", lexeme.line, -1);
    const assignmentToken = new Token("operator", "=", lexeme.line, -1);
    const plusToken = new Token("operator", "+", lexeme.line, -1);
    const lseqToken = new Token("operator", "<=", lexeme.line, -1);
    const mreqToken = new Token("operator", ">=", lexeme.line, -1);
    const oneLexeme = new IntegerLexeme(oneToken, 10);
    const assignmentLexeme = new OperatorLexeme(assignmentToken, "BASIC");
    const plusLexeme = new OperatorLexeme(plusToken, "BASIC");
    const lseqLexeme = new OperatorLexeme(lseqToken, "BASIC");
    const mreqLexeme = new OperatorLexeme(mreqToken, "BASIC");
    const left = new VariableValue(variableLexeme, foo);
    const right = new IntegerValue(oneLexeme);
    let change = new VariableAssignment(assignmentLexeme, foo, [], new CompoundExpression(plusLexeme, left, right, "plus"));
    let condition = new CompoundExpression(lseqLexeme, left, finalValue, "lseq");
    if (lexemes.get() && lexemes.get()?.content === "STEP") {
      lexemes.next();
      if (!lexemes.get()) {
        throw new CompilerError('"STEP" instruction must be followed by an integer value.', lexemes.get(-1));
      }
      let stepValue = expression(lexemes, routine);
      typeCheck(stepValue, "integer");
      const evaluatedStepValue = evaluate(stepValue, "BASIC", "step");
      if (evaluatedStepValue === 0) {
        throw new CompilerError("Step value cannot be zero.", stepValue.lexeme);
      }
      change = new VariableAssignment(assignmentLexeme, foo, [], new CompoundExpression(plusLexeme, left, stepValue, "plus"));
      if (evaluatedStepValue < 0) {
        condition = new CompoundExpression(mreqLexeme, left, finalValue, "mreq");
      } else {
        condition = new CompoundExpression(lseqLexeme, left, finalValue, "lseq");
      }
    }
    const forStatement8 = new ForStatement(lexeme, initialisation, condition, change);
    const firstInnerLexeme = lexemes.get();
    if (!firstInnerLexeme) {
      throw new CompilerError('No statements found after "FOR" loop initialisation.', lexeme);
    }
    if (firstInnerLexeme.type === "newline") {
      while (lexemes.get()?.type === "newline") {
        lexemes.next();
      }
      forStatement8.statements.push(...block(lexemes, routine, "FOR"));
    } else {
      forStatement8.statements.push(statement(firstInnerLexeme, lexemes, routine));
    }
    return forStatement8;
  }
  function repeatStatement(lexeme, lexemes, routine) {
    let repeatStatements;
    const firstInnerLexeme = lexemes.get();
    if (!firstInnerLexeme) {
      throw new CompilerError('No statements found after "REPEAT".', lexeme);
    }
    if (firstInnerLexeme.type === "newline") {
      while (lexemes.get()?.type === "newline") {
        lexemes.next();
      }
      repeatStatements = block(lexemes, routine, "REPEAT");
    } else {
      repeatStatements = [statement(firstInnerLexeme, lexemes, routine)];
    }
    if (!lexemes.get()) {
      throw new CompilerError('"UNTIL" must be followed by a boolean expression.', lexemes.get(-1));
    }
    let condition = expression(lexemes, routine);
    condition = typeCheck(condition, "boolean");
    const repeatStatement4 = new RepeatStatement(lexeme, condition);
    repeatStatement4.statements.push(...repeatStatements);
    return repeatStatement4;
  }
  function whileStatement(lexeme, lexemes, routine) {
    if (!lexemes.get()) {
      throw new CompilerError('"WHILE" must be followed by a boolean expression.', lexemes.get(-1));
    }
    let condition = expression(lexemes, routine);
    condition = typeCheck(condition, "boolean");
    const whileStatement8 = new WhileStatement(lexeme, condition);
    const firstInnerLexeme = lexemes.get();
    if (!firstInnerLexeme) {
      throw new CompilerError('No commands found after "WHILE ... DO".', lexemes.get(-1));
    }
    if (firstInnerLexeme.type === "newline") {
      while (lexemes.get()?.type === "newline") {
        lexemes.next();
      }
      whileStatement8.statements.push(...block(lexemes, routine, "WHILE"));
    } else {
      whileStatement8.statements.push(statement(firstInnerLexeme, lexemes, routine));
    }
    return whileStatement8;
  }
  function block(lexemes, routine, start) {
    const statements = [];
    let end = false;
    if (!lexemes.get()) {
      throw new CompilerError(`No commands found after "${start}".`, lexemes.get(-1));
    }
    while (!end && lexemes.index < routine.end) {
      const lexeme = lexemes.get();
      end = blockEndCheck(start, lexeme);
      if (end) {
        if (lexeme.content !== "ELSE") {
          lexemes.next();
        }
      } else {
        statements.push(statement(lexeme, lexemes, routine));
      }
    }
    if (!end) {
      throw new CompilerError(`Unterminated "${start}" statement.`, lexemes.get(-1));
    }
    return statements;
  }
  function blockEndCheck(start, lexeme) {
    switch (lexeme.content) {
      case "ELSE":
        if (start !== "IF") {
          throw new CompilerError('"ELSE" does not have any matching "IF".', lexeme);
        }
        return true;
      case "ENDIF":
        if (start !== "IF" && start !== "ELSE") {
          throw new CompilerError('"ENDIF" does not have any matching "IF".', lexeme);
        }
        return true;
      case "NEXT":
        if (start !== "FOR") {
          throw new CompilerError('"NEXT" does not have any matching "FOR".', lexeme);
        }
        return true;
      case "UNTIL":
        if (start !== "REPEAT") {
          throw new CompilerError('"UNTIL" does not have any matching "REPEAT".', lexeme);
        }
        return true;
      case "ENDWHILE":
        if (start !== "WHILE") {
          throw new CompilerError('"ENDWHILE" does not have any matching "WHILE".', lexeme);
        }
        return true;
      default:
        return false;
    }
  }

  // client/parser/basic/subroutine.ts
  function subroutine2(lexeme, lexemes, program3) {
    const [name, subroutineType, type8, stringLength] = subroutineName(lexemes);
    const subroutine8 = new Subroutine(lexeme, program3, name);
    subroutine8.index = program3.subroutines.length + 1;
    if (subroutineType === "function") {
      const returnVariable = new Variable("!result", subroutine8);
      returnVariable.type = type8;
      returnVariable.stringLength = stringLength;
      subroutine8.variables.push(returnVariable);
    }
    if (lexemes.get()?.content === "(") {
      lexemes.next();
      subroutine8.variables.push(...parameters(lexemes, subroutine8));
    }
    if (!lexemes.get()) {
      throw new CompilerError("No statements found after subroutine declaration.", lexemes.get(-1));
    }
    newLine(lexemes);
    subroutine8.start = lexemes.index;
    let finished = false;
    if (subroutine8.type === "procedure") {
      while (lexemes.get() && !finished) {
        finished = lexemes.get()?.content === "ENDPROC";
        lexemes.next();
      }
    } else {
      while (lexemes.get() && !finished) {
        if (lexemes.get()?.content === "=" && lexemes.get(-1)?.type === "newline") {
          finished = true;
          while (lexemes.get() && lexemes.get()?.type !== "newline") {
            lexemes.next();
          }
        } else {
          lexemes.next();
        }
      }
    }
    subroutine8.end = subroutine8.type === "procedure" ? lexemes.index - 2 : lexemes.index;
    if (!finished) {
      if (subroutine8.type === "procedure") {
        throw new CompilerError(`Procedure "${subroutine8.name}" does not have an end (expected "ENDPROC").`, lexemes.lexemes[subroutine8.start]);
      }
      throw new CompilerError(`Function "${subroutine8.name}" does not have an end (expected "=<expression>").`, lexemes.lexemes[subroutine8.end]);
    }
    newLine(lexemes);
    return subroutine8;
  }
  function parameters(lexemes, subroutine8) {
    const parameters7 = [];
    while (lexemes.get()?.content !== ")") {
      let isReferenceParameter = false;
      if (lexemes.get()?.content === "RETURN") {
        isReferenceParameter = true;
        lexemes.next();
      }
      const parameter = variable2(lexemes, subroutine8);
      parameter.isParameter = true;
      parameter.isReferenceParameter = isReferenceParameter;
      if (lexemes.get()?.content === "(") {
        parameter.arrayDimensions.push([0, 0]);
        lexemes.next();
        if (!lexemes.get() || lexemes.get()?.content !== ")") {
          throw new CompilerError("Closing bracket missing after array parameter specification.", lexemes.get(-1));
        }
        lexemes.next();
      }
      parameters7.push(parameter);
      if (lexemes.get()?.content === ",") {
        lexemes.next();
      }
    }
    if (lexemes.get()?.content !== ")") {
      throw new CompilerError("Closing bracket missing after method parameters.", lexemes.get(-1));
    }
    lexemes.next();
    return parameters7;
  }

  // client/parser/basic/parser.ts
  function basic(lexemes) {
    const program3 = new Program("BASIC");
    const endLexemeIndex = lexemes.lexemes.findIndex((x) => x.content === "END");
    if (endLexemeIndex < 0) {
      throw new CompilerError('Program must end with keyword "END".');
    }
    program3.end = endLexemeIndex;
    lexemes.index = endLexemeIndex + 1;
    while (lexemes.get()) {
      if (lexemes.get()?.type === "newline") {
        lexemes.next();
      } else if (lexemes.get()?.content === "DEF") {
        lexemes.next();
        program3.subroutines.push(subroutine2(lexemes.get(-1), lexemes, program3));
      } else {
        throw new CompilerError('Only subroutine definitions are permissible after program "END".', lexemes.get());
      }
    }
    body(lexemes, program3);
    for (const subroutine8 of program3.subroutines) {
      if (subroutine8.statements.length === 0) {
        body(lexemes, subroutine8);
      }
    }
    return program3;
  }

  // client/parser/c/type.ts
  function type3(lexemes) {
    const typeLexeme = lexemes.get();
    if (!typeLexeme) {
      throw new CompilerError('Expected type definition ("bool", "char", "int", "string", or "void").', lexemes.get(-1));
    }
    if (typeLexeme.type !== "type") {
      throw new CompilerError('{lex} is not a valid type definition (expected "bool", "char", "int", "string", or "void").', typeLexeme);
    }
    const type8 = typeLexeme.subtype;
    lexemes.next();
    let stringLength = 32;
    if (lexemes.get()?.content === "[") {
      lexemes.next();
      const integerLexeme = lexemes.get();
      if (!integerLexeme) {
        throw new CompilerError("Expecting string size specification.", lexemes.get(-1));
      }
      if (integerLexeme.type !== "literal" || integerLexeme.subtype !== "integer") {
        throw new CompilerError("String size must be an integer.", lexemes.get());
      }
      if (integerLexeme.value <= 0) {
        throw new CompilerError("String size must be greater than zero.", lexemes.get());
      }
      stringLength = integerLexeme.value;
      lexemes.next();
      if (!lexemes.get()) {
        throw new CompilerError('Closing bracket "]" missing after string size specification.', lexemes.get(-1));
      }
      if (lexemes.get()?.content !== "]") {
        throw new CompilerError('Closing bracket "]" missing after string size specification.', lexemes.get());
      }
      lexemes.next();
    }
    return [type8, stringLength];
  }

  // client/parser/c/identifier.ts
  function identifier3(lexemes, routine) {
    const identifier8 = lexemes.get();
    if (!identifier8) {
      throw new CompilerError("{lex} must be followed by an identifier.", lexemes.get(-1));
    }
    if (identifier8.type !== "identifier") {
      throw new CompilerError("{lex} is not a valid identifier.", identifier8);
    }
    if (identifier8.subtype === "turtle") {
      throw new CompilerError("{lex} is already the name of a predefined Turtle property.", identifier8);
    }
    if (isDuplicate(routine, identifier8.value)) {
      throw new CompilerError("{lex} is already defined in the current scope.", identifier8);
    }
    lexemes.next();
    return identifier8.value;
  }

  // client/parser/c/constant.ts
  function constant3(lexemes, routine) {
    const [constantType] = type3(lexemes);
    if (constantType === null) {
      throw new CompilerError('Constant type cannot be void (expected "bool", "char", "int", or "string").', lexemes.get());
    }
    const name = identifier3(lexemes, routine);
    if (!lexemes.get()) {
      throw new CompilerError(`Constant ${name} must be assigned a value.`, lexemes.get(-1));
    }
    if (lexemes.get()?.content === "[") {
      throw new CompilerError("Constant cannot be an array.", lexemes.get(-1));
    }
    if (lexemes.get()?.content !== "=") {
      throw new CompilerError(`Constant ${name} must be assigned a value.`, lexemes.get());
    }
    lexemes.next();
    const exp = expression(lexemes, routine);
    typeCheck(exp, constantType);
    const value = evaluate(exp, "C", "constant");
    return new Constant("C", name, value);
  }

  // client/parser/c/variable.ts
  function variable3(lexemes, routine) {
    const typeLexeme = lexemes.get();
    const [variableType, stringLength] = type3(lexemes);
    if (variableType === null) {
      throw new CompilerError('Variable cannot be void (expected "boolean", "char", "int", or "String").', lexemes.get());
    }
    let isPointer = false;
    if (lexemes.get()?.content === "*") {
      lexemes.next();
      isPointer = true;
    }
    const name = identifier3(lexemes, routine);
    const variable7 = new Variable(name, routine);
    variable7.type = variableType;
    variable7.stringLength = stringLength;
    variable7.isPointer = isPointer;
    while (lexemes.get()?.content === "[") {
      lexemes.next();
      if (!lexemes.get()) {
        throw new CompilerError('Opening bracket "[" must be followed by an array size.', lexemes.get(-1));
      }
      const exp = expression(lexemes, routine);
      typeCheck(exp, "integer");
      const value = evaluate(exp, "C", "array");
      if (typeof value === "string") {
        throw new CompilerError("Array size must be an integer.", lexemes.get());
      }
      if (value <= 0) {
        throw new CompilerError("Array size must be positive.", lexemes.get());
      }
      variable7.arrayDimensions.push([0, value - 1]);
      if (!lexemes.get()) {
        throw new CompilerError('Array size specification must be followed by closing bracket "]".', lexemes.get(-1));
      }
      if (lexemes.get()?.content !== "]") {
        throw new CompilerError('Array size specification must be followed by closing bracket "]".', lexemes.get());
      }
      lexemes.next();
    }
    if (type3 === null && variable7.arrayDimensions.length > 0) {
      throw new CompilerError("Array of void is not allowed.", typeLexeme);
    }
    return variable7;
  }

  // client/parser/c/statement.ts
  function eosCheck(lexemes) {
    if (!lexemes.get() || lexemes.get()?.content !== ";") {
      throw new CompilerError("Statement must be followed by a semicolon.", lexemes.get(-1));
    }
    lexemes.next();
  }
  function statement2(lexeme, lexemes, routine) {
    let statement8;
    switch (lexeme.type) {
      case "identifier":
      case "type":
        statement8 = simpleStatement2(lexeme, lexemes, routine);
        eosCheck(lexemes);
        break;
      case "keyword":
        switch (lexeme.subtype) {
          case "const":
            statement8 = simpleStatement2(lexeme, lexemes, routine);
            eosCheck(lexemes);
            break;
          case "return":
            lexemes.next();
            statement8 = returnStatement2(lexeme, lexemes, routine);
            break;
          case "if":
            lexemes.next();
            statement8 = ifStatement2(lexeme, lexemes, routine);
            break;
          case "else":
            throw new CompilerError('Statement cannot begin with "else". If you have an "if" above, you may be missing a closing bracket "}".', lexemes.get());
          case "for":
            lexemes.next();
            statement8 = forStatement2(lexeme, lexemes, routine);
            break;
          case "do":
            lexemes.next();
            statement8 = doStatement(lexeme, lexemes, routine);
            break;
          case "while":
            lexemes.next();
            statement8 = whileStatement2(lexeme, lexemes, routine);
            break;
          default:
            throw new CompilerError("Statement cannot begin with {lex}.", lexeme);
        }
        break;
      default:
        throw new CompilerError("Statement cannot begin with {lex}.", lexeme);
    }
    return statement8;
  }
  function simpleStatement2(lexeme, lexemes, routine) {
    switch (lexeme.type) {
      case "keyword":
        lexemes.next();
        routine.constants.push(constant3(lexemes, routine));
        return new PassStatement();
      case "type":
        const variableLexeme = lexemes.get(1);
        const foo = variable3(lexemes, routine);
        routine.variables.push(foo);
        if (lexemes.get()?.content === "=") {
          return variableAssignment2(variableLexeme, lexemes, routine, foo);
        } else {
          return new PassStatement();
        }
      case "identifier":
        const bar = variable(routine, lexeme.value);
        const baz = command(routine, lexeme.value);
        if (bar) {
          lexemes.next();
          return variableAssignment2(lexeme, lexemes, routine, bar);
        } else if (baz) {
          lexemes.next();
          const statement8 = procedureCall(lexeme, lexemes, routine, baz);
          return statement8;
        } else {
          throw new CompilerError("{lex} is not defined.", lexemes.get());
        }
    }
  }
  function variableAssignment2(variableLexeme, lexemes, routine, variable7) {
    const indexes = [];
    if (lexemes.get()?.content === "[") {
      if (variable7.isArray) {
        lexemes.next();
        while (lexemes.get() && lexemes.get()?.content !== "]") {
          let exp = expression(lexemes, routine);
          exp = typeCheck(exp, "integer");
          indexes.push(exp);
          if (lexemes.get()?.content === "]" && lexemes.get(1)?.content === "[") {
            lexemes.next();
            lexemes.next();
          }
        }
        if (!lexemes.get()) {
          throw new CompilerError('Closing bracket "]" needed after array indexes.', lexemes.get(-1));
        }
        lexemes.next();
      } else if (variable7.type === "string") {
        lexemes.next();
        let exp = expression(lexemes, routine);
        exp = typeCheck(exp, "integer");
        indexes.push(exp);
        if (!lexemes.get() || lexemes.get()?.content !== "]") {
          throw new CompilerError('Closing bracket "]" missing after string variable index.', exp.lexeme);
        }
        lexemes.next();
      } else {
        throw new CompilerError("{lex} is not a string or array variable.", variableLexeme);
      }
    }
    if (variable7.isArray) {
      const allowedIndexes = variable7.type === "string" ? variable7.arrayDimensions.length + 1 : variable7.arrayDimensions.length;
      if (indexes.length > allowedIndexes) {
        throw new CompilerError("Too many indexes for array variable {lex}.", variableLexeme);
      }
    }
    const assignmentLexeme = lexemes.get();
    if (!assignmentLexeme) {
      throw new CompilerError('Variable must be followed by assignment operator "=".', lexemes.get(-1));
    }
    if (assignmentLexeme.type !== "operator" || assignmentLexeme.content !== "=") {
      throw new CompilerError('Variable must be followed by assignment operator "=".', assignmentLexeme);
    }
    lexemes.next();
    if (!lexemes.get()) {
      throw new CompilerError(`Variable "${variable7.name}" must be assigned a value.`, assignmentLexeme);
    }
    let value = expression(lexemes, routine);
    const variableValue2 = new VariableValue(variableLexeme, variable7);
    variableValue2.indexes.push(...indexes);
    value = typeCheck(value, variableValue2.type);
    return new VariableAssignment(assignmentLexeme, variable7, indexes, value);
  }
  function returnStatement2(returnLexeme, lexemes, routine) {
    if (routine.type !== "function") {
      throw new CompilerError("Procedures cannot return a value.", lexemes.get());
    }
    let value = expression(lexemes, routine);
    value = typeCheck(value, routine.returns);
    eosCheck(lexemes);
    routine.hasReturnStatement = true;
    return new ReturnStatement(returnLexeme, routine, value);
  }
  function ifStatement2(ifLexeme, lexemes, routine) {
    if (!lexemes.get() || lexemes.get()?.content !== "(") {
      throw new CompilerError('"if" must be followed by an opening bracket "(".', ifLexeme);
    }
    lexemes.next();
    if (!lexemes.get()) {
      throw new CompilerError('"if (" must be followed by a Boolean expression.', lexemes.get(-1));
    }
    let condition = expression(lexemes, routine);
    condition = typeCheck(condition, "boolean");
    if (!lexemes.get() || lexemes.get()?.content !== ")") {
      throw new CompilerError('"if (..." must be followed by a closing bracket ")".', lexemes.get(-1));
    }
    lexemes.next();
    const ifStatement8 = new IfStatement(ifLexeme, condition);
    if (!lexemes.get() || lexemes.get()?.content !== "{") {
      throw new CompilerError('"if (...)" must be followed by an opening curly bracket "{".', lexemes.get(-1));
    }
    lexemes.next();
    ifStatement8.ifStatements.push(...block2(lexemes, routine));
    if (lexemes.get() && lexemes.get()?.content === "else") {
      lexemes.next();
      if (!lexemes.get() || lexemes.get()?.content !== "{") {
        throw new CompilerError('"else" must be followed by an opening bracket "{".', lexemes.get(-1));
      }
      lexemes.next();
      ifStatement8.elseStatements.push(...block2(lexemes, routine));
    }
    return ifStatement8;
  }
  function forStatement2(forLexeme, lexemes, routine) {
    if (!lexemes.get() || lexemes.get()?.content !== "(") {
      throw new CompilerError('"for" must be followed by an opening bracket "(".', lexemes.get(-1));
    }
    lexemes.next();
    const firstInitialisationLexeme = lexemes.get();
    if (!firstInitialisationLexeme) {
      throw new CompilerError('"for" conditions must begin with a variable assignment.', lexemes.get(-1));
    }
    if (firstInitialisationLexeme.type !== "identifier" && firstInitialisationLexeme.type !== "type") {
      throw new CompilerError('"for" conditions must begin with a variable assignment.', lexemes.get());
    }
    const initialisation = simpleStatement2(firstInitialisationLexeme, lexemes, routine);
    if (!(initialisation instanceof VariableAssignment)) {
      throw new CompilerError('"for" conditions must begin with a variable assignment.', lexemes.get(-1));
    }
    if (initialisation.variable.type !== "integer") {
      throw new CompilerError("Loop variable must be an integer.", lexemes.get());
    }
    eosCheck(lexemes);
    if (!lexemes.get()) {
      throw new CompilerError('"for (...;" must be followed by a loop condition.', lexemes.get(-1));
    }
    let condition = expression(lexemes, routine);
    condition = typeCheck(condition, "boolean");
    eosCheck(lexemes);
    const firstChangeLexeme = lexemes.get();
    if (!firstChangeLexeme) {
      throw new CompilerError('"for" conditions must begin with a variable assignment.', lexemes.get(-1));
    }
    if (firstChangeLexeme.type !== "identifier" && firstChangeLexeme.type !== "type") {
      throw new CompilerError('"for" conditions must begin with a variable assignment.', firstChangeLexeme);
    }
    const change = simpleStatement2(firstChangeLexeme, lexemes, routine);
    if (!(change instanceof VariableAssignment)) {
      throw new CompilerError('"for" loop variable must be changed on each loop.', lexemes.get(-1));
    }
    if (change.variable !== initialisation.variable) {
      throw new CompilerError("Initial loop variable and change loop variable must be the same.", lexemes.get(-1));
    }
    if (!lexemes.get() || lexemes.get()?.content !== ")") {
      throw new CompilerError('Closing bracket ")" missing after "for" loop initialisation.', lexemes.get(-1));
    }
    lexemes.next();
    const forStatement8 = new ForStatement(forLexeme, initialisation, condition, change);
    if (!lexemes.get() || lexemes.get()?.content !== "{") {
      throw new CompilerError('"for (...)" must be followed by an opening bracket "{".', lexemes.get(-1));
    }
    lexemes.next();
    forStatement8.statements.push(...block2(lexemes, routine));
    return forStatement8;
  }
  function doStatement(doLexeme, lexemes, routine) {
    if (!lexemes.get() || lexemes.get()?.content !== "{") {
      throw new CompilerError('"do" must be followed by an opening bracket "{".', lexemes.get(-1));
    }
    lexemes.next();
    const repeatStatements = block2(lexemes, routine);
    if (!lexemes.get() || lexemes.get()?.content !== "while") {
      throw new CompilerError('"do { ... }" must be followed by "while".', lexemes.get(-1));
    }
    lexemes.next();
    if (!lexemes.get() || lexemes.get()?.content !== "(") {
      throw new CompilerError('"while" must be followed by an opening bracket "(".', lexemes.get(-1));
    }
    lexemes.next();
    if (!lexemes.get()) {
      throw new CompilerError('"while (" must be followed by a boolean expression.', lexemes.get(-1));
    }
    let condition = expression(lexemes, routine);
    condition = typeCheck(condition, "boolean");
    const notToken = new Token("operator", "!", condition.lexeme.line, condition.lexeme.character);
    const notLexeme = new OperatorLexeme(notToken, "C");
    condition = new CompoundExpression(notLexeme, null, condition, "not");
    if (!lexemes.get() || lexemes.get()?.content !== ")") {
      throw new CompilerError('"while (..." must be followed by a closing bracket ")".', lexemes.get(-1));
    }
    lexemes.next();
    eosCheck(lexemes);
    const repeatStatement4 = new RepeatStatement(doLexeme, condition);
    repeatStatement4.statements.push(...repeatStatements);
    return repeatStatement4;
  }
  function whileStatement2(whileLexeme, lexemes, routine) {
    if (!lexemes.get() || lexemes.get()?.content !== "(") {
      throw new CompilerError('"while" must be followed by an opening bracket "(".', lexemes.get(-1));
    }
    lexemes.next();
    if (!lexemes.get()) {
      throw new CompilerError('"while (" must be followed by a Boolean expression.', lexemes.get(-1));
    }
    let condition = expression(lexemes, routine);
    condition = typeCheck(condition, "boolean");
    if (!lexemes.get() || lexemes.get()?.content !== ")") {
      throw new CompilerError('"while (..." must be followed by a closing bracket ")".', lexemes.get(-1));
    }
    lexemes.next();
    const whileStatement8 = new WhileStatement(whileLexeme, condition);
    if (!lexemes.get() || lexemes.get()?.content !== "{") {
      throw new CompilerError('"while (...)" must be followed by an opening curly bracket "{".', lexemes.get(-1));
    }
    lexemes.next();
    whileStatement8.statements.push(...block2(lexemes, routine));
    return whileStatement8;
  }
  function block2(lexemes, routine) {
    const statements = [];
    while (lexemes.get() && lexemes.get()?.content !== "}") {
      statements.push(statement2(lexemes.get(), lexemes, routine));
    }
    if (lexemes.get()?.content === "}") {
      lexemes.next();
    } else {
      throw new CompilerError('Closing bracket "}" missing after statement block.', lexemes.get(-1));
    }
    return statements;
  }

  // client/parser/c/subroutine.ts
  function subroutine3(lexeme, lexemes, program3) {
    const [subroutineType, stringLength] = type3(lexemes);
    const name = identifier3(lexemes, program3);
    const subroutine8 = new Subroutine(lexeme, program3, name);
    subroutine8.index = program3.subroutines.length + 1;
    if (subroutineType !== null) {
      const variable7 = new Variable("!result", subroutine8);
      variable7.type = subroutineType;
      variable7.stringLength = stringLength;
      subroutine8.variables.push(variable7);
    }
    subroutine8.variables.push(...parameters2(lexemes, subroutine8));
    if (!lexemes.get()) {
      throw new CompilerError('Method parameters must be followed by an opening bracket "{".', lexemes.get(-1));
    }
    if (lexemes.get()?.content !== "{") {
      throw new CompilerError('Method parameters must be followed by an opening bracket "{".', lexemes.get());
    }
    lexemes.next();
    subroutine8.start = lexemes.index;
    let brackets2 = 0;
    while (lexemes.get() && brackets2 >= 0) {
      if (lexemes.get()?.content === "{") {
        brackets2 += 1;
      } else if (lexemes.get()?.content === "}") {
        brackets2 -= 1;
      }
      lexemes.next();
    }
    subroutine8.end = lexemes.index - 1;
    return subroutine8;
  }
  function parameters2(lexemes, subroutine8) {
    if (!lexemes.get()) {
      throw new CompilerError("Opening bracket missing after method name.", lexemes.get(-1));
    }
    if (lexemes.get()?.content !== "(") {
      throw new CompilerError("Opening bracket missing after method name.", lexemes.get());
    }
    lexemes.next();
    const parameters7 = [];
    while (lexemes.get()?.content !== ")") {
      const parameter = variable3(lexemes, subroutine8);
      parameter.isParameter = true;
      parameters7.push(parameter);
      if (lexemes.get()?.content === ",") {
        lexemes.next();
      }
    }
    if (lexemes.get()?.content !== ")") {
      throw new CompilerError("Closing bracket missing after method parameters.", lexemes.get(-1));
    }
    lexemes.next();
    return parameters7;
  }

  // client/parser/c/parser.ts
  function c(lexemes) {
    const program3 = new Program("C");
    while (lexemes.get()) {
      const lexeme = lexemes.get();
      const lexemeIndex = lexemes.index;
      switch (lexeme.type) {
        case "keyword":
          if (lexeme.subtype === "const") {
            lexemes.next();
            program3.constants.push(constant3(lexemes, program3));
            eosCheck(lexemes);
          } else {
            throw new CompilerError("Program can only contain constant definitions, variable declarations, and subroutine defintions.", lexeme);
          }
          break;
        case "type":
          type3(lexemes);
          identifier3(lexemes, program3);
          if (lexemes.get()?.content === "(") {
            lexemes.index = lexemeIndex;
            program3.subroutines.push(subroutine3(lexeme, lexemes, program3));
          } else {
            lexemes.index = lexemeIndex;
            program3.statements.push(simpleStatement2(lexeme, lexemes, program3));
            eosCheck(lexemes);
          }
          break;
        default:
          throw new CompilerError("Program can only contain constant definitions, variable declarations, and subroutine defintions.", lexeme);
      }
    }
    for (const subroutine8 of program3.allSubroutines) {
      lexemes.index = subroutine8.start;
      while (lexemes.index < subroutine8.end) {
        subroutine8.statements.push(statement2(lexemes.get(), lexemes, subroutine8));
      }
    }
    if (!program3.subroutines.some((x) => x.name === "main")) {
      throw new CompilerError('Program does not contain any "main" method.');
    }
    return program3;
  }

  // client/parser/java/program.ts
  function program(lexemes) {
    const [keyword2, identifier8, openingBracket] = lexemes.lexemes.slice(0, 3);
    const closingBracket = lexemes.lexemes[lexemes.lexemes.length - 1];
    if (!keyword2) {
      throw new CompilerError('Program must begin with keyword "class".');
    }
    if (keyword2.content !== "class") {
      throw new CompilerError('Program must begin with keyword "class".', keyword2);
    }
    if (!identifier8) {
      throw new CompilerError("{lex} must be followed by a program name.", keyword2);
    }
    if (identifier8.type !== "identifier") {
      throw new CompilerError("{lex} is not a valid program name.", identifier8);
    }
    if (identifier8.subtype === "turtle") {
      throw new CompilerError("{lex} is the name of a predefined Turtle attribute, and cannot be used as the name of the program.", identifier8);
    }
    const firstCharacterCode = identifier8.content.charCodeAt(0);
    if (firstCharacterCode < 65 || firstCharacterCode > 90) {
      throw new CompilerError("Program name must begin with a capital letter.", identifier8);
    }
    if (!openingBracket) {
      throw new CompilerError('Program name must be followed by an opening bracket "{".', identifier8);
    }
    if (openingBracket.content !== "{") {
      throw new CompilerError('Program name must be followed by an opening bracket "{".', openingBracket);
    }
    if (!closingBracket) {
      throw new CompilerError('Program must end with a closing bracket "}".', lexemes.lexemes[lexemes.lexemes.length - 1]);
    }
    if (closingBracket.content !== "}") {
      throw new CompilerError('Program must end with a closing bracket "}".', lexemes.lexemes[lexemes.lexemes.length]);
    }
    const prog = new Program("Java", identifier8.content);
    prog.start = 3;
    prog.end = lexemes.lexemes.length - 1;
    return prog;
  }

  // client/parser/java/type.ts
  function type4(lexemes, routine) {
    const typeLexeme = lexemes.get();
    if (!typeLexeme) {
      throw new CompilerError('Expected type definition ("boolean", "char", "int", "String", or "void").', lexemes.get(-1));
    }
    if (typeLexeme.type !== "type") {
      throw new CompilerError('{lex} is not a valid type definition (expected "boolean", "char", "int", "String", or "void").', lexemes.get(-1));
    }
    const type8 = typeLexeme.subtype;
    lexemes.next();
    let stringLength = 32;
    if (type8 === "string") {
      if (lexemes.get()?.content === "(") {
        lexemes.next();
        const integer = lexemes.get();
        if (!integer) {
          throw new CompilerError("Expected string size specification.", lexemes.get(-1));
        }
        if (integer.type !== "literal" || integer.subtype !== "integer") {
          throw new CompilerError("String size must be an integer.", integer);
        }
        if (integer.value <= 0) {
          throw new CompilerError("String size must be greater than zero.", integer);
        }
        stringLength = integer.value;
        lexemes.next();
        if (!lexemes.get()) {
          throw new CompilerError('Closing bracket ")" missing after string size specification.', lexemes.get(-1));
        }
        if (lexemes.get()?.content !== ")") {
          throw new CompilerError('Closing bracket ")" missing after string size specification.', lexemes.get());
        }
        lexemes.next();
      }
    }
    const arrayDimensions = [];
    while (lexemes.get()?.content === "[") {
      lexemes.next();
      if (!lexemes.get()) {
        throw new CompilerError('Opening bracket "[" must be followed by an array size.', lexemes.get(-1));
      }
      const exp = expression(lexemes, routine);
      typeCheck(exp, "integer");
      const value = evaluate(exp, "Java", "array");
      if (typeof value === "string") {
        throw new CompilerError("Array size must be an integer.", lexemes.get());
      }
      if (value <= 0) {
        throw new CompilerError("Array size must be positive.", lexemes.get());
      }
      arrayDimensions.push([0, value - 1]);
      if (!lexemes.get()) {
        throw new CompilerError('Array size specification must be followed by closing bracket "]".', lexemes.get(-1));
      }
      if (lexemes.get()?.content !== "]") {
        throw new CompilerError('Array size specification must be followed by closing bracket "]".', lexemes.get());
      }
      lexemes.next();
    }
    if (type8 === null && arrayDimensions.length > 0) {
      throw new CompilerError("Array of void is not allowed.", typeLexeme);
    }
    return [type8, stringLength, arrayDimensions];
  }

  // client/parser/java/identifier.ts
  function identifier4(lexemes, routine) {
    const identifier8 = lexemes.get();
    if (!identifier8) {
      throw new CompilerError("{lex} must be followed by an identifier.", lexemes.get(-1));
    }
    if (identifier8.type !== "identifier") {
      throw new CompilerError("{lex} is not a valid identifier.", identifier8);
    }
    if (identifier8.subtype === "turtle") {
      throw new CompilerError("{lex} is already the name of a predefined Turtle property.", identifier8);
    }
    if (isDuplicate(routine, identifier8.value)) {
      throw new CompilerError("{lex} is already defined in the current scope.", identifier8);
    }
    lexemes.next();
    return identifier8.value;
  }

  // client/parser/java/constant.ts
  function constant4(lexemes, routine) {
    const [constantType, , arrayDimensions] = type4(lexemes, routine);
    if (constantType === null) {
      throw new CompilerError('Constant type cannot be void (expected "boolean", "char", "int", or "String").', lexemes.get());
    }
    if (arrayDimensions.length > 0) {
      throw new CompilerError("Constant cannot be an array.", lexemes.get());
    }
    const name = identifier4(lexemes, routine);
    if (!lexemes.get()) {
      throw new CompilerError(`Constant ${name} must be assigned a value.`, lexemes.get(-1));
    }
    if (lexemes.get()?.content !== "=") {
      throw new CompilerError(`Constant ${name} must be assigned a value.`, lexemes.get());
    }
    lexemes.next();
    const exp = expression(lexemes, routine);
    typeCheck(exp, constantType);
    const value = evaluate(exp, "Java", "constant");
    return new Constant("Java", name, value);
  }

  // client/parser/java/variable.ts
  function variable4(lexemes, routine) {
    const [variableType, stringLength, arrayDimensions] = type4(lexemes, routine);
    if (variableType === null) {
      throw new CompilerError('Variable cannot be void (expected "boolean", "char", "int", or "String").', lexemes.get());
    }
    const name = identifier4(lexemes, routine);
    const variable7 = new Variable(name, routine);
    variable7.type = variableType;
    variable7.stringLength = stringLength;
    variable7.arrayDimensions = arrayDimensions;
    return variable7;
  }

  // client/parser/java/statement.ts
  function eosCheck2(lexemes) {
    if (!lexemes.get() || lexemes.get()?.content !== ";") {
      throw new CompilerError("Statement must be followed by a semicolon.", lexemes.get(-1));
    }
    lexemes.next();
  }
  function statement3(lexeme, lexemes, routine) {
    let statement8;
    switch (lexeme.type) {
      case "identifier":
      case "type":
        statement8 = simpleStatement3(lexeme, lexemes, routine);
        eosCheck2(lexemes);
        break;
      case "keyword":
        switch (lexeme.subtype) {
          case "final":
            statement8 = simpleStatement3(lexeme, lexemes, routine);
            eosCheck2(lexemes);
            break;
          case "return":
            lexemes.next();
            statement8 = returnStatement3(lexeme, lexemes, routine);
            break;
          case "if":
            lexemes.next();
            statement8 = ifStatement3(lexeme, lexemes, routine);
            break;
          case "else":
            throw new CompilerError('Statement cannot begin with "else". If you have an "if" above, you may be missing a closing bracket "}".', lexeme);
          case "for":
            lexemes.next();
            statement8 = forStatement3(lexeme, lexemes, routine);
            break;
          case "do":
            lexemes.next();
            statement8 = doStatement2(lexeme, lexemes, routine);
            break;
          case "while":
            lexemes.next();
            statement8 = whileStatement3(lexeme, lexemes, routine);
            break;
          default:
            throw new CompilerError("Statement cannot begin with {lex}.", lexeme);
        }
        break;
      default:
        throw new CompilerError("Statement cannot begin with {lex}.", lexeme);
    }
    return statement8;
  }
  function simpleStatement3(lexeme, lexemes, routine) {
    switch (lexeme.type) {
      case "keyword":
        lexemes.next();
        routine.constants.push(constant4(lexemes, routine));
        return new PassStatement();
      case "type":
        const variableLexeme = lexemes.get(1);
        const foo = variable4(lexemes, routine);
        routine.variables.push(foo);
        if (lexemes.get()?.content === "=") {
          return variableAssignment3(variableLexeme, lexemes, routine, foo);
        } else {
          return new PassStatement();
        }
      case "identifier":
        const bar = variable(routine, lexeme.value);
        const baz = command(routine, lexeme.value);
        if (bar) {
          lexemes.next();
          return variableAssignment3(lexeme, lexemes, routine, bar);
        } else if (baz) {
          lexemes.next();
          const statement8 = procedureCall(lexeme, lexemes, routine, baz);
          return statement8;
        } else {
          throw new CompilerError("{lex} is not defined.", lexemes.get());
        }
    }
  }
  function variableAssignment3(variableLexeme, lexemes, routine, variable7) {
    const indexes = [];
    if (lexemes.get()?.content === "[") {
      if (variable7.isArray) {
        lexemes.next();
        while (lexemes.get() && lexemes.get()?.content !== "]") {
          let exp = expression(lexemes, routine);
          exp = typeCheck(exp, "integer");
          indexes.push(exp);
          if (lexemes.get()?.content === "]" && lexemes.get(1)?.content === "[") {
            lexemes.next();
            lexemes.next();
          }
        }
        if (!lexemes.get()) {
          throw new CompilerError('Closing bracket "]" needed after array indexes.', lexemes.get(-1));
        }
        lexemes.next();
      } else if (variable7.type === "string") {
        lexemes.next();
        let exp = expression(lexemes, routine);
        exp = typeCheck(exp, "integer");
        indexes.push(exp);
        if (!lexemes.get() || lexemes.get()?.content !== "]") {
          throw new CompilerError('Closing bracket "]" missing after string variable index.', exp.lexeme);
        }
        lexemes.next();
      } else {
        throw new CompilerError("{lex} is not a string or array variable.", variableLexeme);
      }
    }
    if (variable7.isArray) {
      const allowedIndexes = variable7.type === "string" ? variable7.arrayDimensions.length + 1 : variable7.arrayDimensions.length;
      if (indexes.length > allowedIndexes) {
        throw new CompilerError("Too many indexes for array variable {lex}.", variableLexeme);
      }
    }
    const assignmentLexeme = lexemes.get();
    if (!assignmentLexeme) {
      throw new CompilerError('Variable must be followed by assignment operator "=".', lexemes.get(-1));
    }
    if (assignmentLexeme.type !== "operator" || assignmentLexeme.content !== "=") {
      throw new CompilerError('Variable must be followed by assignment operator "=".', assignmentLexeme);
    }
    lexemes.next();
    if (!lexemes.get()) {
      throw new CompilerError(`Variable "${variable7.name}" must be assigned a value.`, lexemes.get(-1));
    }
    let value = expression(lexemes, routine);
    const variableValue2 = new VariableValue(variableLexeme, variable7);
    variableValue2.indexes.push(...indexes);
    value = typeCheck(value, variableValue2.type);
    return new VariableAssignment(assignmentLexeme, variable7, indexes, value);
  }
  function returnStatement3(returnLexeme, lexemes, routine) {
    if (routine.type !== "function") {
      throw new CompilerError("Procedures cannot return a value.", lexemes.get());
    }
    let value = expression(lexemes, routine);
    value = typeCheck(value, routine.returns);
    eosCheck2(lexemes);
    routine.hasReturnStatement = true;
    return new ReturnStatement(returnLexeme, routine, value);
  }
  function ifStatement3(ifLexeme, lexemes, routine) {
    if (!lexemes.get() || lexemes.get()?.content !== "(") {
      throw new CompilerError('"if" must be followed by an opening bracket "(".', lexemes.get(-1));
    }
    lexemes.next();
    if (!lexemes.get()) {
      throw new CompilerError('"if (" must be followed by a Boolean expression.', lexemes.get(-1));
    }
    let condition = expression(lexemes, routine);
    condition = typeCheck(condition, "boolean");
    if (!lexemes.get() || lexemes.get()?.content !== ")") {
      throw new CompilerError('"if (..." must be followed by a closing bracket ")".', lexemes.get(-1));
    }
    lexemes.next();
    const ifStatement8 = new IfStatement(ifLexeme, condition);
    if (!lexemes.get() || lexemes.get()?.content !== "{") {
      throw new CompilerError('"if (...)" must be followed by an opening curly bracket "{".', lexemes.get(-1));
    }
    lexemes.next();
    ifStatement8.ifStatements.push(...block3(lexemes, routine));
    if (lexemes.get() && lexemes.get()?.content === "else") {
      lexemes.next();
      if (!lexemes.get() || lexemes.get()?.content !== "{") {
        throw new CompilerError('"else" must be followed by an opening bracket "{".', lexemes.get(-1));
      }
      lexemes.next();
      ifStatement8.elseStatements.push(...block3(lexemes, routine));
    }
    return ifStatement8;
  }
  function forStatement3(forLexeme, lexemes, routine) {
    if (!lexemes.get() || lexemes.get()?.content !== "(") {
      throw new CompilerError('"for" must be followed by an opening bracket "(".', lexemes.get(-1));
    }
    lexemes.next();
    const firstInitialisationLexeme = lexemes.get();
    if (!firstInitialisationLexeme) {
      throw new CompilerError('"for" conditions must begin with a variable assignment.', lexemes.get(-1));
    }
    if (firstInitialisationLexeme.type !== "identifier" && firstInitialisationLexeme.type !== "type") {
      throw new CompilerError('"for" conditions must begin with a variable assignment.', lexemes.get());
    }
    const initialisation = simpleStatement3(firstInitialisationLexeme, lexemes, routine);
    if (!(initialisation instanceof VariableAssignment)) {
      throw new CompilerError('"for" conditions must begin with a variable assignment.', lexemes.get(-1));
    }
    if (initialisation.variable.type !== "integer") {
      throw new CompilerError("Loop variable must be an integer.", lexemes.get());
    }
    eosCheck2(lexemes);
    if (!lexemes.get()) {
      throw new CompilerError('"for (...;" must be followed by a loop condition.', lexemes.get(-1));
    }
    let condition = expression(lexemes, routine);
    condition = typeCheck(condition, "boolean");
    eosCheck2(lexemes);
    const firstChangeLexeme = lexemes.get();
    if (!firstChangeLexeme) {
      throw new CompilerError('"for" conditions must begin with a variable assignment.', lexemes.get(-1));
    }
    if (firstChangeLexeme.type !== "identifier" && firstChangeLexeme.type !== "type") {
      throw new CompilerError('"for" conditions must begin with a variable assignment.', firstChangeLexeme);
    }
    const change = simpleStatement3(firstChangeLexeme, lexemes, routine);
    if (!(change instanceof VariableAssignment)) {
      throw new CompilerError('"for" loop variable must be changed on each loop.', lexemes.get(-1));
    }
    if (change.variable !== initialisation.variable) {
      throw new CompilerError("Initial loop variable and change loop variable must be the same.", lexemes.get(-1));
    }
    if (!lexemes.get() || lexemes.get()?.content !== ")") {
      throw new CompilerError('Closing bracket ")" missing after "for" loop initialisation.', lexemes.get(-1));
    }
    lexemes.next();
    const forStatement8 = new ForStatement(forLexeme, initialisation, condition, change);
    if (!lexemes.get() || lexemes.get()?.content !== "{") {
      throw new CompilerError('"for (...)" must be followed by an opening bracket "{".', lexemes.get(-1));
    }
    lexemes.next();
    forStatement8.statements.push(...block3(lexemes, routine));
    return forStatement8;
  }
  function doStatement2(doLexeme, lexemes, routine) {
    if (!lexemes.get() || lexemes.get()?.content !== "{") {
      throw new CompilerError('"do" must be followed by an opening bracket "{".', lexemes.get(-1));
    }
    lexemes.next();
    const repeatStatements = block3(lexemes, routine);
    if (!lexemes.get() || lexemes.get()?.content !== "while") {
      throw new CompilerError('"do { ... }" must be followed by "while".', lexemes.get(-1));
    }
    lexemes.next();
    if (!lexemes.get() || lexemes.get()?.content !== "(") {
      throw new CompilerError('"while" must be followed by an opening bracket "(".', lexemes.get(-1));
    }
    lexemes.next();
    if (!lexemes.get()) {
      throw new CompilerError('"while (" must be followed by a boolean expression.', lexemes.get(-1));
    }
    let condition = expression(lexemes, routine);
    condition = typeCheck(condition, "boolean");
    const notToken = new Token("operator", "!", condition.lexeme.line, condition.lexeme.character);
    const notLexeme = new OperatorLexeme(notToken, "C");
    condition = new CompoundExpression(notLexeme, null, condition, "not");
    if (!lexemes.get() || lexemes.get()?.content !== ")") {
      throw new CompilerError('"while (..." must be followed by a closing bracket ")".', lexemes.get(-1));
    }
    lexemes.next();
    eosCheck2(lexemes);
    const repeatStatement4 = new RepeatStatement(doLexeme, condition);
    repeatStatement4.statements.push(...repeatStatements);
    return repeatStatement4;
  }
  function whileStatement3(whileLexeme, lexemes, routine) {
    if (!lexemes.get() || lexemes.get()?.content !== "(") {
      throw new CompilerError('"while" must be followed by an opening bracket "(".', lexemes.get(-1));
    }
    lexemes.next();
    if (!lexemes.get()) {
      throw new CompilerError('"while (" must be followed by a Boolean expression.', lexemes.get(-1));
    }
    let condition = expression(lexemes, routine);
    condition = typeCheck(condition, "boolean");
    if (!lexemes.get() || lexemes.get()?.content !== ")") {
      throw new CompilerError('"while (..." must be followed by a closing bracket ")".', lexemes.get(-1));
    }
    lexemes.next();
    const whileStatement8 = new WhileStatement(whileLexeme, condition);
    if (!lexemes.get() || lexemes.get()?.content !== "{") {
      throw new CompilerError('"while (...)" must be followed by an opening curly bracket "{".', lexemes.get(-1));
    }
    lexemes.next();
    whileStatement8.statements.push(...block3(lexemes, routine));
    return whileStatement8;
  }
  function block3(lexemes, routine) {
    const statements = [];
    while (lexemes.get() && lexemes.get()?.content !== "}") {
      statements.push(statement3(lexemes.get(), lexemes, routine));
    }
    if (lexemes.get()?.content === "}") {
      lexemes.next();
    } else {
      throw new CompilerError('Closing bracket "}" missing after statement block.', lexemes.get(-1));
    }
    return statements;
  }

  // client/parser/java/subroutine.ts
  function subroutine4(lexeme, lexemes, program3) {
    const [subroutineType, stringLength, arrayDimensions] = type4(lexemes, program3);
    const name = identifier4(lexemes, program3);
    if (arrayDimensions.length > 0) {
      throw new CompilerError("Methods cannot return arrays.", lexemes.get(-1));
    }
    const subroutine8 = new Subroutine(lexeme, program3, name);
    subroutine8.index = program3.subroutines.length + 1;
    if (subroutineType !== null) {
      const variable7 = new Variable("!result", subroutine8);
      variable7.type = subroutineType;
      variable7.stringLength = stringLength;
      subroutine8.variables.push(variable7);
    }
    subroutine8.variables.push(...parameters3(lexemes, subroutine8));
    if (!lexemes.get()) {
      throw new CompilerError('Method parameters must be followed by an opening bracket "{".', lexemes.get(-1));
    }
    if (lexemes.get()?.content !== "{") {
      throw new CompilerError('Method parameters must be followed by an opening bracket "{".', lexemes.get());
    }
    lexemes.next();
    subroutine8.start = lexemes.index;
    let brackets2 = 0;
    while (lexemes.get() && brackets2 >= 0) {
      if (lexemes.get()?.content === "{") {
        brackets2 += 1;
      } else if (lexemes.get()?.content === "}") {
        brackets2 -= 1;
      }
      lexemes.next();
    }
    subroutine8.end = lexemes.index - 1;
    return subroutine8;
  }
  function parameters3(lexemes, subroutine8) {
    if (!lexemes.get()) {
      throw new CompilerError("Opening bracket missing after method name.", lexemes.get(-1));
    }
    if (lexemes.get()?.content !== "(") {
      throw new CompilerError("Opening bracket missing after method name.", lexemes.get());
    }
    lexemes.next();
    const parameters7 = [];
    while (lexemes.get()?.content !== ")") {
      const parameter = variable4(lexemes, subroutine8);
      parameter.isParameter = true;
      parameters7.push(parameter);
      if (lexemes.get()?.content === ",") {
        lexemes.next();
      }
    }
    if (lexemes.get()?.content !== ")") {
      throw new CompilerError("Closing bracket missing after method parameters.", lexemes.get(-1));
    }
    lexemes.next();
    return parameters7;
  }

  // client/parser/java/parser.ts
  function java(lexemes) {
    const prog = program(lexemes);
    lexemes.index = prog.start;
    while (lexemes.index < prog.end) {
      const lexeme = lexemes.get();
      const lexemeIndex = lexemes.index;
      switch (lexeme.type) {
        case "keyword":
          if (lexeme.subtype === "final") {
            lexemes.next();
            prog.constants.push(constant4(lexemes, prog));
            eosCheck2(lexemes);
          } else {
            throw new CompilerError("Program can only contain constant definitions, variable declarations, and subroutine defintions.", lexeme);
          }
          break;
        case "type":
          type4(lexemes, prog);
          identifier4(lexemes, prog);
          if (lexemes.get()?.content === "(") {
            lexemes.index = lexemeIndex;
            prog.subroutines.push(subroutine4(lexeme, lexemes, prog));
          } else {
            lexemes.index = lexemeIndex;
            prog.statements.push(simpleStatement3(lexeme, lexemes, prog));
            eosCheck2(lexemes);
          }
          break;
        default:
          throw new CompilerError("Program can only contain constant definitions, variable declarations, and subroutine defintions.", lexeme);
      }
    }
    for (const subroutine8 of prog.allSubroutines) {
      lexemes.index = subroutine8.start;
      while (lexemes.index < subroutine8.end) {
        subroutine8.statements.push(statement3(lexemes.get(), lexemes, subroutine8));
      }
    }
    if (!prog.subroutines.some((x) => x.name === "main")) {
      throw new CompilerError('Program does not contain any "main" method.');
    }
    return prog;
  }

  // client/parser/pascal/identifier.ts
  function identifier5(lexemes, routine) {
    const identifier8 = lexemes.get();
    if (!identifier8) {
      throw new CompilerError("{lex} must be followed by an identifier.", lexemes.get(-1));
    }
    if (identifier8.type !== "identifier") {
      throw new CompilerError("{lex} is not a valid identifier.", identifier8);
    }
    if (identifier8.subtype === "turtle") {
      throw new CompilerError("{lex} is already the name of a predefined Turtle property.", identifier8);
    }
    if (isDuplicate(routine, identifier8.value)) {
      throw new CompilerError("{lex} is already defined in the current scope.", identifier8);
    }
    lexemes.next();
    return identifier8.value;
  }

  // client/parser/pascal/statement.ts
  function semicolon(lexemes, compulsory = false, context2 = "statement") {
    if (compulsory && (!lexemes.get() || lexemes.get()?.content !== ";")) {
      throw new CompilerError(`Semicolon needed after ${context2}.`, lexemes.get(-1));
    }
    while (lexemes.get() && lexemes.get()?.content === ";") {
      lexemes.next();
    }
  }
  function eosCheck3(lexemes) {
    const noSemiAfter = ["begin", "do", ".", "repeat", ";", "then"];
    const noSemiBefore = ["else", "end", ";", "until"];
    if (lexemes.get()) {
      if (lexemes.get()?.content !== ";") {
        if (noSemiAfter.indexOf(lexemes.get(-1)?.content?.toLowerCase()) === -1) {
          if (noSemiBefore.indexOf(lexemes.get()?.content?.toLowerCase()) === -1) {
            throw new CompilerError("Semicolon needed after command.", lexemes.get());
          }
        }
      } else {
        while (lexemes.get() && lexemes.get()?.content === ";") {
          lexemes.next();
        }
      }
    }
  }
  function statement4(lexeme, lexemes, routine) {
    let statement8;
    switch (lexeme.type) {
      case "identifier":
        statement8 = simpleStatement4(lexeme, lexemes, routine);
        break;
      case "keyword":
        switch (lexeme.subtype) {
          case "if":
            lexemes.next();
            statement8 = ifStatement4(lexeme, lexemes, routine);
            break;
          case "for":
            lexemes.next();
            statement8 = forStatement4(lexeme, lexemes, routine);
            break;
          case "repeat":
            lexemes.next();
            statement8 = repeatStatement2(lexeme, lexemes, routine);
            break;
          case "while":
            lexemes.next();
            statement8 = whileStatement4(lexeme, lexemes, routine);
            break;
          default:
            throw new CompilerError("Statement cannot begin with {lex}.", lexeme);
        }
        break;
      default:
        throw new CompilerError("Statement cannot begin with {lex}.", lexeme);
    }
    eosCheck3(lexemes);
    return statement8;
  }
  function simpleStatement4(lexeme, lexemes, routine) {
    const constant7 = constant(routine, lexeme.value);
    if (constant7) {
      throw new CompilerError("{lex} is a constant, not a variable.", lexeme);
    }
    const variable7 = variable(routine, lexeme.value);
    if (variable7) {
      lexemes.next();
      return variableAssignment4(lexeme, lexemes, routine, variable7);
    }
    const command2 = command(routine, lexeme.value);
    if (command2) {
      lexemes.next();
      return procedureCall(lexeme, lexemes, routine, command2);
    }
    throw new CompilerError("Identifier {lex} is not defined.", lexeme);
  }
  function variableAssignment4(variableLexeme, lexemes, routine, variable7) {
    const indexes = [];
    if (lexemes.get()?.content === "[") {
      if (variable7.isArray) {
        lexemes.next();
        while (lexemes.get() && lexemes.get()?.content !== "]") {
          let exp = expression(lexemes, routine);
          exp = typeCheck(exp, "integer");
          indexes.push(exp);
          if (lexemes.get()?.content === ",") {
            lexemes.next();
            if (lexemes.get()?.content === "]") {
              throw new CompilerError("Trailing comma at the end of array indexes.", lexemes.get(-1));
            }
          }
        }
        if (!lexemes.get()) {
          throw new CompilerError('Closing bracket "]" needed after array indexes.', lexemes.get(-1));
        }
        lexemes.next();
      } else if (variable7.type === "string") {
        lexemes.next();
        let exp = expression(lexemes, routine);
        exp = typeCheck(exp, "integer");
        indexes.push(exp);
        if (!lexemes.get() || lexemes.get()?.content !== "]") {
          throw new CompilerError('Closing bracket "]" missing after string variable index.', exp.lexeme);
        }
        lexemes.next();
      } else {
        throw new CompilerError("{lex} is not a string or array variable.", variableLexeme);
      }
    }
    if (variable7.isArray) {
      const allowedIndexes = variable7.type === "string" ? variable7.arrayDimensions.length + 1 : variable7.arrayDimensions.length;
      if (indexes.length > allowedIndexes) {
        throw new CompilerError("Too many indexes for array variable {lex}.", variableLexeme);
      }
    }
    const assignmentLexeme = lexemes.get();
    if (!assignmentLexeme || assignmentLexeme.type !== "operator" || assignmentLexeme.subtype !== "asgn") {
      throw new CompilerError('Variable must be followed by assignment operator ":=".', variableLexeme);
    }
    lexemes.next();
    if (!lexemes.get()) {
      throw new CompilerError(`Variable "${variable7.name}" must be assigned a value.`, assignmentLexeme);
    }
    const typeToCheck = variable7.type === "string" && indexes.length > 0 ? "character" : variable7.type;
    let value = expression(lexemes, routine);
    value = typeCheck(value, typeToCheck);
    return new VariableAssignment(assignmentLexeme, variable7, indexes, value);
  }
  function ifStatement4(ifLexeme, lexemes, routine) {
    if (!lexemes.get()) {
      throw new CompilerError('"IF" must be followed by a boolean expression.', ifLexeme);
    }
    let condition = expression(lexemes, routine);
    condition = typeCheck(condition, "boolean");
    const ifStatement8 = new IfStatement(ifLexeme, condition);
    if (!lexemes.get() || lexemes.get()?.content?.toLowerCase() !== "then") {
      throw new CompilerError('"IF ..." must be followed by "THEN".', condition.lexeme);
    }
    lexemes.next();
    const firstSubLexeme = lexemes.get();
    if (!firstSubLexeme) {
      throw new CompilerError('No commands found after "IF ... THEN".', lexemes.get(-1));
    }
    if (firstSubLexeme.content?.toLowerCase() === "begin") {
      lexemes.next();
      ifStatement8.ifStatements.push(...block4(lexemes, routine, "begin"));
    } else {
      ifStatement8.ifStatements.push(statement4(firstSubLexeme, lexemes, routine));
    }
    if (lexemes.get() && lexemes.get()?.content?.toLowerCase() === "else") {
      lexemes.next();
      const firstSubLexeme2 = lexemes.get();
      if (!firstSubLexeme2) {
        throw new CompilerError('No commands found after "ELSE".', lexemes.get(-1));
      }
      if (firstSubLexeme2.content?.toLowerCase() === "begin") {
        lexemes.next();
        ifStatement8.elseStatements.push(...block4(lexemes, routine, "begin"));
      } else {
        ifStatement8.elseStatements.push(statement4(firstSubLexeme2, lexemes, routine));
      }
    }
    return ifStatement8;
  }
  function forStatement4(forLexeme, lexemes, routine) {
    const variableLexeme = lexemes.get();
    if (!variableLexeme) {
      throw new CompilerError('"FOR" must be followed by an integer variable.', forLexeme);
    }
    if (variableLexeme.type !== "identifier") {
      throw new CompilerError('"FOR" must be followed by an integer variable.', variableLexeme);
    }
    if (variableLexeme.subtype === "turtle") {
      throw new CompilerError('Turtle attribute cannot be used as a "FOR" variable.', variableLexeme);
    }
    const variable7 = variable(routine, variableLexeme.value);
    if (!variable7) {
      throw new CompilerError("Variable {lex} has not been declared.", variableLexeme);
    }
    if (variable7.type !== "integer" && variable7.type !== "boolint") {
      throw new CompilerError("{lex} is not an integer variable.", variableLexeme);
    }
    if (variable7.isArray) {
      throw new CompilerError("FOR variable cannot be an array or array element.", variableLexeme);
    }
    lexemes.next();
    const initialisation = variableAssignment4(variableLexeme, lexemes, routine, variable7);
    const toLexeme = lexemes.get();
    const toOrDownTo = toLexeme?.content?.toLowerCase();
    if (!toLexeme || toOrDownTo !== "to" && toOrDownTo !== "downto") {
      throw new CompilerError('"FOR ... := ..." must be followed by "TO" or "DOWNTO".', initialisation.lexeme);
    }
    const oneToken = new Token("decimal", "1", forLexeme.line, -1);
    const assignmentToken = new Token("operator", "=", forLexeme.line, -1);
    const operatorToken = new Token("operator", toOrDownTo === "to" ? "+" : "-", forLexeme.line, -1);
    const oneLexeme = new IntegerLexeme(oneToken, 10);
    const assignmentLexeme = new OperatorLexeme(assignmentToken, "Pascal");
    const plusLexeme = new OperatorLexeme(operatorToken, "Pascal");
    const left = new VariableValue(variableLexeme, variable7);
    const right = new IntegerValue(oneLexeme);
    const changeOperator = toOrDownTo === "to" ? "plus" : "subt";
    const value = new CompoundExpression(plusLexeme, left, right, changeOperator);
    const change = new VariableAssignment(assignmentLexeme, variable7, [], value);
    lexemes.next();
    if (!lexemes.get()) {
      throw new CompilerError(`"${toOrDownTo.toUpperCase()}" must be followed by an integer (or integer constant).`, toLexeme);
    }
    let finalValue = expression(lexemes, routine);
    finalValue = typeCheck(finalValue, "integer");
    const comparisonToken = new Token("operator", toOrDownTo === "to" ? "<=" : ">=", forLexeme.line, -1);
    const comparisonLexeme = new OperatorLexeme(comparisonToken, "Pascal");
    const comparisonOperator = toOrDownTo === "to" ? "lseq" : "mreq";
    const condition = new CompoundExpression(comparisonLexeme, left, finalValue, comparisonOperator);
    const forStatement8 = new ForStatement(forLexeme, initialisation, condition, change);
    const doLexeme = lexemes.get();
    if (!doLexeme) {
      throw new CompilerError('"FOR" loop range must be followed by "DO".', lexemes.get(-1));
    }
    lexemes.next();
    const firstSubLexeme = lexemes.get();
    if (!firstSubLexeme) {
      throw new CompilerError('No commands found after "FOR" loop initialisation.', doLexeme);
    }
    if (firstSubLexeme.content?.toLowerCase() === "begin") {
      lexemes.next();
      forStatement8.statements.push(...block4(lexemes, routine, "begin"));
    } else {
      forStatement8.statements.push(statement4(firstSubLexeme, lexemes, routine));
    }
    return forStatement8;
  }
  function repeatStatement2(repeatLexeme, lexemes, routine) {
    const repeatStatements = block4(lexemes, routine, "repeat");
    if (!lexemes.get()) {
      throw new CompilerError('"UNTIL" must be followed by a boolean expression.', lexemes.get(-1));
    }
    let condition = expression(lexemes, routine);
    condition = typeCheck(condition, "boolean");
    const repeatStatement4 = new RepeatStatement(repeatLexeme, condition);
    repeatStatement4.statements.push(...repeatStatements);
    return repeatStatement4;
  }
  function whileStatement4(whileLexeme, lexemes, routine) {
    if (!lexemes.get()) {
      throw new CompilerError('"WHILE" must be followed by a boolean expression.', whileLexeme);
    }
    let condition = expression(lexemes, routine);
    condition = typeCheck(condition, "boolean");
    const whileStatement8 = new WhileStatement(whileLexeme, condition);
    if (!lexemes.get()) {
      throw new CompilerError('"WHILE ..." must be followed by "DO".', condition.lexeme);
    }
    if (lexemes.get()?.content !== "do") {
      throw new CompilerError('"WHILE ..." must be followed by "DO".', lexemes.get());
    }
    lexemes.next();
    const firstSubLexeme = lexemes.get();
    if (!firstSubLexeme) {
      throw new CompilerError('No commands found after "WHILE" loop initialisation.', lexemes.get(-1));
    }
    if (lexemes.get()?.content?.toLowerCase() === "begin") {
      lexemes.next();
      whileStatement8.statements.push(...block4(lexemes, routine, "begin"));
    } else {
      whileStatement8.statements.push(statement4(firstSubLexeme, lexemes, routine));
    }
    return whileStatement8;
  }
  function block4(lexemes, routine, start) {
    const statements = [];
    let end = false;
    if (!lexemes.get()) {
      throw new CompilerError(`No commands found after "${start.toUpperCase()}".`, lexemes.get(-1));
    }
    while (!end && lexemes.get()) {
      const lexeme = lexemes.get();
      end = blockEndCheck2(start, lexeme);
      if (end) {
        lexemes.next();
      } else {
        statements.push(statement4(lexeme, lexemes, routine));
      }
    }
    if (!end) {
      if (start === "begin") {
        throw new CompilerError('"BEGIN" does not have any matching "END".', lexemes.get(-1));
      }
      throw new CompilerError('"REPEAT" does not have any matching "UNTIL".', lexemes.get(-1));
    }
    return statements;
  }
  function blockEndCheck2(start, lexeme) {
    switch (lexeme.content.toLowerCase()) {
      case "end":
        if (start !== "begin") {
          throw new CompilerError('"END" does not have any matching "BEGIN".', lexeme);
        }
        return true;
      case "until":
        if (start !== "repeat") {
          throw new CompilerError('"UNTIL" does not have any matching "REPEAT".', lexeme);
        }
        return true;
      default:
        return false;
    }
  }

  // client/parser/pascal/constant.ts
  function constant5(lexemes, routine) {
    const name = identifier5(lexemes, routine);
    if (!lexemes.get() || lexemes.get()?.content !== "=") {
      throw new CompilerError("Constant must be assigned a value.", lexemes.get(-1));
    }
    lexemes.next();
    let exp = expression(lexemes, routine);
    const value = evaluate(exp, "Pascal", "constant");
    const foo = new Constant("Pascal", name, value);
    semicolon(lexemes, true, "constant definition");
    return foo;
  }

  // client/parser/pascal/type.ts
  function type5(lexemes, routine, isParameter) {
    if (!lexemes.get()) {
      throw new CompilerError('Expected type specification (": <type>").', lexemes.get(-1));
    }
    if (lexemes.get()?.content !== ":") {
      throw new CompilerError('Expected type specification (": <type>").', lexemes.get());
    }
    lexemes.next();
    const arrayDimensions = [];
    if (lexemes.get()?.content === "array") {
      if (isParameter) {
        while (lexemes.get()?.content === "array") {
          arrayDimensions.push([0, 0]);
          lexemes.next();
          if (!lexemes.get() || lexemes.get()?.content !== "of") {
            throw new CompilerError('Keyword "array" must be followed by "of".', lexemes.get(-1));
          }
          lexemes.next();
        }
      } else {
        lexemes.next();
        if (!lexemes.get() && lexemes.get()?.content !== "[") {
          throw new CompilerError('Keyword "array" must be followed by array dimensions.', lexemes.get(-1));
        }
        lexemes.next();
        while (lexemes.get() && lexemes.get()?.content !== "]") {
          const startExp = expression(lexemes, routine);
          typeCheck(startExp, "integer");
          const start = evaluate(startExp, "Pascal", "array");
          if (!lexemes.get() || lexemes.get()?.content !== "..") {
            throw new CompilerError('Array start index must be followed by ".." then the end index.', lexemes.get(-1));
          }
          lexemes.next();
          const endExp = expression(lexemes, routine);
          typeCheck(endExp, "integer");
          const end = evaluate(endExp, "Pascal", "array");
          arrayDimensions.push([start, end]);
          if (lexemes.get()?.content === ",") {
            lexemes.next();
          } else if (lexemes.get()?.content !== "]") {
            throw new CompilerError("Comma missing between array dimensions.", lexemes.get(-1));
          }
        }
        if (!lexemes.get()) {
          throw new CompilerError('Closing bracket "]" missing after array dimensions specification.', lexemes.get(-1));
        }
        lexemes.next();
        if (!lexemes.get() || lexemes.get()?.content?.toLowerCase() !== "of") {
          throw new CompilerError('"array[...]" must be followed by "of".', lexemes.get(-1));
        }
        lexemes.next();
      }
    }
    const typeLexeme = lexemes.get();
    if (!typeLexeme) {
      throw new CompilerError('Expected type definition ("array", "boolean", "char", "integer", or "string").', lexemes.get(-1));
    }
    if (typeLexeme.type !== "type") {
      throw new CompilerError('{lex} is not a valid type definition (expected "array", "boolean", "char", "integer", or "string").', lexemes.get());
    }
    const type8 = typeLexeme.subtype;
    lexemes.next();
    let stringLength = 32;
    if (type8 === "string") {
      if (lexemes.get()?.content === "[") {
        lexemes.next();
        const stringLengthExp = expression(lexemes, routine);
        typeCheck(stringLengthExp, "integer");
        stringLength = evaluate(stringLengthExp, "Pascal", "string");
        if (!lexemes.get()) {
          throw new CompilerError('Closing bracket "]" missing after string size specification.', lexemes.get(-1));
        }
        if (lexemes.get()?.content !== "]") {
          throw new CompilerError('Closing bracket "]" missing after string size specification.', lexemes.get());
        }
        lexemes.next();
      }
    }
    return [type8, stringLength, arrayDimensions];
  }

  // client/parser/pascal/variable.ts
  function variables2(lexemes, routine) {
    const vars = [];
    while (lexemes.get() && lexemes.get()?.content !== ":") {
      const name = identifier5(lexemes, routine);
      vars.push(new Variable(name, routine));
      if (lexemes.get()?.content === ",") {
        lexemes.next();
      } else if (lexemes.get()?.type === "identifier") {
        throw new CompilerError("Comma missing between variable names.", lexemes.get());
      }
    }
    const [variableType, stringLength, arrayDimensions] = type5(lexemes, routine, false);
    for (const foo of vars) {
      foo.type = variableType;
      foo.stringLength = stringLength;
      foo.arrayDimensions = arrayDimensions;
    }
    semicolon(lexemes, true, "variable declaration");
    if (lexemes.get() && lexemes.get()?.type === "identifier") {
      vars.push(...variables2(lexemes, routine));
    }
    return vars;
  }

  // client/parser/pascal/subroutine.ts
  function subroutine5(lexeme, lexemes, parent) {
    const isFunction = lexeme.subtype === "function";
    const name = identifier5(lexemes, parent);
    const sub = new Subroutine(lexeme, parent, name);
    sub.index = subroutineIndex(sub);
    if (lexemes.get()?.content === "(") {
      lexemes.next();
      sub.variables.push(...parameters4(lexemes, sub));
    }
    if (isFunction) {
      const [returnType, stringLength, arrayDimensions] = type5(lexemes, sub, false);
      if (arrayDimensions.length > 0) {
        throw new CompilerError("Functions cannot return arrays.", lexemes.get(-1));
      }
      const foo = new Variable("result", sub);
      foo.type = returnType;
      foo.stringLength = stringLength;
      sub.variables.unshift(foo);
    }
    semicolon(lexemes, true, `${sub.type} definition`);
    let begun = false;
    while (lexemes.get() && lexemes.get()?.content?.toLowerCase() !== "end") {
      const lexeme2 = lexemes.get();
      switch (lexeme2.type) {
        case "keyword":
          switch (lexeme2.subtype) {
            case "var":
              lexemes.next();
              sub.variables.push(...variables2(lexemes, sub));
              break;
            case "procedure":
            case "function":
              lexemes.next();
              sub.subroutines.push(subroutine5(lexeme2, lexemes, sub));
              break;
            case "begin":
              begun = true;
              lexemes.next();
              while (lexemes.get() && lexemes.get()?.content?.toLowerCase() !== "end") {
                const lexeme3 = lexemes.get();
                sub.statements.push(statement4(lexeme3, lexemes, sub));
              }
              break;
            default:
              if (!begun) {
                throw new CompilerError(`Keyword "begin" missing for ${sub.type} ${sub.name}.`, lexemes.get());
              }
              throw new CompilerError("{lex} makes no sense here.", lexemes.get());
          }
          break;
        default:
          if (!begun) {
            throw new CompilerError(`Keyword "begin" missing for ${sub.type} ${sub.name}.`, lexemes.get());
          }
          throw new CompilerError("{lex} makes no sense here.", lexemes.get());
      }
    }
    if (!begun) {
      throw new CompilerError(`Keyword "begin" missing for ${sub.type} ${sub.name}.`, lexemes.get(-1));
    }
    if (!lexemes.get()) {
      throw new CompilerError(`Keyword "end" missing for ${sub.type} ${sub.name}.`, lexemes.get(-1));
    }
    lexemes.next();
    semicolon(lexemes, true, `${sub.type} end`);
    return sub;
  }
  function subroutineIndex(subroutine8) {
    return subroutine8.parent instanceof Program ? subroutine8.parent.allSubroutines.length + 1 : subroutineIndex(subroutine8.parent) + subroutine8.allSubroutines.length + 1;
  }
  function parameters4(lexemes, subroutine8) {
    const parameters7 = [];
    while (lexemes.get() && lexemes.get()?.content !== ")") {
      subroutine8.variables.push(...parameterSet(lexemes, subroutine8));
      if (lexemes.get() && lexemes.get()?.content === ";") {
        lexemes.next();
        if (lexemes.get()?.content === ")") {
          throw new CompilerError("Trailing semicolon at end of parameter list.", lexemes.get());
        }
      } else if (lexemes.get()?.type === "identifier") {
        throw new CompilerError("Semicolon missing between parameters.", lexemes.get());
      }
    }
    if (lexemes.get()?.content !== ")") {
      throw new CompilerError(`Closing bracket missing after ${subroutine8.type} parameters.`, lexemes.get(-1));
    }
    lexemes.next();
    return parameters7;
  }
  function parameterSet(lexemes, subroutine8) {
    const parameters7 = [];
    let isReferenceParameter = false;
    if (lexemes.get()?.content === "var") {
      isReferenceParameter = true;
      lexemes.next();
    }
    while (lexemes.get() && lexemes.get()?.content !== ":") {
      const name = identifier5(lexemes, subroutine8);
      parameters7.push(new Variable(name, subroutine8));
      if (lexemes.get()?.content === ",") {
        lexemes.next();
      } else if (lexemes.get()?.type === "identifier") {
        throw new CompilerError("Comma missing between parameter names.", lexemes.get());
      }
    }
    const [parameterType, stringLength, arrayDimensions] = type5(lexemes, subroutine8, true);
    for (const foo of parameters7) {
      foo.type = parameterType;
      foo.stringLength = stringLength;
      foo.arrayDimensions = arrayDimensions;
      foo.isParameter = true;
      foo.isReferenceParameter = isReferenceParameter;
    }
    return parameters7;
  }

  // client/parser/pascal/parser.ts
  function pascal(lexemes) {
    const program3 = new Program("Pascal");
    const programLexeme = lexemes.get();
    if (!programLexeme || programLexeme.type !== "keyword" || programLexeme.subtype !== "program") {
      throw new CompilerError('Program must begin with keyword "PROGRAM".', lexemes.get());
    }
    lexemes.next();
    program3.name = identifier5(lexemes, program3);
    semicolon(lexemes, true, "program declaration");
    let begun = false;
    while (lexemes.get() && lexemes.get()?.content.toLowerCase() !== "end") {
      const lexeme = lexemes.get();
      switch (lexeme.type) {
        case "keyword":
          switch (lexeme.subtype) {
            case "const": {
              if (program3.variables.length > 0) {
                throw new CompilerError("Constant definitions must be placed above any variable declarations.", lexemes.get());
              }
              if (program3.subroutines.length > 0) {
                throw new CompilerError("Constant definitions must be placed above any subroutine definitions.", lexemes.get());
              }
              lexemes.next();
              const constantsSoFar = program3.constants.length;
              while (lexemes.get()?.type === "identifier") {
                program3.constants.push(constant5(lexemes, program3));
              }
              if (program3.constants.length === constantsSoFar) {
                throw new CompilerError('"CONST" must be followed by an identifier.', lexemes.get(-1));
              }
              break;
            }
            case "var":
              if (program3.subroutines.length > 0) {
                throw new CompilerError("Variable declarations must be placed above any subroutine definitions.", lexemes.get());
              }
              lexemes.next();
              program3.variables.push(...variables2(lexemes, program3));
              break;
            case "procedure":
            case "function":
              lexemes.next();
              program3.subroutines.push(subroutine5(lexeme, lexemes, program3));
              break;
            case "begin":
              begun = true;
              lexemes.next();
              while (lexemes.get() && lexemes.get()?.content?.toLowerCase() !== "end") {
                const lexeme2 = lexemes.get();
                program3.statements.push(statement4(lexeme2, lexemes, program3));
              }
              break;
            default:
              if (!begun) {
                throw new CompilerError('Keyword "begin" missing for main program.', lexemes.get());
              }
              throw new CompilerError("{lex} makes no sense here.", lexemes.get());
          }
          break;
        default:
          if (!begun) {
            throw new CompilerError('Keyword "begin" missing for main program.', lexemes.get());
          }
          throw new CompilerError("{lex} makes no sense here.", lexemes.get());
      }
    }
    if (!begun) {
      throw new CompilerError('Keyword "begin" missing for main program.', lexemes.get(-1));
    }
    if (!lexemes.get()) {
      throw new CompilerError('Keyword "end" missing after main program.', lexemes.get(-1));
    }
    lexemes.next();
    if (!lexemes.get() || lexemes.get()?.content !== ".") {
      throw new CompilerError('Full stop missing after program "end".', lexemes.get(-1));
    }
    if (lexemes.get(1)) {
      throw new CompilerError('No text can appear after program "end".', lexemes.get(1));
    }
    return program3;
  }

  // client/parser/python/identifier.ts
  function identifier6(lexemes, routine, duplicateCheck) {
    const identifier8 = lexemes.get();
    if (!identifier8) {
      throw new CompilerError("{lex} must be followed by an identifier.", lexemes.get(-1));
    }
    if (identifier8.type !== "identifier") {
      throw new CompilerError("{lex} is not a valid identifier.", identifier8);
    }
    if (duplicateCheck) {
      if (identifier8.subtype === "turtle") {
        throw new CompilerError("{lex} is already the name of a Turtle attribute.", identifier8);
      }
      if (isDuplicate(routine, identifier8.value)) {
        throw new CompilerError("{lex} is already the name of a variable or subroutine in the current scope.", identifier8);
      }
    }
    lexemes.next();
    return identifier8.value;
  }

  // client/parser/python/type.ts
  function type6(lexemes, routine) {
    const lexeme = lexemes.get();
    let stringLength = 32;
    if (!lexeme) {
      throw new CompilerError("Expecting type specification.", lexemes.get(-1));
    }
    switch (lexeme.content) {
      case "bool":
        lexemes.next();
        return [false, "boolean", stringLength, []];
      case "int":
        lexemes.next();
        return [false, "integer", stringLength, []];
      case "str":
        lexemes.next();
        if (lexemes.get()?.content === "[") {
          lexemes.next();
          const integer = lexemes.get();
          if (!integer) {
            throw new CompilerError("Expected string size specification.", lexemes.get(-1));
          }
          if (integer.type !== "literal" || integer.subtype !== "integer") {
            throw new CompilerError("String size must be an integer.", integer);
          }
          if (integer.value <= 0) {
            throw new CompilerError("String size must be greater than zero.", integer);
          }
          stringLength = integer.value;
          lexemes.next();
          if (!lexemes.get()) {
            throw new CompilerError('Closing bracket "]" missing after string size specification.', lexemes.get(-1));
          }
          if (lexemes.get()?.content !== "]") {
            throw new CompilerError('Closing bracket "]" missing after string size specification.', lexemes.get());
          }
          lexemes.next();
        }
        return [false, "string", stringLength, []];
      case "final":
        throw new CompilerError('"Final" must be written with a capital "F".', lexeme);
      case "Final":
        lexemes.next();
        return [true, "boolint", stringLength, []];
      case "list":
        throw new CompilerError('"List" must be written with a capital "L".', lexeme);
      case "List": {
        lexemes.next();
        if (!lexemes.get()) {
          throw new CompilerError('"List" must be followed by a type in square brackets.', lexeme);
        }
        if (lexemes.get()?.content !== "[") {
          throw new CompilerError('"List" must be followed by a type in square brackets.', lexemes.get());
        }
        lexemes.next();
        const arrayType = type6(lexemes, routine);
        if (arrayType[0]) {
          throw new CompilerError("List type cannot be constant.", lexemes.get());
        }
        if (!lexemes.get()) {
          throw new CompilerError("List type must be followed by a length specification.", lexemes.get(-1));
        }
        if (lexemes.get()?.content !== ",") {
          throw new CompilerError("List type must be followed by a comma, then a length specification.", lexemes.get());
        }
        lexemes.next();
        const exp = expression(lexemes, routine);
        typeCheck(exp, "integer");
        const value = evaluate(exp, "Python", "array");
        if (typeof value === "string") {
          throw new CompilerError("List length must be an integer.", exp.lexeme);
        }
        if (value <= 0) {
          throw new CompilerError("List length must be positive.", exp.lexeme);
        }
        arrayType[3].push([0, value - 1]);
        if (!lexemes.get()) {
          throw new CompilerError("List type must be followed by closing square brackets.", lexemes.get(-1));
        }
        if (lexemes.get()?.content !== "]") {
          throw new CompilerError("List type must be followed by closing square brackets.", lexemes.get());
        }
        lexemes.next();
        return arrayType;
      }
      default:
        throw new CompilerError('{lex} is not a valid type specification (expected "bool", "int", or "str")', lexemes.get());
    }
  }

  // client/parser/python/variable.ts
  function variable5(lexemes, routine) {
    const name = identifier6(lexemes, routine, true);
    if (lexemes.get() && lexemes.get()?.content === ":") {
      lexemes.next();
      const [isConstant, variableType, stringLength, arrayDimensions] = type6(lexemes, routine);
      if (isConstant) {
        return new Constant("Python", name, 0);
      }
      const variable7 = new Variable(name, routine);
      variable7.type = variableType;
      variable7.typeIsCertain = true;
      variable7.stringLength = stringLength;
      variable7.arrayDimensions = arrayDimensions;
      return variable7;
    }
    return new Variable(name, routine);
  }

  // client/parser/python/subroutine.ts
  function subroutine6(lexeme, lexemes, parent, baseIndent) {
    const name = identifier6(lexemes, parent, true);
    const program3 = parent instanceof Program ? parent : parent.program;
    const subroutine8 = new Subroutine(lexeme, parent, name);
    subroutine8.index = program3.allSubroutines.length + 1;
    subroutine8.variables.push(...parameters5(lexemes, subroutine8));
    if (lexemes.get()?.content === "->") {
      lexemes.next();
      const [isConstant, returnType, stringLength, arrayDimensions] = type6(lexemes, parent);
      if (isConstant) {
        throw new CompilerError("Functions cannot return constant values.", lexemes.get());
      }
      if (arrayDimensions.length > 0) {
        throw new CompilerError("Functions cannot return arrays.", lexemes.get(-1));
      }
      const variable7 = new Variable("!result", subroutine8);
      variable7.type = returnType;
      variable7.typeIsCertain = true;
      variable7.stringLength = stringLength;
      subroutine8.variables.unshift(variable7);
      subroutine8.typeIsCertain = true;
    }
    if (!lexemes.get()) {
      throw new CompilerError('Subroutine declaration must be followed by a colon ":".', lexemes.get(-1));
    }
    if (lexemes.get()?.content !== ":") {
      throw new CompilerError('Subroutine declaration must be followed by a colon ":".', lexemes.get());
    }
    lexemes.next();
    if (!lexemes.get()) {
      throw new CompilerError("No statements found after subroutine definition.", lexemes.get(-1));
    }
    if (lexemes.get()?.type !== "newline") {
      throw new CompilerError("Subroutine definition must be followed by a line break.", lexemes.get());
    }
    lexemes.next();
    if (!lexemes.get()) {
      throw new CompilerError("No statements found after subroutine definition.", lexemes.get(-1));
    }
    if (lexemes.get()?.type !== "indent") {
      throw new CompilerError("Indent needed after subroutine definition.", lexemes.get());
    }
    subroutine8.indent = baseIndent + 1;
    lexemes.next();
    subroutine8.start = lexemes.index;
    let indents = 0;
    while (lexemes.get() && indents >= 0) {
      if (lexemes.get()?.type === "indent") {
        indents += 1;
      } else if (lexemes.get()?.type === "dedent") {
        indents -= 1;
      }
      lexemes.next();
    }
    subroutine8.end = lexemes.index - 1;
    return subroutine8;
  }
  function parameters5(lexemes, routine) {
    if (!lexemes.get()) {
      throw new CompilerError('Opening bracket "(" missing after function name.', lexemes.get(-1));
    }
    if (lexemes.get()?.content !== "(") {
      throw new CompilerError('Opening bracket "(" missing after function name.', lexemes.get());
    }
    lexemes.next();
    const parameters7 = [];
    while (lexemes.get()?.content !== ")") {
      const parameter = variable5(lexemes, routine);
      if (parameter instanceof Constant) {
        throw new CompilerError("Subroutine parameters cannot be constants.", lexemes.get(-1));
      }
      parameter.isParameter = true;
      parameters7.push(parameter);
      if (lexemes.get()?.content === ",") {
        lexemes.next();
      }
    }
    if (lexemes.get()?.content !== ")") {
      throw new CompilerError("Closing bracket missing after function parameters.", lexemes.get(-1));
    }
    lexemes.next();
    return parameters7;
  }

  // client/parser/python/identifiers.ts
  function identifiers(lexemes, routine, context2) {
    const names = [];
    const name = identifier6(lexemes, routine, false);
    names.push(name);
    if (lexemes.get()?.content === ",") {
      lexemes.next();
      names.push(...identifiers(lexemes, routine, context2));
    } else if (lexemes.get()?.type === "identifier") {
      throw new CompilerError(`Comma missing between ${context2} variable declarations.`, lexemes.get(-1));
    }
    return names;
  }

  // client/parser/python/statement.ts
  function eosCheck4(lexemes) {
    if (lexemes.get()) {
      if (lexemes.get()?.content === ";") {
        lexemes.next();
        while (lexemes.get()?.type === "newline") {
          lexemes.next();
        }
      } else if (lexemes.get()?.type === "newline") {
        while (lexemes.get()?.type === "newline") {
          lexemes.next();
        }
      } else {
        throw new CompilerError("Statement must be separated by a semicolon or placed on a new line.", lexemes.get());
      }
    }
  }
  function statement5(lexeme, lexemes, routine) {
    let statement8;
    switch (lexeme.type) {
      case "newline":
        lexemes.next();
        statement8 = new PassStatement();
        break;
      case "identifier": {
        const foo = variable(routine, lexemes.get()?.content);
        const bar = command(routine, lexemes.get()?.content);
        if (foo) {
          lexemes.next();
          statement8 = variableAssignment5(lexeme, lexemes, routine, foo);
        } else if (bar) {
          lexemes.next();
          statement8 = procedureCall(lexeme, lexemes, routine, bar);
        } else {
          statement8 = variableDeclaration(lexeme, lexemes, routine);
        }
        eosCheck4(lexemes);
        break;
      }
      case "keyword":
        switch (lexeme.subtype) {
          case "def": {
            const sub = subroutine(routine, lexemes.get(1)?.content);
            lexemes.index = sub.end + 1;
            statement8 = new PassStatement();
            break;
          }
          case "global":
          case "nonlocal":
            lexemes.next();
            if (routine instanceof Program) {
              throw new CompilerError("{lex} statements can only occur inside a subroutine.", lexemes.get(-1));
            }
            if (lexemes.get(-1)?.content === "global") {
              routine.globals.push(...identifiers(lexemes, routine, "global"));
            } else {
              routine.nonlocals.push(...identifiers(lexemes, routine, "nonlocal"));
            }
            statement8 = new PassStatement();
            eosCheck4(lexemes);
            break;
          case "return":
            lexemes.next();
            statement8 = returnStatement4(lexeme, lexemes, routine);
            break;
          case "if":
            lexemes.next();
            statement8 = ifStatement5(lexeme, lexemes, routine);
            break;
          case "else":
            throw new CompilerError('Statement cannot begin with "else". If you have an "if" above, this line may need to be indented more.', lexemes.get());
          case "for":
            lexemes.next();
            statement8 = forStatement5(lexeme, lexemes, routine);
            break;
          case "while":
            lexemes.next();
            statement8 = whileStatement5(lexeme, lexemes, routine);
            break;
          case "pass":
            lexemes.next();
            eosCheck4(lexemes);
            statement8 = new PassStatement();
            break;
          default:
            throw new CompilerError("Statement cannot begin with {lex}.", lexeme);
        }
        break;
      case "indent":
        throw new CompilerError("Statement cannot be indented.", lexeme);
      default:
        throw new CompilerError("Statement cannot begin with {lex}.", lexeme);
    }
    return statement8;
  }
  function variableAssignment5(variableLexeme, lexemes, routine, variable7) {
    const indexes = [];
    if (lexemes.get()?.content === "[") {
      if (variable7.isArray) {
        lexemes.next();
        while (lexemes.get() && lexemes.get()?.content !== "]") {
          let exp = expression(lexemes, routine);
          exp = typeCheck(exp, variable7);
          indexes.push(exp);
          if (lexemes.get()?.content === "]" && lexemes.get(1)?.content === "[") {
            lexemes.next();
            lexemes.next();
          }
        }
        if (!lexemes.get()) {
          throw new CompilerError('Closing bracket "]" needed after array indexes.', lexemes.get(-1));
        }
        lexemes.next();
      } else if (variable7.type === "string") {
        lexemes.next();
        let exp = expression(lexemes, routine);
        exp = typeCheck(exp, variable7);
        indexes.push(exp);
        if (!lexemes.get() || lexemes.get()?.content !== "]") {
          throw new CompilerError('Closing bracket "]" missing after string variable index.', exp.lexeme);
        }
        lexemes.next();
      } else {
        throw new CompilerError("{lex} is not a string or array variable.", variableLexeme);
      }
    }
    if (variable7.isArray) {
      const allowedIndexes = variable7.type === "string" ? variable7.arrayDimensions.length + 1 : variable7.arrayDimensions.length;
      if (indexes.length > allowedIndexes) {
        throw new CompilerError("Too many indexes for array variable {lex}.", variableLexeme);
      }
    }
    const assignmentLexeme = lexemes.get();
    if (!assignmentLexeme) {
      throw new CompilerError('Variable must be followed by assignment operator "=".', lexemes.get(-1));
    }
    if (assignmentLexeme.content === ":") {
      if (variable7.turtle) {
        throw new CompilerError("{lex} is the name of a predefined Turtle attribute, and cannot be given a type hit.", lexemes.get(-1));
      }
      throw new CompilerError("Type of variable {lex} has already been given.", lexemes.get(-1));
    }
    if (assignmentLexeme.content === "[") {
      throw new CompilerError("{lex} is not a string or list variable.", lexemes.get(-1));
    }
    if (assignmentLexeme.type !== "operator" || assignmentLexeme.subtype !== "asgn") {
      throw new CompilerError('Variable must be followed by assignment operator "=".', lexemes.get());
    }
    lexemes.next();
    if (!lexemes.get()) {
      throw new CompilerError(`Variable "${variable7.name}" must be assigned a value.`, lexemes.get(-1));
    }
    let value = expression(lexemes, routine);
    const variableValue2 = new VariableValue(variableLexeme, variable7);
    variableValue2.indexes.push(...indexes);
    value = typeCheck(value, variable7);
    return new VariableAssignment(assignmentLexeme, variable7, indexes, value);
  }
  function variableDeclaration(variableLexeme, lexemes, routine) {
    const foo = variable5(lexemes, routine);
    if (foo instanceof Constant) {
      if (!lexemes.get()) {
        throw new CompilerError("Constant must be assigned a value.", lexemes.get(-1));
      }
      if (lexemes.get()?.content !== "=") {
        throw new CompilerError("Constant must be assigned a value.", lexemes.get());
      }
      lexemes.next();
      const exp = expression(lexemes, routine);
      foo.value = evaluate(exp, "Python", "constant");
      routine.constants.push(foo);
      return new PassStatement();
    }
    routine.variables.push(foo);
    if (lexemes.get()?.content === "=") {
      return variableAssignment5(variableLexeme, lexemes, routine, foo);
    }
    return new PassStatement();
  }
  function returnStatement4(returnLexeme, lexemes, routine) {
    if (routine instanceof Program) {
      throw new CompilerError("Programs cannot return a value.", lexemes.get());
    }
    let value = expression(lexemes, routine);
    if (routine.returns !== null) {
      value = typeCheck(value, routine.returns);
    } else {
      const result = new Variable("!result", routine);
      result.type = value.type;
      result.typeIsCertain = true;
      routine.typeIsCertain = true;
      routine.variables.unshift(result);
    }
    eosCheck4(lexemes);
    routine.hasReturnStatement = true;
    return new ReturnStatement(returnLexeme, routine, value);
  }
  function ifStatement5(ifLexeme, lexemes, routine) {
    if (!lexemes.get()) {
      throw new CompilerError('"if" must be followed by a Boolean expression.', ifLexeme);
    }
    let condition = expression(lexemes, routine);
    condition = typeCheck(condition, "boolean");
    if (!lexemes.get()) {
      throw new CompilerError('"if <expression>" must be followed by a colon.', condition.lexeme);
    }
    lexemes.next();
    if (!lexemes.get()) {
      throw new CompilerError('No statements found after "if <expression>:".', lexemes.get(-1));
    }
    if (lexemes.get()?.type !== "newline") {
      throw new CompilerError('Statements following "if <expression>:" must be on a new line.', lexemes.get());
    }
    lexemes.next();
    const ifStatement8 = new IfStatement(ifLexeme, condition);
    if (!lexemes.get()) {
      throw new CompilerError('No statements found after "if <expression>:".', lexemes.get(-1));
    }
    if (lexemes.get()?.type !== "indent") {
      throw new CompilerError('Statements following "if <expression>:" must be indented.', lexemes.get());
    }
    lexemes.next();
    if (!lexemes.get()) {
      throw new CompilerError('No statements found after "if <expression>:".', lexemes.get(-1));
    }
    ifStatement8.ifStatements.push(...block5(lexemes, routine));
    if (lexemes.get() && lexemes.get()?.content === "else") {
      lexemes.next();
      if (!lexemes.get()) {
        throw new CompilerError('"else" must be followed by a colon.', lexemes.get(-1));
      }
      if (lexemes.get()?.content !== ":") {
        throw new CompilerError('"else" must be followed by a colon.', lexemes.get());
      }
      lexemes.next();
      if (!lexemes.get()) {
        throw new CompilerError('No statements found after "else:".', lexemes.get(-1));
      }
      if (lexemes.get()?.type !== "newline") {
        throw new CompilerError('Statements following "else:" must be on a new line.', lexemes.get());
      }
      lexemes.next();
      if (!lexemes.get()) {
        throw new CompilerError('No statements found after "else:".', lexemes.get(-1));
      }
      if (lexemes.get()?.type !== "indent") {
        throw new CompilerError('Statements following "else:" must be indented.', lexemes.get());
      }
      lexemes.next();
      if (!lexemes.get()) {
        throw new CompilerError('No statements found after "else:".', lexemes.get(-1));
      }
      ifStatement8.elseStatements.push(...block5(lexemes, routine));
    }
    return ifStatement8;
  }
  function forStatement5(forLexeme, lexemes, routine) {
    const variableLexeme = lexemes.get();
    if (!variableLexeme) {
      throw new CompilerError('"for" must be followed by an integer variable.', lexemes.get(-1));
    }
    if (variableLexeme.type !== "identifier") {
      throw new CompilerError("{lex} is not a valid variable name.", lexemes.get());
    }
    let variable7 = variable(routine, lexemes.get()?.content);
    if (!variable7) {
      variable7 = new Variable(lexemes.get()?.content, routine);
      variable7.type = "integer";
      variable7.typeIsCertain = true;
      routine.variables.push(variable7);
    }
    if (!variable7.typeIsCertain) {
      variable7.type = "integer";
      variable7.typeIsCertain = true;
    }
    if (variable7.type !== "integer") {
      throw new CompilerError("Loop variable must be an integer.", lexemes.get());
    }
    lexemes.next();
    if (!lexemes.get()) {
      throw new CompilerError('"for <variable>" must be followed by "in".', lexemes.get(-1));
    }
    if (lexemes.get()?.content !== "in") {
      throw new CompilerError('"for <variable>" must be followed by "in".', lexemes.get());
    }
    lexemes.next();
    if (!lexemes.get()) {
      throw new CompilerError('"for <variable> in" must be followed by a range specification.', lexemes.get(-1));
    }
    if (lexemes.get()?.content !== "range") {
      throw new CompilerError('"for <variable> in" must be followed by a range specification.', lexemes.get());
    }
    lexemes.next();
    if (!lexemes.get()) {
      throw new CompilerError('"range" must be followed by an opening bracket.', lexemes.get(-1));
    }
    if (lexemes.get()?.content !== "(") {
      throw new CompilerError('"range" must be followed by an opening bracket.', lexemes.get());
    }
    lexemes.next();
    if (!lexemes.get()) {
      throw new CompilerError('Missing first argument to the "range" function.', lexemes.get(-1));
    }
    const providedValues = [typeCheck(expression(lexemes, routine), "integer")];
    if (!lexemes.get()) {
      throw new CompilerError("Argument must be followed by a comma.", lexemes.get(-1));
    }
    if (lexemes.get()?.content !== ")" && lexemes.get()?.content !== ",") {
      throw new CompilerError("Argument must be followed by a comma or a closing bracket.", lexemes.get());
    }
    if (lexemes.get()?.content === ",") {
      lexemes.next();
      if (!lexemes.get()) {
        throw new CompilerError('Too few arguments for "range" function.', lexemes.get(-1));
      }
      providedValues.push(typeCheck(expression(lexemes, routine), "integer"));
    }
    if (!lexemes.get()) {
      throw new CompilerError("Argument must be followed by a comma.", lexemes.get(-1));
    }
    if (lexemes.get()?.content !== ")" && lexemes.get()?.content !== ",") {
      throw new CompilerError("Argument must be followed by a comma or a closing bracket.", lexemes.get());
    }
    if (lexemes.get()?.content === ",") {
      lexemes.next();
      if (!lexemes.get()) {
        throw new CompilerError('Too few arguments for "range" function.', lexemes.get(-1));
      }
      providedValues.push(typeCheck(expression(lexemes, routine), "integer"));
    }
    let initialisation;
    let condition;
    let change;
    const zeroToken = new Token("decimal", "0", forLexeme.line, -1);
    const zeroLexeme = new IntegerLexeme(zeroToken, 10);
    const zero2 = new IntegerValue(zeroLexeme);
    const oneToken = new Token("decimal", "1", forLexeme.line, -1);
    const oneLexeme = new IntegerLexeme(oneToken, 10);
    const one = new IntegerValue(oneLexeme);
    const assignmentToken = new Token("operator", "=", forLexeme.line, -1);
    const assignmentLexeme = new OperatorLexeme(assignmentToken, "Python");
    const left = new VariableValue(variableLexeme, variable7);
    const plusToken = new Token("operator", "+", forLexeme.line, -1);
    const lessToken = new Token("operator", "<", forLexeme.line, -1);
    const moreToken = new Token("operator", ">", forLexeme.line, -1);
    const plusLexeme = new OperatorLexeme(plusToken, "Python");
    const lessLexeme = new OperatorLexeme(lessToken, "Python");
    const moreLexeme = new OperatorLexeme(moreToken, "Python");
    switch (providedValues.length) {
      case 1:
        initialisation = new VariableAssignment(assignmentLexeme, variable7, [], zero2);
        change = new VariableAssignment(assignmentLexeme, variable7, [], new CompoundExpression(plusLexeme, left, one, "plus"));
        condition = new CompoundExpression(lessLexeme, left, providedValues[0], "less");
        break;
      case 2:
        initialisation = new VariableAssignment(assignmentLexeme, variable7, [], providedValues[0]);
        change = new VariableAssignment(assignmentLexeme, variable7, [], new CompoundExpression(plusLexeme, left, one, "plus"));
        condition = new CompoundExpression(lessLexeme, left, providedValues[1], "less");
        break;
      case 3: {
        initialisation = new VariableAssignment(assignmentLexeme, variable7, [], providedValues[0]);
        const stepValue = evaluate(providedValues[2], "Python", "step");
        change = new VariableAssignment(assignmentLexeme, variable7, [], new CompoundExpression(plusLexeme, left, providedValues[2], "plus"));
        condition = stepValue < 0 ? new CompoundExpression(moreLexeme, left, providedValues[1], "more") : new CompoundExpression(lessLexeme, left, providedValues[1], "less");
        break;
      }
    }
    if (!lexemes.get()) {
      throw new CompilerError('Closing bracket needed after "range" function arguments.', lexemes.get(-1));
    }
    if (lexemes.get()?.content === ",") {
      throw new CompilerError('Too many arguments for "range" function.', lexemes.get());
    }
    if (lexemes.get()?.content !== ")") {
      throw new CompilerError('Closing bracket needed after "range" function arguments.', lexemes.get());
    }
    lexemes.next();
    if (!lexemes.get()) {
      throw new CompilerError('"for <variable> in range(...)" must be followed by a colon.', lexemes.get(-1));
    }
    if (lexemes.get()?.content !== ":") {
      throw new CompilerError('"for <variable> in range(...)" must be followed by a colon.', lexemes.get());
    }
    lexemes.next();
    if (!lexemes.get()) {
      throw new CompilerError('No statements found after "for <variable> in range(...):".', lexemes.get(-1));
    }
    if (lexemes.get()?.type !== "newline") {
      throw new CompilerError('Statements following "for <variable> in range(...):" must be on a new line.', lexemes.get());
    }
    lexemes.next();
    const forStatement8 = new ForStatement(forLexeme, initialisation, condition, change);
    if (!lexemes.get()) {
      throw new CompilerError('No statements found after "for <variable> in range(...):".', lexemes.get(-1));
    }
    if (lexemes.get()?.type !== "indent") {
      throw new CompilerError('Statements following "for <variable> in range(...):" must be indented.', lexemes.get());
    }
    lexemes.next();
    if (!lexemes.get()) {
      throw new CompilerError('No statements found after "for <variable> in range(...):', lexemes.get(-1));
    }
    forStatement8.statements.push(...block5(lexemes, routine));
    return forStatement8;
  }
  function whileStatement5(whileLexeme, lexemes, routine) {
    if (!lexemes.get()) {
      throw new CompilerError('"while" must be followed by a Boolean expression.', whileLexeme);
    }
    let condition = expression(lexemes, routine);
    condition = typeCheck(condition, "boolean");
    if (!lexemes.get()) {
      throw new CompilerError('"while <expression>" must be followed by a colon.', lexemes.get(-1));
    }
    if (lexemes.get()?.content !== ":") {
      throw new CompilerError('"while <expression>" must be followed by a colon.', lexemes.get());
    }
    lexemes.next();
    if (!lexemes.get()) {
      throw new CompilerError('No statements found after "while <expression>:".', lexemes.get(-1));
    }
    if (lexemes.get()?.type !== "newline") {
      throw new CompilerError('Statements following "while <expression>:" must be on a new line.', lexemes.get());
    }
    lexemes.next();
    const whileStatement8 = new WhileStatement(whileLexeme, condition);
    if (!lexemes.get()) {
      throw new CompilerError('No statements found after "while <expression>:".', lexemes.get(-1));
    }
    if (lexemes.get()?.type !== "indent") {
      throw new CompilerError('Statements following "while <expression>:" must be indented.', lexemes.get());
    }
    lexemes.next();
    if (!lexemes.get()) {
      throw new CompilerError('No statements found after "while <expression>:".', lexemes.get(-1));
    }
    whileStatement8.statements.push(...block5(lexemes, routine));
    return whileStatement8;
  }
  function block5(lexemes, routine) {
    const statements = [];
    while (lexemes.get() && lexemes.get()?.type !== "dedent") {
      statements.push(statement5(lexemes.get(), lexemes, routine));
    }
    if (lexemes.get()) {
      lexemes.next();
    }
    return statements;
  }

  // client/parser/python/parser.ts
  function python(lexemes) {
    const program3 = new Program("Python");
    program3.end = lexemes.lexemes.length;
    parseBody(lexemes, program3);
    checkForUncertainTypes(program3);
    return program3;
  }
  function parseBody(lexemes, routine) {
    let indents = 0;
    lexemes.index = routine.start;
    while (lexemes.index < routine.end) {
      const lexeme = lexemes.get();
      lexemes.next();
      switch (lexeme.type) {
        case "indent":
          indents += 1;
          break;
        case "dedent":
          indents -= 1;
          break;
        case "keyword":
          if (lexeme.subtype === "def") {
            routine.subroutines.push(subroutine6(lexeme, lexemes, routine, indents));
          }
          break;
      }
    }
    lexemes.index = routine.start;
    while (lexemes.index < routine.end) {
      routine.statements.push(statement5(lexemes.get(), lexemes, routine));
    }
    for (const sub of routine.subroutines) {
      parseBody(lexemes, sub);
    }
  }
  function checkForUncertainTypes(routine) {
    const untypedVariable = routine.variables.find((x) => !x.typeIsCertain);
    if (untypedVariable) {
      throw new CompilerError(`Could not infer the type of variable ${untypedVariable.name}.`);
    }
    routine.subroutines.forEach(checkForUncertainTypes);
  }

  // client/parser/typescript/identifier.ts
  function identifier7(lexemes, routine, duplicateCheck) {
    const identifier8 = lexemes.get();
    if (!identifier8) {
      throw new CompilerError("{lex} must be followed by an identifier.", lexemes.get(-1));
    }
    if (identifier8.type !== "identifier") {
      throw new CompilerError("{lex} is not a valid identifier.", identifier8);
    }
    if (identifier8.subtype === "turtle") {
      throw new CompilerError("{lex} is already the name of a predefined Turtle property.", identifier8);
    }
    if (duplicateCheck) {
      if (isDuplicate(routine, identifier8.value)) {
        throw new CompilerError("{lex} is already defined in the current scope.", identifier8);
      }
    }
    lexemes.next();
    return identifier8.value;
  }

  // client/parser/typescript/type.ts
  function type7(lexemes, routine) {
    if (!lexemes.get()) {
      throw new CompilerError('Expected type specification (": <type>").', lexemes.get(-1));
    }
    if (lexemes.get()?.content !== ":") {
      throw new CompilerError('Expected type specification (": <type>").', lexemes.get());
    }
    lexemes.next();
    const typeLexeme = lexemes.get();
    if (!typeLexeme) {
      throw new CompilerError('Expected type definition ("boolean", "number", "string", or "void").', lexemes.get(-1));
    }
    if (typeLexeme.type !== "type") {
      throw new CompilerError('{lex} is not a valid type definition (expected "boolean", "number", "string", or "void").', typeLexeme);
    }
    const type8 = typeLexeme.subtype;
    lexemes.next();
    let stringLength = 32;
    if (type8 === "string") {
      if (lexemes.get()?.content === "(") {
        lexemes.next();
        const integer = lexemes.get();
        if (!integer) {
          throw new CompilerError("Expected string size specification.", lexemes.get(-1));
        }
        if (integer.type !== "literal" || integer.subtype !== "integer") {
          throw new CompilerError("String size must be an integer.", integer);
        }
        if (integer.value <= 0) {
          throw new CompilerError("String size must be greater than zero.", lexemes.get());
        }
        stringLength = integer.value;
        lexemes.next();
        if (!lexemes.get()) {
          throw new CompilerError('Closing bracket ")" missing after string size specification.', lexemes.get(-1));
        }
        if (lexemes.get()?.content !== ")") {
          throw new CompilerError('Closing bracket ")" missing after string size specification.', lexemes.get());
        }
        lexemes.next();
      }
    }
    let arrayDimensions = [];
    while (lexemes.get()?.content === "[") {
      lexemes.next();
      if (!lexemes.get()) {
        throw new CompilerError('Opening bracket "[" must be followed by an array size.', lexemes.get(-1));
      }
      const exp = expression(lexemes, routine);
      typeCheck(exp, "integer");
      const value = evaluate(exp, "TypeScript", "array");
      if (typeof value === "string") {
        throw new CompilerError("Array size must be an integer.", lexemes.get());
      }
      if (value <= 0) {
        throw new CompilerError("Array size must be positive.", lexemes.get());
      }
      arrayDimensions.push([0, value - 1]);
      if (!lexemes.get()) {
        throw new CompilerError('Array size specification must be followed by closing bracket "]".', lexemes.get(-1));
      }
      if (lexemes.get()?.content !== "]") {
        throw new CompilerError('Array size specification must be followed by closing bracket "]".', lexemes.get());
      }
      lexemes.next();
    }
    if (type8 === null && arrayDimensions.length > 0) {
      throw new CompilerError("Array of void is not allowed.", typeLexeme);
    }
    return [type8, stringLength, arrayDimensions];
  }

  // client/parser/typescript/constant.ts
  function constant6(lexemes, routine, duplicateCheck) {
    const name = identifier7(lexemes, routine, duplicateCheck);
    const [constantType, , arrayDimensions] = type7(lexemes, routine);
    if (constantType === null) {
      throw new CompilerError('Constant type cannot be void (expected "boolean", "number", or "string").', lexemes.get());
    }
    if (arrayDimensions.length > 0) {
      throw new CompilerError("Constant cannot be an array.", lexemes.get());
    }
    if (!lexemes.get()) {
      throw new CompilerError(`Constant ${name} must be assigned a value.`, lexemes.get(-1));
    }
    if (lexemes.get()?.content !== "=") {
      throw new CompilerError(`Constant ${name} must be assigned a value.`, lexemes.get());
    }
    lexemes.next();
    const exp = expression(lexemes, routine);
    typeCheck(exp, constantType);
    const value = evaluate(exp, "TypeScript", "constant");
    return new Constant("TypeScript", name, value);
  }

  // client/parser/typescript/variable.ts
  function variable6(lexemes, routine, duplicateCheck) {
    const name = identifier7(lexemes, routine, duplicateCheck);
    const [variableType, stringLength, arrayDimensions] = type7(lexemes, routine);
    if (variableType === null) {
      throw new CompilerError('Variable cannot be void (expected "boolean", "number", or "string").', lexemes.get());
    }
    const variable7 = new Variable(name, routine);
    variable7.type = variableType;
    variable7.stringLength = stringLength;
    variable7.arrayDimensions = arrayDimensions;
    return variable7;
  }

  // client/parser/typescript/subroutine.ts
  function subroutine7(lexeme, lexemes, parent) {
    const name = identifier7(lexemes, parent, true);
    const subroutine8 = new Subroutine(lexeme, parent, name);
    const program3 = parent instanceof Program ? parent : parent.program;
    subroutine8.index = program3.allSubroutines.length + 1;
    subroutine8.variables.push(...parameters6(lexemes, subroutine8));
    const [subroutineType, stringLength, arrayDimensions] = type7(lexemes, parent);
    if (arrayDimensions.length > 0) {
      throw new CompilerError("Functions cannot return arrays.", lexemes.get(-1));
    }
    if (subroutineType !== null) {
      const variable7 = new Variable("!result", subroutine8);
      variable7.type = subroutineType;
      variable7.stringLength = stringLength;
      subroutine8.variables.unshift(variable7);
    }
    if (!lexemes.get()) {
      throw new CompilerError('Method parameters must be followed by an opening bracket "{".', lexemes.get(-1));
    }
    if (lexemes.get()?.content !== "{") {
      throw new CompilerError('Method parameters must be followed by an opening bracket "{".', lexemes.get());
    }
    lexemes.next();
    subroutine8.start = lexemes.index;
    let brackets2 = 0;
    while (lexemes.get() && brackets2 >= 0) {
      if (lexemes.get()?.content === "{") {
        brackets2 += 1;
      } else if (lexemes.get()?.content === "}") {
        brackets2 -= 1;
      }
      lexemes.next();
    }
    subroutine8.end = lexemes.index - 1;
    return subroutine8;
  }
  function parameters6(lexemes, subroutine8) {
    if (!lexemes.get()) {
      throw new CompilerError('Opening bracket "(" missing after function name.', lexemes.get(-1));
    }
    if (lexemes.get()?.content !== "(") {
      throw new CompilerError('Opening bracket "(" missing after function name.', lexemes.get());
    }
    lexemes.next();
    const parameters7 = [];
    while (lexemes.get()?.content !== ")") {
      const parameter = variable6(lexemes, subroutine8, true);
      parameter.isParameter = true;
      parameters7.push(parameter);
      if (lexemes.get()?.content === ",") {
        lexemes.next();
      }
    }
    if (lexemes.get()?.content !== ")") {
      throw new CompilerError("Closing bracket missing after function parameters.", lexemes.get(-1));
    }
    lexemes.next();
    return parameters7;
  }

  // client/parser/typescript/statement.ts
  function eosCheck5(lexemes) {
    if (lexemes.get()) {
      if (lexemes.get()?.content !== ";" && lexemes.get()?.type !== "newline") {
        throw new CompilerError("Statement must be followed by a semicolon or placed on a new line.", lexemes.get(-1));
      }
      while (lexemes.get()?.content === ";" || lexemes.get()?.type === "newline") {
        lexemes.next();
      }
    }
  }
  function statement6(lexeme, lexemes, routine) {
    let statement8;
    switch (lexeme.type) {
      case "newline":
        lexemes.next();
        statement8 = new PassStatement();
        break;
      case "identifier":
        statement8 = simpleStatement5(lexeme, lexemes, routine);
        eosCheck5(lexemes);
        break;
      case "keyword":
        switch (lexeme.subtype) {
          case "function":
            const sub = subroutine(routine, lexemes.get(1)?.content);
            lexemes.index = sub.end + 1;
            statement8 = new PassStatement();
            break;
          case "const":
          case "var":
            statement8 = simpleStatement5(lexeme, lexemes, routine);
            eosCheck5(lexemes);
            break;
          case "return":
            lexemes.next();
            statement8 = returnStatement5(lexeme, lexemes, routine);
            break;
          case "if":
            lexemes.next();
            statement8 = ifStatement6(lexeme, lexemes, routine);
            break;
          case "else":
            throw new CompilerError('Statement cannot begin with "else". If you have an "if" above, you may be missing a closing bracket "}".', lexeme);
          case "for":
            lexemes.next();
            statement8 = forStatement6(lexeme, lexemes, routine);
            break;
          case "do":
            lexemes.next();
            statement8 = doStatement3(lexeme, lexemes, routine);
            break;
          case "while":
            lexemes.next();
            statement8 = whileStatement6(lexeme, lexemes, routine);
            break;
          default:
            throw new CompilerError("Statement cannot begin with {lex}.", lexeme);
        }
        break;
      default:
        throw new CompilerError("Statement cannot begin with {lex}.", lexeme);
    }
    return statement8;
  }
  function simpleStatement5(lexeme, lexemes, routine) {
    switch (lexeme.type) {
      case "keyword":
        switch (lexeme.subtype) {
          case "const":
            lexemes.next();
            constant6(lexemes, routine, false);
            return new PassStatement();
          case "var":
            lexemes.next();
            const variableLexeme = lexemes.get();
            const foo2 = variable(routine, variableLexeme.content);
            variable6(lexemes, routine, false);
            if (lexemes.get()?.content === "=") {
              return variableAssignment6(variableLexeme, lexemes, routine, foo2);
            } else {
              return new PassStatement();
            }
          default:
            throw new CompilerError("Simple statement cannot begin with {lex}.", lexeme);
        }
      case "identifier":
        const foo = constant(routine, lexeme.value);
        const bar = variable(routine, lexeme.value);
        const baz = command(routine, lexeme.value);
        if (foo) {
          throw new CompilerError("{lex} is a constant and cannot be assined a new value.", lexeme);
        } else if (bar) {
          lexemes.next();
          return variableAssignment6(lexeme, lexemes, routine, bar);
        } else if (baz) {
          lexemes.next();
          const statement8 = procedureCall(lexeme, lexemes, routine, baz);
          return statement8;
        } else {
          throw new CompilerError("{lex} is not defined.", lexemes.get());
        }
    }
  }
  function variableAssignment6(variableLexeme, lexemes, routine, variable7) {
    const indexes = [];
    if (lexemes.get()?.content === "[") {
      if (variable7.isArray) {
        lexemes.next();
        while (lexemes.get() && lexemes.get()?.content !== "]") {
          let exp = expression(lexemes, routine);
          exp = typeCheck(exp, "integer");
          indexes.push(exp);
          if (lexemes.get()?.content === "]" && lexemes.get(1)?.content === "[") {
            lexemes.next();
            lexemes.next();
          }
        }
        if (!lexemes.get()) {
          throw new CompilerError('Closing bracket "]" needed after array indexes.', lexemes.get(-1));
        }
        lexemes.next();
      } else if (variable7.type === "string") {
        lexemes.next();
        let exp = expression(lexemes, routine);
        exp = typeCheck(exp, "integer");
        indexes.push(exp);
        if (!lexemes.get() || lexemes.get()?.content !== "]") {
          throw new CompilerError('Closing bracket "]" missing after string variable index.', exp.lexeme);
        }
        lexemes.next();
      } else {
        throw new CompilerError("{lex} is not a string or array variable.", variableLexeme);
      }
    }
    if (variable7.isArray) {
      const allowedIndexes = variable7.type === "string" ? variable7.arrayDimensions.length + 1 : variable7.arrayDimensions.length;
      if (indexes.length > allowedIndexes) {
        throw new CompilerError("Too many indexes for array variable {lex}.", variableLexeme);
      }
    }
    const assignmentOperator = lexemes.get();
    if (!assignmentOperator) {
      throw new CompilerError('Variable must be followed by assignment operator "=".', lexemes.get(-1));
    }
    if (assignmentOperator.content === ":") {
      throw new CompilerError("Type of variable {lex} has already been given.", assignmentOperator);
    }
    if (assignmentOperator.content === "[") {
      throw new CompilerError("{lex} is not a string or array variable.", assignmentOperator);
    }
    if (assignmentOperator.type !== "operator" || assignmentOperator.subtype !== "asgn") {
      throw new CompilerError('Variable must be followed by assignment operator "=".', assignmentOperator);
    }
    lexemes.next();
    if (!lexemes.get()) {
      throw new CompilerError(`Variable "${variable7.name}" must be assigned a value.`, lexemes.get(-1));
    }
    let value = expression(lexemes, routine);
    const variableValue2 = new VariableValue(variableLexeme, variable7);
    variableValue2.indexes.push(...indexes);
    value = typeCheck(value, variableValue2.type);
    return new VariableAssignment(assignmentOperator, variable7, indexes, value);
  }
  function returnStatement5(returnLexeme, lexemes, routine) {
    if (routine instanceof Program) {
      throw new CompilerError('"RETURN" statements are only valid within the body of a function.', lexemes.get());
    }
    if (routine.type !== "function") {
      throw new CompilerError("Procedures cannot return a value.", lexemes.get());
    }
    let value = expression(lexemes, routine);
    value = typeCheck(value, routine.returns);
    eosCheck5(lexemes);
    routine.hasReturnStatement = true;
    return new ReturnStatement(returnLexeme, routine, value);
  }
  function ifStatement6(ifLexeme, lexemes, routine) {
    if (!lexemes.get() || lexemes.get()?.content !== "(") {
      throw new CompilerError('"if" must be followed by an opening bracket "(".', lexemes.get(-1));
    }
    lexemes.next();
    if (!lexemes.get()) {
      throw new CompilerError('"if (" must be followed by a Boolean expression.', lexemes.get(-1));
    }
    let condition = expression(lexemes, routine);
    condition = typeCheck(condition, "boolean");
    if (!lexemes.get() || lexemes.get()?.content !== ")") {
      throw new CompilerError('"if (..." must be followed by a closing bracket ")".', lexemes.get(-1));
    }
    lexemes.next();
    const ifStatement8 = new IfStatement(ifLexeme, condition);
    if (!lexemes.get() || lexemes.get()?.content !== "{") {
      throw new CompilerError('"if (...)" must be followed by an opening curly bracket "{".', lexemes.get(-1));
    }
    lexemes.next();
    ifStatement8.ifStatements.push(...block6(lexemes, routine));
    if (lexemes.get() && lexemes.get()?.content === "else") {
      lexemes.next();
      if (!lexemes.get() || lexemes.get()?.content !== "{") {
        throw new CompilerError('"else" must be followed by an opening bracket "{".', lexemes.get(-1));
      }
      lexemes.next();
      ifStatement8.elseStatements.push(...block6(lexemes, routine));
    }
    return ifStatement8;
  }
  function forStatement6(forLexeme, lexemes, routine) {
    if (!lexemes.get() || lexemes.get()?.content !== "(") {
      throw new CompilerError('"for" must be followed by an opening bracket "(".', lexemes.get(-1));
    }
    lexemes.next();
    const firstInitialisationLexeme = lexemes.get();
    if (!firstInitialisationLexeme) {
      throw new CompilerError('"for" conditions must begin with a variable assignment.', lexemes.get(-1));
    }
    if (firstInitialisationLexeme.type !== "keyword" && firstInitialisationLexeme.type !== "identifier") {
      throw new CompilerError('"for" conditions must begin with a variable assignment.', firstInitialisationLexeme);
    }
    const initialisation = simpleStatement5(firstInitialisationLexeme, lexemes, routine);
    if (!(initialisation instanceof VariableAssignment)) {
      throw new CompilerError('"for" conditions must begin with a variable assignment.', lexemes.get(-1));
    }
    if (initialisation.variable.type !== "integer") {
      throw new CompilerError("Loop variable must be an integer.", lexemes.get());
    }
    if (!lexemes.get() || lexemes.get()?.content !== ";") {
      throw new CompilerError('"for (..." must be followed by a semicolon.', lexemes.get(-1));
    }
    lexemes.next();
    if (!lexemes.get()) {
      throw new CompilerError('"for (...; ...;" must be followed by a loop condition.', lexemes.get(-1));
    }
    let condition = expression(lexemes, routine);
    condition = typeCheck(condition, "boolean");
    if (!lexemes.get() || lexemes.get()?.content !== ";") {
      throw new CompilerError('"for (...; ..." must be followed by a semicolon.', lexemes.get(-1));
    }
    lexemes.next();
    const firstChangeLexeme = lexemes.get();
    if (!firstChangeLexeme) {
      throw new CompilerError('"for (...;" must be followed by a loop variable reassignment.', lexemes.get(-1));
    }
    if (firstChangeLexeme.type !== "keyword" && firstChangeLexeme.type !== "identifier") {
      throw new CompilerError('"for (...;" must be followed by a loop variable reassignment.', lexemes.get(-1));
    }
    const change = simpleStatement5(firstChangeLexeme, lexemes, routine);
    if (!(change instanceof VariableAssignment)) {
      throw new CompilerError('"for (...;" must be followed by a loop variable reassignment.', lexemes.get(-1));
    }
    if (change.variable !== initialisation.variable) {
      throw new CompilerError("Initial loop variable and change loop variable must be the same.", lexemes.get(-1));
    }
    if (!lexemes.get() || lexemes.get()?.content !== ")") {
      throw new CompilerError('"for (...; ...; ..." must be followed by a closing bracket ")".', lexemes.get(-1));
    }
    lexemes.next();
    if (!lexemes.get() || lexemes.get()?.content !== "{") {
      throw new CompilerError('"for (...; ...; ...)" must be followed by an opening bracket "{".', lexemes.get(-1));
    }
    lexemes.next();
    const forStatement8 = new ForStatement(forLexeme, initialisation, condition, change);
    forStatement8.statements.push(...block6(lexemes, routine));
    return forStatement8;
  }
  function doStatement3(doLexeme, lexemes, routine) {
    if (!lexemes.get() || lexemes.get()?.content !== "{") {
      throw new CompilerError('"do" must be followed by an opening bracket "{".', lexemes.get(-1));
    }
    lexemes.next();
    const repeatStatements = block6(lexemes, routine);
    if (!lexemes.get() || lexemes.get()?.content !== "while") {
      throw new CompilerError('"do { ... }" must be followed by "while".', lexemes.get(-1));
    }
    lexemes.next();
    if (!lexemes.get() || lexemes.get()?.content !== "(") {
      throw new CompilerError('"while" must be followed by an opening bracket "(".', lexemes.get(-1));
    }
    lexemes.next();
    if (!lexemes.get()) {
      throw new CompilerError('"while (" must be followed by a boolean expression.', lexemes.get(-1));
    }
    let condition = expression(lexemes, routine);
    condition = typeCheck(condition, "boolean");
    const notToken = new Token("operator", "!", condition.lexeme.line, condition.lexeme.character);
    const notLexeme = new OperatorLexeme(notToken, "TypeScript");
    condition = new CompoundExpression(notLexeme, null, condition, "not");
    if (!lexemes.get() || lexemes.get()?.content !== ")") {
      throw new CompilerError('"while (..." must be followed by a closing bracket ")".', lexemes.get(-1));
    }
    lexemes.next();
    eosCheck5(lexemes);
    const repeatStatement4 = new RepeatStatement(doLexeme, condition);
    repeatStatement4.statements.push(...repeatStatements);
    return repeatStatement4;
  }
  function whileStatement6(whileLexeme, lexemes, routine) {
    if (!lexemes.get() || lexemes.get()?.content !== "(") {
      throw new CompilerError('"while" must be followed by an opening bracket "(".', lexemes.get(-1));
    }
    lexemes.next();
    if (!lexemes.get()) {
      throw new CompilerError('"while (" must be followed by a Boolean expression.', lexemes.get(-1));
    }
    let condition = expression(lexemes, routine);
    condition = typeCheck(condition, "boolean");
    if (!lexemes.get() || lexemes.get()?.content !== ")") {
      throw new CompilerError('"while (..." must be followed by a closing bracket ")".', lexemes.get(-1));
    }
    lexemes.next();
    const whileStatement8 = new WhileStatement(whileLexeme, condition);
    if (!lexemes.get() || lexemes.get()?.content !== "{") {
      throw new CompilerError('"while (...)" must be followed by an opening curly bracket "{".', lexemes.get(-1));
    }
    lexemes.next();
    whileStatement8.statements.push(...block6(lexemes, routine));
    return whileStatement8;
  }
  function block6(lexemes, routine) {
    const statements = [];
    while (lexemes.get() && lexemes.get()?.content !== "}") {
      statements.push(statement6(lexemes.get(), lexemes, routine));
    }
    if (lexemes.get()?.content === "}") {
      lexemes.next();
    } else {
      throw new CompilerError('Closing bracket "}" missing after statement block.', lexemes.get(-1));
    }
    return statements;
  }

  // client/parser/typescript/parser.ts
  function typescript(lexemes) {
    const program3 = new Program("TypeScript");
    program3.end = lexemes.lexemes.length;
    parseBody2(lexemes, program3);
    return program3;
  }
  function parseBody2(lexemes, routine) {
    lexemes.index = routine.start;
    while (lexemes.index < routine.end) {
      const lexeme = lexemes.get();
      lexemes.next();
      switch (lexeme.type) {
        case "keyword":
          switch (lexeme.subtype) {
            case "const":
              routine.constants.push(constant6(lexemes, routine, true));
              eosCheck5(lexemes);
              break;
            case "var":
              routine.variables.push(variable6(lexemes, routine, true));
              break;
            case "function":
              routine.subroutines.push(subroutine7(lexeme, lexemes, routine));
              break;
          }
      }
    }
    lexemes.index = routine.start;
    while (lexemes.index < routine.end) {
      routine.statements.push(statement6(lexemes.get(), lexemes, routine));
    }
    for (const sub of routine.subroutines) {
      parseBody2(lexemes, sub);
    }
  }

  // client/parser/definitions/lexemes.ts
  var Lexemes = class {
    constructor(lexemes) {
      this.lexemes = lexemes.filter((x) => x.type !== "comment");
      this.index = 0;
    }
    get(offset = 0) {
      return this.lexemes[this.index + offset];
    }
    next() {
      this.index += 1;
    }
  };

  // client/parser/parser.ts
  function parser(code3, language2) {
    const rawLexemes = typeof code3 === "string" ? lexify(code3, language2) : code3;
    const lexemes = new Lexemes(rawLexemes);
    switch (language2) {
      case "BASIC":
        return basic(lexemes);
      case "C":
        return c(lexemes);
      case "Java":
        return java(lexemes);
      case "Pascal":
        return pascal(lexemes);
      case "Python":
        return python(lexemes);
      case "TypeScript":
        return typescript(lexemes);
    }
  }

  // client/constants/categories.ts
  var Category = class {
    constructor(index, title, expressions) {
      this.index = index;
      this.title = title;
      this.expressions = expressions[0] && expressions[0] instanceof Subroutine ? expressions : expressions.filter((x) => x.category === index);
    }
  };
  var commandCategories = [
    new Category(0, "Turtle: relative movement", commands),
    new Category(1, "Turtle: absolute movement", commands),
    new Category(2, "Turtle: drawing shapes", commands),
    new Category(3, "Other Turtle commands", commands),
    new Category(4, "Canvas operations", commands),
    new Category(5, "General arithmetic functions", commands),
    new Category(6, "Trig / exp / log functions", commands),
    new Category(7, "String operations", commands),
    new Category(8, "Type conversion routines", commands),
    new Category(9, "Input and timing routines", commands),
    new Category(10, "File processing", commands),
    new Category(11, "Turtle Machine monitoring", commands)
  ];
  var keywordCategories = {
    BASIC: [
      new Category(20, "Command structures", keywords.BASIC),
      new Category(21, "Variable scope modifiers", keywords.BASIC)
    ],
    C: [
      new Category(20, "Command structures", keywords.C)
    ],
    Java: [
      new Category(20, "Command structures", keywords.Java)
    ],
    Pascal: [
      new Category(20, "Command structures", keywords.Pascal)
    ],
    Python: [
      new Category(20, "Command structures", keywords.Python),
      new Category(21, "Variable scope modifiers", keywords.Python)
    ],
    TypeScript: [
      new Category(20, "Command structures", keywords.TypeScript)
    ]
  };

  // client/analyser/analyse.ts
  function analyse_default(lexemes, program3) {
    const categories = commandCategories.concat(keywordCategories[program3.language]);
    const usageCategories = categories.map(usageCategory.bind(null, program3.language, lexemes));
    const subroutineCategory = new Category(30, "Subroutine calls", program3.allSubroutines.slice(1));
    const subroutineUsageCategory = usageCategory(program3.language, lexemes, subroutineCategory);
    return usageCategories.concat(subroutineUsageCategory).filter((category) => category.expressions.length > 0);
  }
  function usageCategory(language2, lexemes, category) {
    const filtered = category.expressions.filter(isUsed.bind(null, language2, lexemes));
    const mapped = filtered.map(usageExpression.bind(null, language2, lexemes));
    mapped.sort((a2, b) => {
      return a2.level === b.level ? a2.name.localeCompare(b.name) : a2.level - b.level;
    });
    return {
      category: category.title,
      expressions: mapped,
      total: mapped.reduce((x, y) => x + y.count, 0)
    };
  }
  function isUsed(language2, lexemes, expression3) {
    const name = expression3 instanceof Command ? expression3.names[language2] : expression3.name;
    if (!name) {
      return false;
    }
    const uses = language2 === "Pascal" ? lexemes.filter((lexeme) => lexeme.content && lexeme.content.toLowerCase() === name.toLowerCase()) : lexemes.filter((lexeme) => lexeme.content === name);
    return uses.length > 0;
  }
  function usageExpression(language2, lexemes, expression3) {
    const name = expression3 instanceof Command ? expression3.names[language2] : expression3.name;
    const uses = language2 === "Pascal" ? lexemes.filter((lexeme) => lexeme.content && lexeme.content.toLowerCase() === name.toLowerCase()) : lexemes.filter((lexeme) => lexeme.content === name);
    uses.sort((a2, b) => a2.line - b.line);
    return {
      name: language2 === "Pascal" ? name.toLowerCase() : name,
      level: expression3.level + 1,
      count: uses.length,
      lines: uses.reduce((x, y) => `${x} ${y.line.toString(10)}`, "").trim()
    };
  }

  // client/encoder/options.ts
  var defaultOptions2 = {
    canvasStartSize: defaults.canvasStartSize,
    setupDefaultKeyBuffer: defaults.setupDefaultKeyBuffer,
    turtleAttributesAsGlobals: defaults.turtleAttributesAsGlobals,
    initialiseLocals: defaults.initialiseLocals,
    allowCSTR: defaults.allowCSTR,
    separateReturnStack: defaults.separateReturnStack,
    separateMemoryControlStack: defaults.separateMemoryControlStack,
    separateSubroutineRegisterStack: defaults.separateSubroutineRegisterStack
  };

  // client/encoder/expression.ts
  function merge(pcode1, pcode2) {
    if (pcode1.length === 0) {
      pcode1.push(...pcode2);
    } else {
      const last1 = pcode1[pcode1.length - 1];
      const first2 = pcode2.shift();
      if (first2)
        last1.push(...first2);
      pcode1.push(...pcode2);
    }
  }
  function expression2(exp, program3, options2, reference = false) {
    switch (exp.expressionType) {
      case "integer":
        return [literalIntegerValue(exp, options2)];
      case "string":
        return [literalStringValue(exp, options2)];
      case "input":
        return [inputValue(exp, options2)];
      case "colour":
        return [colourValue(exp, options2)];
      case "constant":
        return constantValue(exp, program3, options2);
      case "address":
        return variableAddress(exp, program3, options2);
      case "variable":
        if (reference) {
          if (exp.variable.isArray && exp.indexes.length < exp.variable.arrayDimensions.length) {
            return variableValue(exp, program3, options2);
          } else if (exp.variable.type === "string" && exp.indexes.length === 0) {
            return variableValue(exp, program3, options2);
          } else {
            return variableAddress(exp, program3, options2);
          }
        }
        return variableValue(exp, program3, options2);
      case "function":
        return functionValue(exp, program3, options2);
      case "compound":
        return compoundExpression(exp, program3, options2);
      case "cast":
        return castExpression(exp, program3, options2);
    }
  }
  function literalIntegerValue(exp, options2) {
    return [112 /* ldin */, exp.value];
  }
  function literalStringValue(exp, options2) {
    return [118 /* lstr */, exp.value.length].concat(Array.from(exp.value).map((x) => x.charCodeAt(0)));
  }
  function inputValue(exp, options2) {
    return exp.input.value < 0 ? [112 /* ldin */, exp.input.value, 160 /* inpt */] : [112 /* ldin */, exp.input.value];
  }
  function colourValue(exp, options2) {
    return [112 /* ldin */, exp.colour.value];
  }
  function constantValue(exp, program3, options2) {
    const pcode2 = [];
    if (exp.constant.type === "string") {
      pcode2.push([118 /* lstr */, exp.constant.value.length].concat(Array.from(exp.constant.value).map((x) => x.charCodeAt(0))));
      if (exp.indexes.length > 0) {
        const indexExp = expression2(exp.indexes[0], program3, options2);
        merge(pcode2, indexExp);
        if (program3.language === "Pascal") {
          merge(pcode2, [[5 /* decr */]]);
        }
        merge(pcode2, [[2 /* swap */, 127 /* test */, 26 /* plus */, 4 /* incr */, 122 /* lptr */]]);
      }
    } else {
      pcode2.push([112 /* ldin */, exp.constant.value]);
    }
    return pcode2;
  }
  function variableAddress(exp, program3, options2) {
    const pcode2 = [];
    if (exp.variable.isArray && exp.indexes.length > 0) {
      const baseVariableExp = new VariableValue(exp.lexeme, exp.variable);
      pcode2.push(...expression2(baseVariableExp, program3, options2));
      for (let i2 = 0; i2 < exp.indexes.length; i2 += 1) {
        const index = exp.indexes[i2];
        const indexExp = expression2(index, program3, options2);
        merge(pcode2, indexExp);
        if (exp.variable.arrayDimensions[i2] && exp.variable.arrayDimensions[i2][0] !== 0) {
          merge(pcode2, [[112 /* ldin */, exp.variable.arrayDimensions[i2][0], 27 /* subt */]]);
        } else if (exp.variable.arrayDimensions[i2] === void 0) {
          if (program3.language === "Pascal") {
            merge(pcode2, [[5 /* decr */]]);
          }
        }
        merge(pcode2, [[2 /* swap */, 127 /* test */, 26 /* plus */, 4 /* incr */]]);
      }
    } else if (exp.variable.type === "string" && exp.indexes.length > 0) {
      pcode2.push(...expression2(exp.indexes[0], program3, options2));
      if (program3.language === "Pascal") {
        merge(pcode2, [[5 /* decr */]]);
      }
      const baseVariableExp = new VariableValue(exp.lexeme, exp.variable);
      merge(pcode2, expression2(baseVariableExp, program3, options2));
      merge(pcode2, [[127 /* test */, 26 /* plus */, 4 /* incr */]]);
    } else if (exp.variable.turtle) {
      pcode2.push([116 /* ldag */, program3.turtleAddress + exp.variable.turtle]);
    } else if (exp.variable.routine instanceof Program) {
      pcode2.push([116 /* ldag */, exp.variable.address]);
    } else {
      pcode2.push([117 /* ldav */, exp.variable.routine.address, exp.variable.address]);
    }
    return pcode2;
  }
  function variableValue(exp, program3, options2) {
    let pcode2 = [];
    if (exp.variable.isArray && exp.indexes.length > 0) {
      const baseVariableExp = new VariableValue(exp.lexeme, exp.variable);
      pcode2.push(...expression2(baseVariableExp, program3, options2));
      for (let i2 = 0; i2 < exp.indexes.length; i2 += 1) {
        const index = exp.indexes[i2];
        const indexExp = expression2(index, program3, options2);
        merge(pcode2, indexExp);
        if (exp.variable.arrayDimensions[i2] && exp.variable.arrayDimensions[i2][0] !== 0) {
          merge(pcode2, [[112 /* ldin */, exp.variable.arrayDimensions[i2][0], 27 /* subt */]]);
        } else if (exp.variable.arrayDimensions[i2] === void 0) {
          if (program3.language === "Pascal") {
            merge(pcode2, [[5 /* decr */]]);
          }
        }
        merge(pcode2, [[2 /* swap */, 127 /* test */, 26 /* plus */, 4 /* incr */, 122 /* lptr */]]);
      }
    } else if (exp.variable.type === "string" && exp.indexes.length > 0) {
      pcode2.push(...expression2(exp.indexes[0], program3, options2));
      if (program3.language === "Pascal") {
        merge(pcode2, [[5 /* decr */]]);
      }
      const baseVariableExp = new VariableValue(exp.lexeme, exp.variable);
      merge(pcode2, expression2(baseVariableExp, program3, options2));
      merge(pcode2, [[127 /* test */, 26 /* plus */, 4 /* incr */, 122 /* lptr */]]);
      if (program3.language === "Python" || program3.language === "TypeScript") {
        merge(pcode2, [[9 /* ctos */]]);
      }
    } else if (exp.variable.turtle) {
      pcode2.push([113 /* ldvg */, program3.turtleAddress + exp.variable.turtle]);
    } else if (exp.variable.routine instanceof Program) {
      pcode2.push([113 /* ldvg */, exp.variable.address]);
    } else if (exp.variable.isReferenceParameter && !exp.variable.isArray && exp.variable.type !== "string") {
      pcode2.push([115 /* ldvr */, exp.variable.routine.address, exp.variable.address]);
    } else {
      pcode2.push([114 /* ldvv */, exp.variable.routine.address, exp.variable.address]);
    }
    if (exp.variable.isPointer) {
      merge(pcode2, [[155 /* peek */]]);
    }
    return pcode2;
  }
  function functionValue(exp, program3, options2) {
    const pcode2 = [];
    for (let index = 0; index < exp.command.parameters.length; index += 1) {
      const arg = exp.arguments[index];
      const param = exp.command.parameters[index];
      merge(pcode2, expression2(arg, program3, options2, param.isReferenceParameter));
    }
    if (exp.command instanceof Subroutine) {
      merge(pcode2, [[131 /* subr */, exp.command.index]]);
    } else {
      merge(pcode2, [exp.command.code.slice()]);
    }
    if (exp.command instanceof Subroutine) {
      pcode2.push([114 /* ldvv */, program3.resultAddress, 1]);
      if (exp.command.returns === "string") {
        merge(pcode2, [[8 /* hstr */]]);
      }
    }
    return pcode2;
  }
  function compoundExpression(exp, program3, options2) {
    const left = exp.left ? expression2(exp.left, program3, options2) : null;
    if (left && exp.right.expressionType === "integer" && exp.right.value === 1) {
      if (exp.operator === "plus") {
        merge(left, [[4 /* incr */]]);
        return left;
      }
      if (exp.operator === "subt") {
        merge(left, [[5 /* decr */]]);
        return left;
      }
    }
    const right = expression2(exp.right, program3, options2);
    const op = operator3(exp.operator, program3, options2);
    if (left) {
      merge(left, right);
      merge(left, [op]);
      return left;
    }
    merge(right, [op]);
    return right;
  }
  function castExpression(exp, program3, options2) {
    const pcode2 = expression2(exp.expression, program3, options2);
    if (exp.expression.type === "character" && exp.type === "string") {
      merge(pcode2, [[9 /* ctos */]]);
    }
    if (exp.expression.type === "integer" && exp.type === "string") {
      merge(pcode2, [[11 /* itos */]]);
    }
    if (exp.expression.type === "string" && exp.type === "integer") {
      merge(pcode2, [[112 /* ldin */, 0, 13 /* sval */]]);
    }
    return pcode2;
  }
  function operator3(op, program3, options2) {
    switch (op) {
      case "not":
        if (program3.language === "C" || program3.language === "Python") {
          return [112 /* ldin */, 0, 32 /* eqal */];
        }
        return [16 /* not */];
      default:
        return [PCode[op]];
    }
  }

  // client/encoder/statement.ts
  function statement7(stmt, program3, startLine, options2) {
    switch (stmt.statementType) {
      case "variableAssignment":
        return variableAssignment7(stmt, program3, options2);
      case "procedureCall":
        return procedureCall2(stmt, program3, options2);
      case "ifStatement":
        return ifStatement7(stmt, program3, startLine, options2);
      case "forStatement":
        return forStatement7(stmt, program3, startLine, options2);
      case "repeatStatement":
        return repeatStatement3(stmt, program3, startLine, options2);
      case "whileStatement":
        return whileStatement7(stmt, program3, startLine, options2);
      case "returnStatement":
        return returnStatement6(stmt, program3, options2);
      case "passStatement":
        return [];
    }
  }
  function variableAssignment7(stmt, program3, options2) {
    if (stmt.variable.turtle) {
      return turtleVariableAssignment(stmt, program3, options2);
    }
    if (stmt.variable.isGlobal) {
      return globalVariableAssignment(stmt, program3, options2);
    }
    if (stmt.variable.isPointer) {
      return pointerVariableAssignment(stmt, program3, options2);
    }
    if (stmt.variable.isReferenceParameter && !stmt.variable.isArray && stmt.variable.type !== "string") {
      return referenceVariableAssignment(stmt, program3, options2);
    }
    return localVariableAssignment(stmt, program3, options2);
  }
  function turtleVariableAssignment(stmt, program3, options2) {
    const pcode2 = expression2(stmt.value, program3, options2);
    merge(pcode2, [[119 /* stvg */, program3.turtleAddress + stmt.variable.turtle]]);
    return pcode2;
  }
  function globalVariableAssignment(stmt, program3, options2) {
    const pcode2 = expression2(stmt.value, program3, options2);
    if (stmt.variable.isArray || stmt.variable.type === "string" && stmt.indexes.length > 0) {
      const exp = new VariableValue(stmt.lexeme, stmt.variable);
      exp.indexes.push(...stmt.indexes);
      const element2 = expression2(exp, program3, options2);
      const lastLine = element2[element2.length - 1];
      if (stmt.variable.isArray && stmt.variable.type === "string") {
        lastLine.push(126 /* cstr */);
      } else {
        lastLine[lastLine.length - 1] = 123 /* sptr */;
      }
      merge(pcode2, element2);
    } else if (stmt.variable.type === "string") {
      merge(pcode2, [[113 /* ldvg */, stmt.variable.address, 126 /* cstr */]]);
    } else {
      merge(pcode2, [[119 /* stvg */, stmt.variable.address]]);
    }
    return pcode2;
  }
  function pointerVariableAssignment(stmt, program3, options2) {
    const variableValue2 = new VariableValue(stmt.lexeme, stmt.variable);
    const pcode2 = expression2(variableValue2, program3, options2);
    pcode2[pcode2.length - 1].pop();
    merge(pcode2, expression2(stmt.value, program3, options2));
    if (stmt.variable.type === "string") {
      merge(pcode2, [[126 /* cstr */]]);
    } else {
      merge(pcode2, [[156 /* poke */]]);
    }
    return pcode2;
  }
  function referenceVariableAssignment(stmt, program3, options2) {
    const pcode2 = expression2(stmt.value, program3, options2);
    merge(pcode2, [[121 /* stvr */, stmt.variable.routine.address, stmt.variable.address]]);
    return pcode2;
  }
  function localVariableAssignment(stmt, program3, options2) {
    const pcode2 = expression2(stmt.value, program3, options2);
    if (stmt.variable.isArray || stmt.variable.type === "string" && stmt.indexes.length > 0) {
      const exp = new VariableValue(stmt.lexeme, stmt.variable);
      exp.indexes.push(...stmt.indexes);
      const element2 = expression2(exp, program3, options2);
      const lastLine = element2[element2.length - 1];
      if (stmt.variable.isArray && stmt.variable.type === "string") {
        lastLine.push(126 /* cstr */);
      } else {
        lastLine[lastLine.length - 1] = 123 /* sptr */;
      }
      merge(pcode2, element2);
    } else if (stmt.variable.type === "string") {
      merge(pcode2, [[114 /* ldvv */, stmt.variable.routine.address, stmt.variable.address, 126 /* cstr */]]);
    } else {
      merge(pcode2, [[120 /* stvv */, stmt.variable.routine.address, stmt.variable.address]]);
    }
    return pcode2;
  }
  function procedureCall2(stmt, program3, options2) {
    const pcode2 = [];
    for (let index = 0; index < stmt.command.parameters.length; index += 1) {
      const arg = stmt.arguments[index];
      const param = stmt.command.parameters[index];
      merge(pcode2, expression2(arg, program3, options2, param.isReferenceParameter));
    }
    if (stmt.command instanceof Subroutine) {
      merge(pcode2, [[131 /* subr */, stmt.command.index]]);
    } else {
      if (stmt.command.code[0] === 229 /* oldt */) {
        merge(pcode2, [[112 /* ldin */, program3.turtleAddress, 112 /* ldin */, 0, 123 /* sptr */]]);
      } else {
        merge(pcode2, [stmt.command.code.slice()]);
      }
    }
    return pcode2;
  }
  function ifStatement7(stmt, program3, startLine, options2) {
    const firstLines = expression2(stmt.condition, program3, options2);
    const ifPcode = [];
    for (const subStmt of stmt.ifStatements) {
      const subStartLine = startLine + ifPcode.length + firstLines.length;
      ifPcode.push(...statement7(subStmt, program3, subStartLine, options2));
    }
    const elsePcode = [];
    for (const subStmt of stmt.elseStatements) {
      const subStartLine = startLine + ifPcode.length + elsePcode.length + firstLines.length + 1;
      elsePcode.push(...statement7(subStmt, program3, subStartLine, options2));
    }
    if (elsePcode.length === 0) {
      merge(firstLines, [[129 /* ifno */, startLine + ifPcode.length + firstLines.length]]);
      ifPcode.unshift(...firstLines);
      return ifPcode;
    }
    merge(firstLines, [[129 /* ifno */, startLine + ifPcode.length + firstLines.length + 1]]);
    const middleLine = [128 /* jump */, startLine + ifPcode.length + elsePcode.length + firstLines.length + 1];
    ifPcode.unshift(...firstLines);
    ifPcode.push(middleLine);
    return ifPcode.concat(elsePcode);
  }
  function forStatement7(stmt, program3, startLine, options2) {
    const pcode2 = [];
    for (const subStmt of stmt.statements) {
      const subStartLine = startLine + pcode2.length + 2;
      pcode2.push(...statement7(subStmt, program3, subStartLine, options2));
    }
    const condition = expression2(stmt.condition, program3, options2);
    merge(condition, [[129 /* ifno */, startLine + pcode2.length + condition.length + 2]]);
    pcode2.unshift(...condition);
    pcode2.unshift(...variableAssignment7(stmt.initialisation, program3, options2));
    pcode2.push(...variableAssignment7(stmt.change, program3, options2));
    merge(pcode2, [[128 /* jump */, startLine + 1]]);
    return pcode2;
  }
  function repeatStatement3(stmt, program3, startLine, options2) {
    const pcode2 = [];
    for (const subStmt of stmt.statements) {
      const subStartLine = startLine + pcode2.length;
      pcode2.push(...statement7(subStmt, program3, subStartLine, options2));
    }
    const condition = expression2(stmt.condition, program3, options2);
    merge(condition, [[129 /* ifno */, startLine]]);
    pcode2.push(...condition);
    return pcode2;
  }
  function whileStatement7(stmt, program3, startLine, options2) {
    const pcode2 = [];
    for (const subStmt of stmt.statements) {
      const subStartLine = startLine + pcode2.length + 1;
      pcode2.push(...statement7(subStmt, program3, subStartLine, options2));
    }
    const condition = expression2(stmt.condition, program3, options2);
    const nextLine = startLine + pcode2.length + condition.length + 1;
    merge(condition, [[129 /* ifno */, nextLine]]);
    pcode2.unshift(...condition);
    pcode2.push([128 /* jump */, startLine]);
    return pcode2;
  }
  function returnStatement6(stmt, program3, options2) {
    const variableAssignment8 = new VariableAssignment(stmt.lexeme, stmt.routine.variables[0], [], stmt.value);
    const pcode2 = localVariableAssignment(variableAssignment8, program3, options2);
    pcode2.push([
      113 /* ldvg */,
      stmt.routine.address,
      119 /* stvg */,
      program3.resultAddress,
      140 /* memr */,
      stmt.routine.address,
      134 /* plsr */,
      132 /* retn */
    ]);
    return pcode2;
  }

  // client/encoder/program.ts
  function program2(program3, options2 = defaultOptions2) {
    const startCode = programStart(program3, options2);
    const subroutinesStartLine = program3.allSubroutines.length > 0 ? startCode.length + 2 : startCode.length + 1;
    const subroutinesCode = compileSubroutines(program3.allSubroutines, subroutinesStartLine, options2);
    const programStartLine = subroutinesStartLine + subroutinesCode.length;
    const innerCode = compileInnerCode(program3, programStartLine, options2);
    const jumpLine = [[128 /* jump */, startCode.length + subroutinesCode.length + 2]];
    const pcode2 = subroutinesCode.length > 1 ? startCode.concat(jumpLine).concat(subroutinesCode).concat(innerCode) : startCode.concat(innerCode);
    backpatchSubroutineCalls(program3, pcode2);
    if (program3.language === "C" || program3.language === "Java") {
      const main2 = program3.subroutines.find((x) => x.name === "main");
      pcode2.push([131 /* subr */, main2.startLine]);
    }
    addHCLR(pcode2);
    pcode2.push([130 /* halt */]);
    return pcode2;
  }
  function programStart(program3, options2) {
    const pcode2 = [
      [
        112 /* ldin */,
        program3.turtleAddress,
        1 /* dupl */,
        1 /* dupl */,
        112 /* ldin */,
        0,
        123 /* sptr */,
        112 /* ldin */,
        program3.turtleVariables.length,
        2 /* swap */,
        123 /* sptr */,
        4 /* incr */,
        112 /* ldin */,
        program3.memoryNeeded + program3.turtleVariables.length,
        124 /* zptr */,
        112 /* ldin */,
        program3.turtleAddress + program3.memoryNeeded + program3.turtleVariables.length,
        138 /* stmt */
      ],
      [
        80 /* home */,
        112 /* ldin */,
        2,
        85 /* thik */,
        112 /* ldin */,
        360,
        84 /* angl */,
        112 /* ldin */,
        32,
        162 /* bufr */,
        112 /* ldin */,
        1,
        123 /* sptr */,
        141 /* hfix */,
        112 /* ldin */,
        0,
        1 /* dupl */,
        112 /* ldin */,
        1e3,
        1 /* dupl */,
        1 /* dupl */,
        1 /* dupl */,
        145 /* reso */,
        144 /* canv */
      ]
    ];
    for (const variable7 of program3.variables) {
      const setup = setupGlobalVariable(variable7);
      if (setup.length > 0) {
        pcode2.push(...setup);
      }
    }
    return pcode2;
  }
  function setupGlobalVariable(variable7) {
    const pcode2 = [];
    if (variable7.isArray) {
      pcode2.push([
        116 /* ldag */,
        variable7.lengthByteAddress,
        119 /* stvg */,
        variable7.address,
        112 /* ldin */,
        variable7.elementCount,
        119 /* stvg */,
        variable7.lengthByteAddress
      ]);
      for (const subVariable of variable7.subVariables) {
        const subPcode = setupGlobalVariable(subVariable);
        if (subPcode.length > 0) {
          pcode2.push(...subPcode);
        }
      }
    } else if (variable7.type === "string") {
      pcode2.push([
        116 /* ldag */,
        variable7.lengthByteAddress + 1,
        119 /* stvg */,
        variable7.address,
        112 /* ldin */,
        variable7.stringLength + 1,
        119 /* stvg */,
        variable7.lengthByteAddress
      ]);
    }
    return pcode2;
  }
  function compileSubroutines(subroutines, startLine, options2) {
    const pcode2 = [];
    for (const subroutine8 of subroutines) {
      subroutine8.startLine = startLine;
      const startCode = subroutineStartCode(subroutine8, options2);
      const innerCode = compileInnerCode(subroutine8, startLine + startCode.length, options2);
      const subroutineCode = startCode.concat(innerCode);
      if (subroutine8.type === "procedure" || subroutine8.program.language === "Pascal") {
        const endCode = subroutineEndCode(subroutine8, options2);
        subroutineCode.push(...endCode);
      }
      startLine += subroutineCode.length;
      pcode2.push(...subroutineCode);
    }
    return pcode2;
  }
  function compileInnerCode(routine, startLine, options2) {
    const program3 = routine instanceof Subroutine ? routine.program : routine;
    const pcode2 = [];
    for (const stmt of routine.statements) {
      pcode2.push(...statement7(stmt, program3, startLine + pcode2.length, options2));
    }
    return pcode2;
  }
  function subroutineStartCode(subroutine8, options2) {
    const pcode2 = [];
    pcode2.push([133 /* pssr */, subroutine8.index]);
    if (subroutine8.variables.length > 0) {
      pcode2.push([139 /* memc */, subroutine8.address, subroutine8.memoryNeeded]);
      if (options2.initialiseLocals) {
        if (subroutine8.variables.length > subroutine8.parameters.length) {
          pcode2.push([117 /* ldav */, subroutine8.address, 1, 112 /* ldin */, subroutine8.memoryNeeded, 124 /* zptr */]);
        }
      }
      for (const variable7 of subroutine8.variables) {
        const setup = setupLocalVariable(variable7);
        if (setup.length > 0) {
          pcode2.push(...setup);
        }
      }
      if (subroutine8.parameters.length > 0) {
        pcode2.push([]);
        for (const parameter of subroutine8.parameters.reverse()) {
          const lastStartLine = pcode2[pcode2.length - 1];
          if (parameter.isArray && !parameter.isReferenceParameter) {
          } else if (parameter.type === "string" && !parameter.isReferenceParameter) {
            lastStartLine.push(114 /* ldvv */, subroutine8.address, parameter.address, 126 /* cstr */);
          } else {
            lastStartLine.push(120 /* stvv */, subroutine8.address, parameter.address);
          }
        }
      }
    }
    return pcode2;
  }
  function setupLocalVariable(variable7) {
    const subroutine8 = variable7.routine;
    const pcode2 = [];
    if (variable7.isArray && !variable7.isReferenceParameter) {
      pcode2.push([
        117 /* ldav */,
        subroutine8.address,
        variable7.lengthByteAddress,
        120 /* stvv */,
        subroutine8.address,
        variable7.address,
        112 /* ldin */,
        variable7.elementCount,
        120 /* stvv */,
        subroutine8.address,
        variable7.lengthByteAddress
      ]);
      for (const subVariable of variable7.subVariables) {
        const subPcode = setupLocalVariable(subVariable);
        if (subPcode.length > 0) {
          pcode2.push(...subPcode);
        }
      }
      return pcode2;
    }
    if (variable7.type === "string") {
      pcode2.push([
        117 /* ldav */,
        subroutine8.address,
        variable7.lengthByteAddress + 1,
        120 /* stvv */,
        subroutine8.address,
        variable7.address,
        112 /* ldin */,
        variable7.stringLength + 1,
        120 /* stvv */,
        subroutine8.address,
        variable7.lengthByteAddress
      ]);
    }
    return pcode2;
  }
  function subroutineEndCode(subroutine8, options2) {
    const pcode2 = [];
    if (subroutine8.type === "function") {
      pcode2.push(113 /* ldvg */, subroutine8.address, 119 /* stvg */, subroutine8.program.resultAddress);
    }
    if (subroutine8.variables.length > 0) {
      pcode2.push(140 /* memr */, subroutine8.address);
    }
    pcode2.push(134 /* plsr */, 132 /* retn */);
    return [pcode2];
  }
  function backpatchSubroutineCalls(program3, pcode2) {
    for (let i2 = 0; i2 < pcode2.length; i2 += 1) {
      for (let j = 0; j < pcode2[i2].length; j += 1) {
        if (pcode2[i2][j - 1] && pcode2[i2][j - 1] === 131 /* subr */) {
          const subroutine8 = program3.allSubroutines.find((x) => x.index === pcode2[i2][j]);
          if (subroutine8) {
            pcode2[i2][j] = subroutine8.startLine;
          }
        }
      }
    }
  }
  function addHCLR(pcode2) {
    const heapStringCodes = [
      8 /* hstr */,
      9 /* ctos */,
      11 /* itos */,
      12 /* hexs */,
      14 /* qtos */,
      46 /* smax */,
      47 /* smin */,
      64 /* scat */,
      66 /* case */,
      67 /* copy */,
      68 /* dels */,
      69 /* inss */,
      71 /* repl */,
      72 /* spad */,
      118 /* lstr */,
      163 /* read */,
      164 /* rdln */,
      184 /* frds */,
      185 /* frln */,
      188 /* ffnd */,
      189 /* fdir */,
      190 /* fnxt */
    ];
    for (const line2 of pcode2) {
      let heapStringMade = false;
      let heapStringNeeded = false;
      let lastJumpIndex = null;
      let i2 = 0;
      while (i2 < line2.length) {
        if (heapStringCodes.indexOf(line2[i2]) >= 0) {
          heapStringMade = true;
        }
        if (line2[i2] === 131 /* subr */) {
          heapStringNeeded = true;
        }
        if (line2[i2] === 128 /* jump */ || line2[i2] === 129 /* ifno */) {
          lastJumpIndex = i2;
        }
        const args = pcodeArgs(line2[i2]);
        i2 += args === -1 ? line2[i2 + 1] + 2 : args + 1;
      }
      if (heapStringMade && !heapStringNeeded) {
        if (lastJumpIndex !== null) {
          line2.splice(lastJumpIndex, 0, 142 /* hclr */);
        } else if (line2[line2.length - 1] !== 142 /* hclr */) {
          line2.push(142 /* hclr */);
        }
      }
    }
  }

  // client/state/index.ts
  var State = class {
    #savedSettingsHaveBeenLoaded;
    #language;
    #mode;
    #editorFontFamily;
    #editorFontSize;
    #outputFontFamily;
    #outputFontSize;
    #includeCommentsInExamples;
    #loadCorrespondingExample;
    #assembler;
    #decimal;
    #autoCompileOnLoad;
    #autoRunOnLoad;
    #autoFormatOnLoad;
    #alwaysSaveSettings;
    #commandsCategoryIndex;
    #showSimpleCommands;
    #showIntermediateCommands;
    #showAdvancedCommands;
    #files;
    #currentFileIndex;
    #tokens;
    #lexemes;
    #program;
    #usage;
    #pcode;
    #showCanvasOnRun;
    #showOutputOnWrite;
    #showMemoryOnDump;
    #drawCountMax;
    #codeCountMax;
    #smallSize;
    #stackSize;
    #traceOnRun;
    #activateHCLR;
    #preventStackCollision;
    #rangeCheckArrays;
    #canvasStartSize;
    #setupDefaultKeyBuffer;
    #turtleAttributesAsGlobals;
    #initialiseLocals;
    #allowCSTR;
    #separateReturnStack;
    #separateMemoryControlStack;
    #separateSubroutineRegisterStack;
    constructor() {
      this.#savedSettingsHaveBeenLoaded = load("savedSettingsHaveBeenLoaded");
      this.#language = load("language");
      this.#mode = load("mode");
      this.#editorFontFamily = load("editorFontFamily");
      this.#editorFontSize = load("editorFontSize");
      this.#outputFontFamily = load("outputFontFamily");
      this.#outputFontSize = load("outputFontSize");
      this.#includeCommentsInExamples = load("includeCommentsInExamples");
      this.#loadCorrespondingExample = load("loadCorrespondingExample");
      this.#assembler = load("assembler");
      this.#decimal = load("decimal");
      this.#autoCompileOnLoad = load("autoCompileOnLoad");
      this.#autoRunOnLoad = load("autoRunOnLoad");
      this.#autoFormatOnLoad = load("autoFormatOnLoad");
      this.#alwaysSaveSettings = load("alwaysSaveSettings");
      this.#commandsCategoryIndex = load("commandsCategoryIndex");
      this.#showSimpleCommands = load("showSimpleCommands");
      this.#showIntermediateCommands = load("showIntermediateCommands");
      this.#showAdvancedCommands = load("showAdvancedCommands");
      this.#files = load("files");
      this.#currentFileIndex = load("currentFileIndex");
      this.#tokens = [];
      this.#lexemes = [];
      this.#program = new Program(this.#language, "");
      this.#usage = [];
      this.#pcode = [];
      this.#showCanvasOnRun = load("showCanvasOnRun");
      this.#showOutputOnWrite = load("showOutputOnWrite");
      this.#showMemoryOnDump = load("showMemoryOnDump");
      this.#drawCountMax = load("drawCountMax");
      this.#codeCountMax = load("codeCountMax");
      this.#smallSize = load("smallSize");
      this.#stackSize = load("stackSize");
      this.#traceOnRun = load("traceOnRun");
      this.#activateHCLR = load("activateHCLR");
      this.#preventStackCollision = load("preventStackCollision");
      this.#rangeCheckArrays = load("rangeCheckArrays");
      this.#canvasStartSize = load("canvasStartSize");
      this.#setupDefaultKeyBuffer = load("setupDefaultKeyBuffer");
      this.#turtleAttributesAsGlobals = load("turtleAttributesAsGlobals");
      this.#initialiseLocals = load("initialiseLocals");
      this.#allowCSTR = load("allowCSTR");
      this.#separateReturnStack = load("separateReturnStack");
      this.#separateMemoryControlStack = load("separateMemoryControlStack");
      this.#separateSubroutineRegisterStack = load("separateSubroutineRegisterStack");
    }
    async init() {
      const response = await fetch("/status");
      const user = await response.json();
      if (user) {
        if (!this.savedSettingsHaveBeenLoaded) {
          await this.loadSavedSettings();
        }
      } else {
        this.savedSettingsHaveBeenLoaded = false;
        this.alwaysSaveSettings = false;
      }
      if (this.#files.length === 0) {
        this.#files.push(new File(this.language));
      } else if (this.#files.length === 1 && this.file.code === "") {
        this.file.language = this.language;
      } else {
        this.#tokens = tokenize(this.code, this.language);
      }
      if (this.file.compiled) {
        this.compileCurrentFile();
      }
      send("languageChanged");
      send("modeChanged");
      send("editorFontFamilyChanged");
      send("editorFontSizeChanged");
      send("outputFontFamilyChanged");
      send("outputFontSizeChanged");
      send("includeCommentsInExamplesChanged");
      send("loadCorrespondingExampleChanged");
      send("assemblerChanged");
      send("decimalChanged");
      send("autoCompileOnLoadChanged");
      send("autoRunOnLoadChanged");
      send("autoFormatOnLoadChanged");
      send("alwaysSaveSettingsChanged");
      send("commandsCategoryIndexChanged");
      send("showSimpleCommandsChanged");
      send("showIntermediateCommandsChanged");
      send("showAdvancedCommandsChanged");
      send("filesChanged");
      send("currentFileIndexChanged");
      send("tokensChanged");
      send("lexemesChanged");
      send("programChanged");
      send("usageChanged");
      send("pcodeChanged");
      send("showCanvasOnRunChanged");
      send("showOutputOnWriteChanged");
      send("showMemoryOnDumpChanged");
      send("drawCountMaxChanged");
      send("codeCountMaxChanged");
      send("smallSizeChanged");
      send("stackSizeChanged");
      send("traceOnRunChanged");
      send("activateHCLRChanged");
      send("preventStackCollisionChanged");
      send("rangeCheckArraysChanged");
      send("canvasStartSizeChanged");
      send("setupDefaultKeyBufferChanged");
      send("turtleAttributesAsGlobalsChanged");
      send("initialiseLocalsChanged");
      send("allowCSTRChanged");
      send("separateReturnStackChanged");
      send("separateMemoryControlStackChanged");
      send("separateSubroutineRegisterStackChanged");
      send("systemReady");
    }
    get savedSettingsHaveBeenLoaded() {
      return this.#savedSettingsHaveBeenLoaded;
    }
    get language() {
      return this.#language;
    }
    get mode() {
      return this.#mode;
    }
    get editorFontFamily() {
      return this.#editorFontFamily;
    }
    get editorFontSize() {
      return this.#editorFontSize;
    }
    get outputFontFamily() {
      return this.#outputFontFamily;
    }
    get outputFontSize() {
      return this.#outputFontSize;
    }
    get includeCommentsInExamples() {
      return this.#includeCommentsInExamples;
    }
    get loadCorrespondingExample() {
      return this.#loadCorrespondingExample;
    }
    get assembler() {
      return this.#assembler;
    }
    get decimal() {
      return this.#decimal;
    }
    get autoCompileOnLoad() {
      return this.#autoCompileOnLoad;
    }
    get autoRunOnLoad() {
      return this.#autoRunOnLoad;
    }
    get autoFormatOnLoad() {
      return this.#autoFormatOnLoad;
    }
    get alwaysSaveSettings() {
      return this.#alwaysSaveSettings;
    }
    get commandsCategoryIndex() {
      return this.#commandsCategoryIndex;
    }
    get showSimpleCommands() {
      return this.#showSimpleCommands;
    }
    get showIntermediateCommands() {
      return this.#showIntermediateCommands;
    }
    get showAdvancedCommands() {
      return this.#showAdvancedCommands;
    }
    get files() {
      return this.#files;
    }
    get currentFileIndex() {
      return this.#currentFileIndex;
    }
    get file() {
      return this.files[this.currentFileIndex];
    }
    get filename() {
      return this.files[this.currentFileIndex].name;
    }
    get code() {
      return this.files[this.currentFileIndex].code;
    }
    get tokens() {
      return this.#tokens;
    }
    get lexemes() {
      return this.#lexemes.filter((x) => x.type !== "comment");
    }
    get comments() {
      return this.#lexemes.filter((x) => x.type === "comment");
    }
    get program() {
      return this.#program;
    }
    get usage() {
      return this.#usage;
    }
    get pcode() {
      return this.#pcode;
    }
    get showCanvasOnRun() {
      return this.#showCanvasOnRun;
    }
    get showOutputOnWrite() {
      return this.#showOutputOnWrite;
    }
    get showMemoryOnDump() {
      return this.#showMemoryOnDump;
    }
    get drawCountMax() {
      return this.#drawCountMax;
    }
    get codeCountMax() {
      return this.#codeCountMax;
    }
    get smallSize() {
      return this.#smallSize;
    }
    get stackSize() {
      return this.#stackSize;
    }
    get traceOnRun() {
      return this.#traceOnRun;
    }
    get activateHCLR() {
      return this.#activateHCLR;
    }
    get preventStackCollision() {
      return this.#preventStackCollision;
    }
    get rangeCheckArrays() {
      return this.#rangeCheckArrays;
    }
    get canvasStartSize() {
      return this.#canvasStartSize;
    }
    get setupDefaultKeyBuffer() {
      return this.#setupDefaultKeyBuffer;
    }
    get turtleAttributesAsGlobals() {
      return this.#turtleAttributesAsGlobals;
    }
    get initialiseLocals() {
      return this.#initialiseLocals;
    }
    get allowCSTR() {
      return this.#allowCSTR;
    }
    get separateReturnStack() {
      return this.#separateReturnStack;
    }
    get separateMemoryControlStack() {
      return this.#separateMemoryControlStack;
    }
    get separateSubroutineRegisterStack() {
      return this.#separateSubroutineRegisterStack;
    }
    get machineOptions() {
      return {
        showCanvasOnRun: this.showCanvasOnRun,
        showOutputOnWrite: this.showOutputOnWrite,
        showMemoryOnDump: this.showMemoryOnDump,
        drawCountMax: this.drawCountMax,
        codeCountMax: this.codeCountMax,
        smallSize: this.smallSize,
        stackSize: this.stackSize,
        traceOnRun: this.traceOnRun,
        activateHCLR: this.activateHCLR,
        preventStackCollision: this.preventStackCollision,
        rangeCheckArrays: this.rangeCheckArrays
      };
    }
    get compilerOptions() {
      return {
        canvasStartSize: this.canvasStartSize,
        setupDefaultKeyBuffer: this.setupDefaultKeyBuffer,
        turtleAttributesAsGlobals: this.turtleAttributesAsGlobals,
        initialiseLocals: this.initialiseLocals,
        allowCSTR: this.allowCSTR,
        separateReturnStack: this.separateReturnStack,
        separateMemoryControlStack: this.separateMemoryControlStack,
        separateSubroutineRegisterStack: this.separateSubroutineRegisterStack
      };
    }
    set savedSettingsHaveBeenLoaded(savedSettingsHaveBeenLoaded) {
      this.#savedSettingsHaveBeenLoaded = savedSettingsHaveBeenLoaded;
      save("savedSettingsHaveBeenLoaded", savedSettingsHaveBeenLoaded);
    }
    set language(language2) {
      if (!languages.includes(language2)) {
        send("error", new SystemError(`Unknown language "${language2}".`));
      }
      this.#language = language2;
      save("language", language2);
      send("languageChanged");
      this.file.compiled = false;
      save("files", this.files);
      send("codeChanged");
      if (this.files) {
        if (this.file.example && this.loadCorrespondingExample) {
          this.openExampleFile(this.file.example);
        }
      }
    }
    set mode(mode2) {
      this.#mode = mode2;
      save("mode", mode2);
      send("modeChanged");
    }
    set editorFontFamily(editorFontFamily) {
      this.#editorFontFamily = editorFontFamily;
      save("editorFontFamily", editorFontFamily);
      send("editorFontFamilyChanged");
    }
    set editorFontSize(editorFontSize) {
      this.#editorFontSize = editorFontSize;
      save("editorFontSize", editorFontSize);
      send("editorFontSizeChanged");
    }
    set outputFontFamily(outputFontFamily) {
      this.#outputFontFamily = outputFontFamily;
      save("outputFontFamily", outputFontFamily);
      send("outputFontFamilyChanged");
    }
    set outputFontSize(outputFontSize) {
      this.#outputFontSize = outputFontSize;
      save("outputFontSize", outputFontSize);
      send("outputFontSizeChanged");
    }
    set includeCommentsInExamples(includeCommentsInExamples) {
      this.#includeCommentsInExamples = includeCommentsInExamples;
      save("includeCommentsInExamples", includeCommentsInExamples);
      send("includeCommentsInExamplesChanged");
    }
    set loadCorrespondingExample(loadCorrespondingExample) {
      this.#loadCorrespondingExample = loadCorrespondingExample;
      save("loadCorrespondingExample", loadCorrespondingExample);
      send("loadCorrespondingExampleChanged");
    }
    set assembler(assembler) {
      this.#assembler = assembler;
      save("assembler", assembler);
      send("pcodeChanged");
    }
    set decimal(decimal2) {
      this.#decimal = decimal2;
      save("decimal", decimal2);
      send("pcodeChanged");
    }
    set autoCompileOnLoad(autoCompileOnLoad) {
      this.#autoCompileOnLoad = autoCompileOnLoad;
      save("autoCompileOnLoad", this.#autoCompileOnLoad);
      send("autoCompileOnLoadChanged");
    }
    set autoRunOnLoad(autoRunOnLoad) {
      this.#autoRunOnLoad = autoRunOnLoad;
      save("autoRunOnLoad", this.#autoRunOnLoad);
      send("autoRunOnLoadChanged");
    }
    set autoFormatOnLoad(autoFormatOnLoad) {
      this.#autoFormatOnLoad = autoFormatOnLoad;
      save("autoFormatOnLoad", this.#autoFormatOnLoad);
      send("autoFormatOnLoadChanged");
    }
    set alwaysSaveSettings(alwaysSaveSettings) {
      this.#alwaysSaveSettings = alwaysSaveSettings;
      save("alwaysSaveSettings", alwaysSaveSettings);
      send("alwaysSaveSettingsChanged");
    }
    set commandsCategoryIndex(commandsCategoryIndex) {
      this.#commandsCategoryIndex = commandsCategoryIndex;
      save("commandsCategoryIndex", commandsCategoryIndex);
      send("commandsCategoryIndexChanged");
    }
    set showSimpleCommands(showSimpleCommands) {
      this.#showSimpleCommands = showSimpleCommands;
      save("showSimpleCommands", showSimpleCommands);
      send("showSimpleCommandsChanged");
    }
    set showIntermediateCommands(showIntermediateCommands) {
      this.#showIntermediateCommands = showIntermediateCommands;
      save("showIntermediateCommands", showIntermediateCommands);
      send("showIntermediateCommandsChanged");
    }
    set showAdvancedCommands(showAdvancedCommands) {
      this.#showAdvancedCommands = showAdvancedCommands;
      save("showAdvancedCommands", showAdvancedCommands);
      send("showAdvancedCommandsChanged");
    }
    set files(files) {
      this.#files = files;
      save("files", files);
      send("filesChanged");
    }
    set currentFileIndex(currentFileIndex) {
      this.#currentFileIndex = currentFileIndex;
      save("currentFileIndex", currentFileIndex);
      this.#language = this.file.language;
      save("language", this.file.language);
      send("languageChanged");
      if (this.file.compiled) {
        this.compileCurrentFile();
      } else {
        this.tokens = tokenize(this.code, this.language);
        this.lexemes = [];
        this.program = new Program(this.language, "");
        this.usage = [];
        this.pcode = [];
      }
      send("currentFileIndexChanged");
    }
    set filename(name) {
      this.file.name = name;
      this.file.edited = true;
      save("files", this.files);
      send("filenameChanged");
    }
    set code(code3) {
      this.file.code = code3;
      this.file.edited = true;
      this.file.compiled = false;
      this.tokens = tokenize(code3, this.language);
      save("files", this.files);
      send("codeChanged");
    }
    set tokens(tokens) {
      this.#tokens = tokens;
      send("tokensChanged");
    }
    set lexemes(lexemes) {
      this.#lexemes = lexemes;
      send("lexemesChanged");
    }
    set program(program3) {
      this.#program = program3;
      send("programChanged");
    }
    set usage(usage) {
      this.#usage = usage;
      send("usageChanged");
    }
    set pcode(pcode2) {
      this.#pcode = pcode2;
      send("pcodeChanged");
    }
    set showCanvasOnRun(showCanvasOnRun) {
      this.#showCanvasOnRun = showCanvasOnRun;
      save("showCanvasOnRun", showCanvasOnRun);
      send("showCanvasOnRunChanged");
    }
    set showOutputOnWrite(showOutputOnWrite) {
      this.#showOutputOnWrite = showOutputOnWrite;
      save("showOutputOnWrite", showOutputOnWrite);
      send("showOutputOnWriteChanged");
    }
    set showMemoryOnDump(showMemoryOnDump) {
      this.#showMemoryOnDump = showMemoryOnDump;
      save("showMemoryOnDump", showMemoryOnDump);
      send("showMemoryOnDumpChanged");
    }
    set drawCountMax(drawCountMax) {
      this.#drawCountMax = drawCountMax;
      save("drawCountMax", drawCountMax);
      send("drawCountMaxChanged");
    }
    set codeCountMax(codeCountMax) {
      this.#codeCountMax = codeCountMax;
      save("codeCountMax", codeCountMax);
      send("codeCountMaxChanged");
    }
    set smallSize(smallSize) {
      this.#smallSize = smallSize;
      save("smallSize", smallSize);
      send("smallSizeChanged");
    }
    set stackSize(stackSize) {
      this.#stackSize = stackSize;
      save("stackSize", stackSize);
      send("stackSizeChanged");
    }
    set traceOnRun(traceOnRun) {
      this.#traceOnRun = traceOnRun;
      save("traceOnRun", traceOnRun);
      send("traceOnRunChanged");
    }
    set activateHCLR(activateHCLR) {
      this.#activateHCLR = activateHCLR;
      save("activateHCLR", activateHCLR);
      send("activateHCLRChanged");
    }
    set preventStackCollision(preventStackCollision) {
      this.#preventStackCollision = preventStackCollision;
      save("preventStackCollision", preventStackCollision);
      send("preventStackCollisionChanged");
    }
    set rangeCheckArrays(rangeCheckArrays) {
      this.#rangeCheckArrays = rangeCheckArrays;
      save("rangeCheckArrays", rangeCheckArrays);
      send("rangeCheckArraysChanged");
    }
    set canvasStartSize(canvasStartSize) {
      this.#canvasStartSize = canvasStartSize;
      save("canvasStartSize", canvasStartSize);
      send("canvasStartSizeChanged");
    }
    set setupDefaultKeyBuffer(setupDefaultKeyBuffer) {
      this.#setupDefaultKeyBuffer = setupDefaultKeyBuffer;
      save("setupDefaultKeyBuffer", setupDefaultKeyBuffer);
      send("setupDefaultKeyBufferChanged");
    }
    set turtleAttributesAsGlobals(turtleAttributesAsGlobals) {
      this.#turtleAttributesAsGlobals = turtleAttributesAsGlobals;
      save("turtleAttributesAsGlobals", turtleAttributesAsGlobals);
      send("turtleAttributesAsGlobalsChanged");
    }
    set initialiseLocals(initialiseLocals) {
      this.#initialiseLocals = initialiseLocals;
      save("initialiseLocals", initialiseLocals);
      send("initialiseLocalsChanged");
    }
    set allowCSTR(allowCSTR) {
      this.#allowCSTR = allowCSTR;
      save("allowCSTR", allowCSTR);
      send("allowCSTRChanged");
    }
    set separateReturnStack(separateReturnStack) {
      this.#separateReturnStack = separateReturnStack;
      save("separateReturnStack", separateReturnStack);
      send("separateReturnStackChanged");
    }
    set separateMemoryControlStack(separateMemoryControlStack) {
      this.#separateMemoryControlStack = separateMemoryControlStack;
      save("separateMemoryControlStack", separateMemoryControlStack);
      send("separateMemoryControlStackChanged");
    }
    set separateSubroutineRegisterStack(separateSubroutineRegisterStack) {
      this.#separateSubroutineRegisterStack = separateSubroutineRegisterStack;
      save("separateSubroutineRegisterStack", separateSubroutineRegisterStack);
      send("separateSubroutineRegisterStackChanged");
    }
    undo() {
    }
    redo() {
    }
    cut() {
    }
    copy() {
    }
    paste() {
    }
    selectAll() {
    }
    async saveSettings() {
      const response = await fetch("/status");
      const user = response.ok ? await response.json() : null;
      if (user) {
        const settings = {
          language: this.language,
          mode: this.mode,
          editorFontFamily: this.editorFontFamily,
          editorFontSize: this.editorFontSize,
          outputFontFamily: this.outputFontFamily,
          outputFontSize: this.outputFontSize,
          includeCommentsInExamples: this.includeCommentsInExamples,
          loadCorrespondingExample: this.loadCorrespondingExample,
          assembler: this.assembler,
          decimal: this.decimal,
          autoCompileOnLoad: this.autoCompileOnLoad,
          autoRunOnLoad: this.autoRunOnLoad,
          autoFormatOnLoad: this.autoFormatOnLoad,
          alwaysSaveSettings: this.alwaysSaveSettings,
          showCanvasOnRun: this.showCanvasOnRun,
          showOutputOnWrite: this.showOutputOnWrite,
          showMemoryOnDump: this.showMemoryOnDump,
          drawCountMax: this.drawCountMax,
          codeCountMax: this.codeCountMax,
          smallSize: this.smallSize,
          stackSize: this.stackSize,
          traceOnRun: this.traceOnRun,
          activateHCLR: this.activateHCLR,
          preventStackCollision: this.preventStackCollision,
          rangeCheckArrays: this.rangeCheckArrays,
          canvasStartSize: this.canvasStartSize,
          setupDefaultKeyBuffer: this.setupDefaultKeyBuffer,
          turtleAttributesAsGlobals: this.turtleAttributesAsGlobals,
          initialiseLocals: this.initialiseLocals,
          allowCSTR: this.allowCSTR,
          separateReturnStack: this.separateReturnStack,
          separateMemoryControlStack: this.separateMemoryControlStack,
          separateSubroutineRegisterStack: this.separateSubroutineRegisterStack
        };
        const response2 = await fetch("/account/update-settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(settings)
        });
        if (response2.ok) {
          send("closeMenu", "system");
        } else {
          send("error", new SystemError("Your settings could not be saved. Please try again later."));
        }
      } else {
        send("error", new SystemError("You must be logged in to save your settings."));
      }
    }
    async loadSavedSettings() {
      const response = await fetch("/status");
      const user = response.ok ? await response.json() : null;
      if (user && user.systemSettings) {
        this.savedSettingsHaveBeenLoaded = true;
        this.language = user.systemSettings.language;
        this.mode = user.systemSettings.mode;
        this.editorFontFamily = user.systemSettings.editorFontFamily;
        this.editorFontSize = user.systemSettings.editorFontSize;
        this.outputFontFamily = user.systemSettings.outputFontFamily;
        this.outputFontSize = user.systemSettings.outputFontSize;
        this.includeCommentsInExamples = user.systemSettings.includeCommentsInExamples;
        this.loadCorrespondingExample = user.systemSettings.loadCorrespondingExample;
        this.assembler = user.systemSettings.assembler;
        this.decimal = user.systemSettings.decimal;
        this.autoCompileOnLoad = user.systemSettings.autoCompileOnLoad;
        this.autoRunOnLoad = user.systemSettings.autoRunOnLoad;
        this.autoFormatOnLoad = user.systemSettings.autoFormatOnLoad;
        this.alwaysSaveSettings = user.systemSettings.alwaysSaveSettings;
        this.showCanvasOnRun = user.systemSettings.showCanvasOnRun;
        this.showOutputOnWrite = user.systemSettings.showOutputOnWrite;
        this.showMemoryOnDump = user.systemSettings.showMemoryOnDump;
        this.drawCountMax = user.systemSettings.drawCountMax;
        this.codeCountMax = user.systemSettings.codeCountMax;
        this.smallSize = user.systemSettings.smallSize;
        this.stackSize = user.systemSettings.stackSize;
        this.traceOnRun = user.systemSettings.traceOnRun;
        this.activateHCLR = user.systemSettings.activateHCLR;
        this.preventStackCollision = user.systemSettings.preventStackCollision;
        this.rangeCheckArrays = user.systemSettings.rangeCheckArrays;
        this.canvasStartSize = user.systemSettings.canvasStartSize;
        this.setupDefaultKeyBuffer = user.systemSettings.setupDefaultKeyBuffer;
        this.turtleAttributesAsGlobals = user.systemSettings.turtleAttributesAsGlobals;
        this.initialiseLocals = user.systemSettings.initialiseLocals;
        this.allowCSTR = user.systemSettings.allowCSTR;
        this.separateReturnStack = user.systemSettings.separateReturnStack;
        this.separateMemoryControlStack = user.systemSettings.separateMemoryControlStack;
        this.separateSubroutineRegisterStack = user.systemSettings.separateSubroutineRegisterStack;
      }
    }
    resetDefaults() {
      this.language = defaults.language;
      this.mode = defaults.mode;
      this.editorFontFamily = defaults.editorFontFamily;
      this.editorFontSize = defaults.editorFontSize;
      this.outputFontFamily = defaults.outputFontFamily;
      this.outputFontSize = defaults.outputFontSize;
      this.includeCommentsInExamples = defaults.includeCommentsInExamples;
      this.loadCorrespondingExample = defaults.loadCorrespondingExample;
      this.assembler = defaults.assembler;
      this.decimal = defaults.decimal;
      this.autoCompileOnLoad = defaults.autoCompileOnLoad;
      this.autoRunOnLoad = defaults.autoRunOnLoad;
      this.autoFormatOnLoad = defaults.autoFormatOnLoad;
      this.alwaysSaveSettings = defaults.alwaysSaveSettings;
      this.showCanvasOnRun = defaults.showCanvasOnRun;
      this.showOutputOnWrite = defaults.showOutputOnWrite;
      this.showMemoryOnDump = defaults.showMemoryOnDump;
      this.drawCountMax = defaults.drawCountMax;
      this.codeCountMax = defaults.codeCountMax;
      this.smallSize = defaults.smallSize;
      this.stackSize = defaults.stackSize;
      this.traceOnRun = defaults.traceOnRun;
      this.activateHCLR = defaults.activateHCLR;
      this.preventStackCollision = defaults.preventStackCollision;
      this.rangeCheckArrays = defaults.rangeCheckArrays;
      this.canvasStartSize = defaults.canvasStartSize;
      this.setupDefaultKeyBuffer = defaults.setupDefaultKeyBuffer;
      this.turtleAttributesAsGlobals = defaults.turtleAttributesAsGlobals;
      this.initialiseLocals = defaults.initialiseLocals;
      this.allowCSTR = defaults.allowCSTR;
      this.separateReturnStack = defaults.separateReturnStack;
      this.separateMemoryControlStack = defaults.separateMemoryControlStack;
      this.separateSubroutineRegisterStack = defaults.separateSubroutineRegisterStack;
      send("closeMenu", "system");
    }
    addFile(file) {
      halt();
      if (this.file && this.file.code === "" && this.file.edited === false) {
        this.files[this.currentFileIndex] = file;
        this.files = this.files;
        send("currentFileIndexChanged");
      } else {
        this.files.push(file);
        this.files = this.files;
        this.currentFileIndex = this.files.length - 1;
        this.code = file.code;
      }
      send("closeMenu", "system");
    }
    closeCurrentFile() {
      halt();
      this.files = this.files.slice(0, this.currentFileIndex).concat(this.files.slice(this.currentFileIndex + 1));
      if (this.files.length === 0) {
        this.newFile();
      } else if (this.currentFileIndex > this.files.length - 1) {
        this.currentFileIndex = this.currentFileIndex - 1;
      } else {
        this.currentFileIndex = this.currentFileIndex;
      }
      send("closeMenu", "system");
    }
    newFile(skeleton = false) {
      const file = new File(this.language);
      if (skeleton) {
        file.code = skeletons[this.language];
      }
      this.addFile(file);
    }
    openFile(filename, content, example = null) {
      const file = new File(this.language, example);
      const bits = filename.split(".");
      const ext = bits.pop();
      const name = bits.join(".");
      let json;
      switch (ext) {
        case "tbas":
        case "tgb":
          file.language = "BASIC";
          file.name = name;
          file.code = content.trim();
          break;
        case "tc":
          file.language = "C";
          file.name = name;
          file.code = content.trim();
          break;
        case "tjav":
          file.language = "Java";
          file.name = name;
          file.code = content.trim();
          break;
        case "tpas":
        case "tgp":
          file.language = "Pascal";
          file.name = name;
          file.code = content.trim();
          break;
        case "tpy":
        case "tgy":
          file.language = "Python";
          file.name = name;
          file.code = content.trim();
          break;
        case "tts":
          file.language = "TypeScript";
          file.name = name;
          file.code = content.trim();
          break;
        case "tmx":
        case "tgx":
          try {
            json = JSON.parse(content);
            if (json.language && json.name && json.code && json.usage && json.pcode) {
              file.language = json.language;
              file.name = json.name;
              file.code = json.code.trim();
            } else {
              send("error", new SystemError("Invalid TMX file."));
            }
          } catch (ignore) {
            send("error", new SystemError("Invalid TMX file."));
          }
          break;
        case "tmj":
        case "tmb":
        default:
          throw new SystemError("Invalid file type.");
      }
      this.addFile(file);
      if (json) {
        this.lexemes = lexify(json.code.trim(), this.language);
        this.program = parser(this.lexemes, this.language);
        this.usage = json.usage;
        this.pcode = json.pcode;
        this.file.compiled = true;
      }
    }
    openLocalFile() {
      const state = this;
      const fileInput = input({
        type: "file",
        on: ["change", function() {
          if (fileInput.files) {
            const file = fileInput.files[0];
            const fr = new FileReader();
            fr.onload = function() {
              state.openFile(file.name, fr.result);
            };
            fr.readAsText(file);
          }
        }]
      });
      fileInput.click();
    }
    openRemoteFile(url) {
      send("error", new SystemError("Feature not yet available."));
    }
    openExampleFile(exampleId) {
      const example = examples.find((x) => x.id === exampleId);
      if (!example) {
        send("error", new SystemError(`Unknown example "${exampleId}".`));
      } else {
        const filename = `${example.id}.${extensions[this.language]}`;
        window.fetch(`/examples/${this.language}/${example.groupId}/${filename}`).then((response) => {
          if (response.ok) {
            response.text().then((content) => {
              this.openFile(filename, content.trim(), exampleId);
            });
          } else {
            send("error", new SystemError(`Example "${exampleId}" is not available for Turtle ${this.language}.`));
          }
        });
      }
    }
    openExampleGroup(groupId) {
      const group = groups.find((x) => x.id === groupId);
      if (!group) {
        send("error", new SystemError(`Group ID ${groupId} not found.`));
      } else {
        for (const example of group.examples) {
          this.openExampleFile(example.id);
        }
      }
    }
    saveLocalFile() {
      const a2 = document.createElement("a");
      const blob = new window.Blob([this.file.code], { type: "text/plain;charset=utf-8" });
      a2.setAttribute("href", URL.createObjectURL(blob));
      a2.setAttribute("download", this.file.filename);
      a2.click();
    }
    saveRemoteFile() {
      send("error", new SystemError("Feature not yet available."));
    }
    compileCurrentFile() {
      this.file.language = this.language;
      try {
        this.tokens = tokenize(this.code, this.language);
        this.lexemes = lexify(this.tokens, this.language);
        this.program = parser(this.lexemes, this.language);
        this.usage = analyse_default(this.lexemes, this.program);
        this.pcode = program2(this.program, this.compilerOptions);
        this.file.language = this.language;
        this.file.compiled = true;
        this.files = this.files;
      } catch (error) {
        send("error", error);
      }
    }
    backupCode() {
      this.file.backup = this.file.code;
    }
    restoreCode() {
      if (this.file.code !== this.file.backup) {
        this.file.compiled = false;
      }
      this.file.code = this.file.backup;
    }
    dumpMemory() {
      send("memoryDumped", dump());
    }
    playPauseMachine() {
      if (isRunning()) {
        if (isPaused()) {
          play();
        } else {
          pause();
        }
      } else {
        if (!this.file.compiled) {
          this.compileCurrentFile();
        }
        if (this.file.compiled) {
          run(this.pcode, this.machineOptions);
        }
      }
      send("closeMenu", "system");
    }
  };
  var state_default = new State();

  // client/components/view.ts
  function toggleMenu(id) {
    const menu = document.querySelector(`[data-menu="${id}"]`);
    if (menu) {
      if (menu.classList.contains("open")) {
        closeMenu(id);
      } else {
        openMenu(id);
      }
    }
  }
  function openMenu(id) {
    const a2 = document.querySelector(`[data-action="toggleMenu"][data-arg="${id}"]`);
    const menu = document.querySelector(`[data-menu="${id}"]`);
    if (a2 && menu) {
      switch (id) {
        case "user":
          closeMenu("site");
          break;
        case "site":
        case "documentation":
          closeMenu("user");
          break;
      }
      a2.classList.add("open");
      menu.classList.add("open");
      const caret = a2.querySelector(".fa-caret-down");
      if (caret) {
        caret.classList.remove("fa-caret-down");
        caret.classList.add("fa-caret-up");
      }
    }
  }
  function closeMenu(id) {
    const a2 = document.querySelector(`[data-action="toggleMenu"][data-arg="${id}"]`);
    const menu = document.querySelector(`[data-menu="${id}"]`);
    if (a2 && menu) {
      for (const subMenu of menu.querySelectorAll("[data-menu]")) {
        closeMenu(subMenu.dataset.menu);
      }
      for (const subMenu of menu.querySelectorAll("[data-system-menu]")) {
        closeSystemMenu(subMenu.dataset.systemMenu);
      }
      menu.classList.remove("open");
      a2.classList.remove("open");
      const caret = a2.querySelector(".fa-caret-up");
      if (caret) {
        caret.classList.remove("fa-caret-up");
        caret.classList.add("fa-caret-down");
      }
    }
  }
  function toggleSystemMenu(id) {
    const menu = document.querySelector(`[data-system-menu="${id}"]`);
    if (menu) {
      if (menu.classList.contains("open")) {
        closeSystemMenu(id);
      } else {
        openSystemMenu(id);
      }
    }
  }
  function openSystemMenu(id) {
    const a2 = document.querySelector(`[data-action="toggleSystemMenu"][data-arg="${id}"]`);
    const menu = document.querySelector(`[data-system-menu="${id}"]`);
    if (a2 && menu) {
      openMenu("system");
      const subMenus = a2.parentElement?.parentElement?.querySelectorAll('[data-action="toggleSystemMenu"]');
      for (const subMenu of subMenus || []) {
        const id2 = subMenu.dataset.arg;
        closeSystemMenu(id2);
      }
      a2.classList.add("open");
      menu.classList.add("open");
    }
  }
  function closeSystemMenu(id) {
    const a2 = document.querySelector(`[data-action="toggleSystemMenu"][data-arg="${id}"]`);
    const menu = document.querySelector(`[data-system-menu="${id}"]`);
    if (a2 && menu) {
      a2.classList.remove("open");
      menu.classList.remove("open");
    }
  }
  function selectTab(id) {
    for (const select of document.querySelectorAll('[data-action="selectTab"]')) {
      for (const option2 of select.children) {
        if (option2.value === id)
          option2.selected = true;
      }
    }
    for (const tabPane of document.querySelectorAll(`[data-tab="${id}"]`)) {
      if (tabPane.parentElement) {
        for (const sibling of tabPane.parentElement.children) {
          sibling.classList.remove("active");
        }
      }
      tabPane.classList.add("active");
    }
  }

  // client/components/actions.ts
  var notImplemented = new SystemError("This feature has not yet been implemented in the online system.");
  for (const element2 of document.querySelectorAll("[data-action]")) {
    const el = element2;
    switch (el.dataset.action) {
      case "toggleMenu":
        el.addEventListener("click", function() {
          el.blur();
          if (el.dataset.arg) {
            toggleMenu(el.dataset.arg);
          }
        });
        on("toggleMenu", toggleMenu);
        break;
      case "openMenu":
        el.addEventListener("click", function() {
          el.blur();
          if (el.dataset.arg) {
            openMenu(el.dataset.arg);
          }
        });
        on("openMenu", openMenu);
        break;
      case "closeMenu":
        el.addEventListener("click", function() {
          el.blur();
          if (el.dataset.arg) {
            closeMenu(el.dataset.arg);
          }
        });
        on("closeMenu", closeMenu);
        break;
      case "closeSiteMenus":
        el.addEventListener("click", function() {
          closeMenu("site");
          closeMenu("documentation");
          closeMenu("user");
        });
        break;
      case "toggleSystemMenu":
        el.addEventListener("click", function() {
          el.blur();
          if (el.dataset.arg) {
            toggleSystemMenu(el.dataset.arg);
          }
        });
        on("toggleSystemMenu", toggleSystemMenu);
        break;
      case "openSystemMenu":
        el.addEventListener("click", function() {
          el.blur();
          if (el.dataset.arg) {
            openSystemMenu(el.dataset.arg);
          }
        });
        on("openSystemMenu", openSystemMenu);
        break;
      case "closeSystemMenu":
        el.addEventListener("click", function() {
          el.blur();
          if (el.dataset.arg) {
            closeSystemMenu(el.dataset.arg);
          }
        });
        on("closeSystemMenu", closeSystemMenu);
        break;
      case "selectTab":
        el.addEventListener("change", function() {
          el.blur();
          selectTab(el.value);
        });
        on("selectTab", selectTab);
        break;
      case "maximize":
        el.addEventListener("click", function() {
          el.blur();
          document.body.classList.toggle("fullscreen");
          if (document.body.classList.contains("fullscreen")) {
            fill(el, [i({ className: "fa fa-compress", title: "Expand down" })]);
          } else {
            fill(el, [i({ className: "fa fa-expand", title: "Maximize" })]);
          }
        });
        break;
      case "newProgram":
        el.addEventListener("click", function() {
          state_default.newFile();
        });
        break;
      case "newSkeletonProgram":
        el.addEventListener("click", function() {
          state_default.newFile(true);
        });
        break;
      case "openProgram":
        el.addEventListener("click", function() {
          state_default.openLocalFile();
        });
        break;
      case "saveProgram":
        el.addEventListener("click", function() {
          state_default.saveLocalFile();
        });
        break;
      case "saveExportFile":
        el.addEventListener("click", function() {
          send("error", notImplemented);
        });
        break;
      case "closeProgram":
        el.addEventListener("click", function() {
          state_default.closeCurrentFile();
        });
        break;
      case "copyCanvasGraphic":
        el.addEventListener("click", function() {
          send("error", notImplemented);
        });
        break;
      case "saveCanvasGraphic":
        el.addEventListener("click", function() {
          send("error", notImplemented);
        });
        break;
      case "printProgram":
        el.addEventListener("click", function() {
          send("error", notImplemented);
        });
        break;
      case "printOutputText":
        el.addEventListener("click", function() {
          send("error", notImplemented);
        });
        break;
      case "printConsoleText":
        el.addEventListener("click", function() {
          send("error", notImplemented);
        });
        break;
      case "undo":
        el.addEventListener("click", function() {
          state_default.undo();
        });
        break;
      case "redo":
        el.addEventListener("click", function() {
          state_default.redo();
        });
        break;
      case "cut":
        el.addEventListener("click", function() {
          state_default.cut();
        });
        break;
      case "copy":
        el.addEventListener("click", function() {
          state_default.copy();
        });
        break;
      case "paste":
        el.addEventListener("click", function() {
          state_default.paste();
        });
        break;
      case "selectAll":
        el.addEventListener("click", function() {
          state_default.selectAll();
        });
        break;
      case "findAndReplace":
        el.addEventListener("click", function() {
          send("error", notImplemented);
        });
        break;
      case "autoFormat":
        el.addEventListener("click", function() {
          send("error", notImplemented);
        });
        break;
      case "storeCopy":
        el.addEventListener("click", function() {
          state_default.backupCode();
        });
        break;
      case "restoreCopy":
        el.addEventListener("click", function() {
          state_default.restoreCode();
        });
        break;
      case "compile":
        el.addEventListener("click", function() {
          state_default.compileCurrentFile();
        });
        break;
      case "savePCodeJson":
        el.addEventListener("click", function() {
          send("error", notImplemented);
        });
        break;
      case "savePCodeBinary":
        el.addEventListener("click", function() {
          send("error", notImplemented);
        });
        break;
      case "run":
        el.addEventListener("click", function() {
          el.blur();
          state_default.playPauseMachine();
        });
        break;
      case "halt":
        el.addEventListener("click", function() {
          el.blur();
          halt();
        });
        break;
      case "pause":
        el.addEventListener("click", function() {
          el.blur();
          pause();
        });
        break;
      case "resetMachine":
        el.addEventListener("click", function() {
          el.blur();
          reset();
          closeMenu("system");
        });
        break;
      case "viewMachineOptions":
        el.addEventListener("click", function() {
          send("selectTab", "options");
          closeMenu("system");
        });
        break;
      case "loadAndRunPCode":
        el.addEventListener("click", function() {
          send("error", notImplemented);
        });
        break;
      case "saveSettings":
        el.addEventListener("click", function() {
          state_default.saveSettings();
        });
        break;
      case "resetSettings":
        el.addEventListener("click", function() {
          state_default.resetDefaults();
        });
        break;
      case "dumpMemory":
        el.addEventListener("click", function() {
          el.blur();
          state_default.dumpMemory();
        });
        break;
      default:
        console.error(`Unknown action '${el.dataset.action}'.`);
        break;
    }
  }

  // client/components/bindings.ts
  for (const element2 of document.querySelectorAll("[data-binding]")) {
    switch (element2.dataset.binding) {
      case "language":
        fillLanguage(element2);
        element2.addEventListener("change", function() {
          state_default.language = element2.value;
        });
        on("languageChanged", function() {
          element2.value = state_default.language;
        });
        break;
      case "mode":
        element2.addEventListener("change", function() {
          if (element2.checked) {
            state_default.mode = element2.value;
          }
        });
        on("modeChanged", function() {
          if (element2.value === state_default.mode) {
            element2.checked = true;
          }
        });
        break;
      case "editorFontFamily":
        fillFont(element2);
        element2.addEventListener("change", function() {
          state_default.editorFontFamily = element2.value;
        });
        on("editorFontFamilyChanged", function() {
          element2.value = state_default.editorFontFamily;
        });
        break;
      case "editorFontSize":
        element2.addEventListener("change", function() {
          state_default.editorFontSize = parseInt(element2.value);
        });
        on("editorFontSizeChanged", function() {
          element2.value = state_default.editorFontSize.toString(10);
        });
        break;
      case "outputFontFamily":
        fillFont(element2);
        element2.addEventListener("change", function() {
          state_default.outputFontFamily = element2.value;
        });
        on("outputFontFamilyChanged", function() {
          element2.value = state_default.outputFontFamily;
        });
        break;
      case "outputFontSize":
        element2.addEventListener("change", function() {
          state_default.outputFontSize = parseInt(element2.value);
        });
        on("outputFontSizeChanged", function() {
          element2.value = state_default.outputFontSize.toString(10);
        });
        break;
      case "includeCommentsInExamples":
        disableInput(element2);
        element2.addEventListener("change", function() {
          state_default.includeCommentsInExamples = element2.checked;
        });
        on("includeCommentsInExamplesChanged", function() {
          element2.checked = state_default.includeCommentsInExamples;
        });
        break;
      case "loadCorrespondingExample":
        element2.addEventListener("change", function() {
          state_default.loadCorrespondingExample = element2.checked;
        });
        on("loadCorrespondingExampleChanged", function() {
          element2.checked = state_default.loadCorrespondingExample;
        });
        break;
      case "assembler":
        element2.addEventListener("change", function() {
          if (element2.checked) {
            state_default.assembler = element2.value === "assembler";
          }
        });
        on("assemblerChanged", function() {
          if (state_default.assembler) {
            element2.checked = element2.value === "assembler";
          } else {
            element2.checked = element2.value !== "assembler";
          }
        });
        break;
      case "decimal":
        element2.addEventListener("change", function() {
          if (element2.checked) {
            state_default.decimal = element2.value === "decimal";
          }
        });
        on("decimalChanged", function() {
          if (state_default.decimal) {
            element2.checked = element2.value === "decimal";
          } else {
            element2.checked = element2.value !== "decimal";
          }
        });
        break;
      case "autoCompileOnLoad":
        disableInput(element2);
        element2.addEventListener("change", function() {
          state_default.autoCompileOnLoad = element2.checked;
        });
        on("autoCompileOnLoadChanged", function() {
          element2.checked = state_default.autoCompileOnLoad;
        });
        break;
      case "autoRunOnLoad":
        disableInput(element2);
        element2.addEventListener("change", function() {
          state_default.autoRunOnLoad = element2.checked;
        });
        on("autoRunOnLoadChanged", function() {
          element2.checked = state_default.autoRunOnLoad;
        });
        break;
      case "autoFormatOnLoad":
        disableInput(element2);
        element2.addEventListener("change", function() {
          state_default.autoFormatOnLoad = element2.checked;
        });
        on("autoFormatOnLoadChanged", function() {
          element2.checked = state_default.autoFormatOnLoad;
        });
        break;
      case "alwaysSaveSettings":
        disableInputIfNotLoggedIn(element2);
        element2.addEventListener("change", function() {
          state_default.alwaysSaveSettings = element2.checked;
        });
        on("alwaysSaveSettingsChanged", function() {
          element2.checked = state_default.alwaysSaveSettings;
        });
        break;
      case "commandsCategoryIndex":
        fillCommandsCategory(element2);
        element2.addEventListener("change", function() {
          state_default.commandsCategoryIndex = parseInt(element2.value);
        });
        on("commandsCategoryIndexChanged", function() {
          element2.value = state_default.commandsCategoryIndex.toString(10);
        });
        break;
      case "showSimpleCommands":
        element2.addEventListener("change", function() {
          state_default.showSimpleCommands = element2.checked;
        });
        on("showSimpleCommandsChanged", function() {
          element2.checked = state_default.showSimpleCommands;
        });
        break;
      case "showIntermediateCommands":
        element2.addEventListener("change", function() {
          state_default.showIntermediateCommands = element2.checked;
        });
        on("showIntermediateCommandsChanged", function() {
          element2.checked = state_default.showIntermediateCommands;
        });
        break;
      case "showAdvancedCommands":
        element2.addEventListener("change", function() {
          state_default.showAdvancedCommands = element2.checked;
        });
        on("showAdvancedCommandsChanged", function() {
          element2.checked = state_default.showAdvancedCommands;
        });
        break;
      case "currentFileIndex":
        fillFile(element2);
        element2.addEventListener("change", function() {
          state_default.currentFileIndex = parseInt(element2.value);
        });
        on("filesChanged", function() {
          fillFile(element2);
        });
        on("currentFileIndexChanged", function() {
          element2.value = state_default.currentFileIndex.toString(10);
        });
        break;
      case "filename":
        element2.addEventListener("change", function() {
          state_default.filename = element2.value;
        });
        on("filenameChanged", function() {
          element2.value = state_default.filename;
        });
        break;
      case "showCanvasOnRun":
        element2.addEventListener("change", function() {
          state_default.showCanvasOnRun = element2.checked;
        });
        on("showCanvasOnRunChanged", function() {
          element2.checked = state_default.showCanvasOnRun;
        });
        break;
      case "showOutputOnWrite":
        element2.addEventListener("change", function() {
          state_default.showOutputOnWrite = element2.checked;
        });
        on("showOutputOnWriteChanged", function() {
          element2.checked = state_default.showOutputOnWrite;
        });
        break;
      case "showMemoryOnDump":
        element2.addEventListener("change", function() {
          state_default.showMemoryOnDump = element2.checked;
        });
        on("showMemoryOnDumpChanged", function() {
          element2.checked = state_default.showMemoryOnDump;
        });
        break;
      case "drawCountMax":
        element2.addEventListener("change", function() {
          state_default.drawCountMax = parseInt(element2.value);
        });
        on("drawCountMaxChanged", function() {
          element2.value = state_default.drawCountMax.toString(10);
        });
        break;
      case "codeCountMax":
        element2.addEventListener("change", function() {
          state_default.codeCountMax = parseInt(element2.value);
        });
        on("codeCountMaxChanged", function() {
          element2.value = state_default.codeCountMax.toString(10);
        });
        break;
      case "smallSize":
        element2.addEventListener("change", function() {
          state_default.smallSize = parseInt(element2.value);
        });
        on("smallSizeChanged", function() {
          element2.value = state_default.smallSize.toString(10);
        });
        break;
      case "stackSize":
        element2.addEventListener("change", function() {
          state_default.stackSize = parseInt(element2.value);
        });
        on("stackSizeChanged", function() {
          element2.value = state_default.stackSize.toString(10);
        });
        break;
      case "traceOnRun":
        disableInput(element2);
        element2.addEventListener("change", function() {
          state_default.traceOnRun = element2.checked;
        });
        on("traceOnRunChanged", function() {
          element2.checked = state_default.traceOnRun;
        });
        break;
      case "activateHCLR":
        disableInput(element2);
        element2.addEventListener("change", function() {
          state_default.activateHCLR = element2.checked;
        });
        on("activateHCLRChanged", function() {
          element2.checked = state_default.activateHCLR;
        });
        break;
      case "preventStackCollision":
        disableInput(element2);
        element2.addEventListener("change", function() {
          state_default.preventStackCollision = element2.checked;
        });
        on("preventStackCollisionChanged", function() {
          element2.checked = state_default.preventStackCollision;
        });
        break;
      case "rangeCheckArrays":
        disableInput(element2);
        element2.addEventListener("change", function() {
          state_default.rangeCheckArrays = element2.checked;
        });
        on("rangeCheckArraysChanged", function() {
          element2.checked = state_default.rangeCheckArrays;
        });
        break;
      case "canvasStartSize":
        element2.addEventListener("change", function() {
          if (element2.checked) {
            state_default.canvasStartSize = parseInt(element2.value);
          }
        });
        on("canvasStartSizeChanged", function() {
          if (element2.value === state_default.canvasStartSize.toString(10)) {
            element2.checked = true;
          }
        });
        break;
      case "setupDefaultKeyBuffer":
        disableInput(element2);
        element2.addEventListener("change", function() {
          state_default.setupDefaultKeyBuffer = element2.checked;
        });
        on("setupDefaultKeyBufferChanged", function() {
          element2.checked = state_default.setupDefaultKeyBuffer;
        });
        break;
      case "turtleAttributesAsGlobals":
        disableInput(element2);
        element2.addEventListener("change", function() {
          state_default.turtleAttributesAsGlobals = element2.checked;
        });
        on("turtleAttributesAsGlobalsChanged", function() {
          element2.checked = state_default.turtleAttributesAsGlobals;
        });
        break;
      case "initialiseLocals":
        disableInput(element2);
        element2.addEventListener("change", function() {
          state_default.initialiseLocals = element2.checked;
        });
        on("initialiseLocalsChanged", function() {
          element2.checked = state_default.initialiseLocals;
        });
        break;
      case "allowCSTR":
        disableInput(element2);
        element2.addEventListener("change", function() {
          state_default.allowCSTR = element2.checked;
        });
        on("allowCSTRChanged", function() {
          element2.checked = state_default.allowCSTR;
        });
        break;
      case "separateReturnStack":
        disableInput(element2);
        element2.addEventListener("change", function() {
          state_default.separateReturnStack = element2.checked;
        });
        on("separateReturnStackChanged", function() {
          element2.checked = state_default.separateReturnStack;
        });
        break;
      case "separateMemoryControlStack":
        disableInput(element2);
        element2.addEventListener("change", function() {
          state_default.separateMemoryControlStack = element2.checked;
        });
        on("separateMemoryControlStackChanged", function() {
          element2.checked = state_default.separateMemoryControlStack;
        });
        break;
      case "separateSubroutineRegisterStack":
        disableInput(element2);
        element2.addEventListener("change", function() {
          state_default.separateSubroutineRegisterStack = element2.checked;
        });
        on("separateSubroutineRegisterStackChanged", function() {
          element2.checked = state_default.separateSubroutineRegisterStack;
        });
        break;
      default:
        console.error(`Unknown data binding '${element2.dataset.binding}'.`);
        break;
    }
  }
  function fillLanguage(input3) {
    fill(input3, languages.map((x) => option({ value: x, content: `Turtle ${x}` })));
  }
  function fillFont(input3) {
    fill(input3, [
      option({ value: "Consolas", content: "Consolas" }),
      option({ value: "Courier", content: "Courier" }),
      option({ value: "Lucida Sans Typewriter", content: "Lucida Sans Typewriter" }),
      option({ value: "Monospace", content: "Monospace" })
    ]);
  }
  function fillCommandsCategory(input3) {
    fill(input3, commandCategories.map((x) => option({ value: x.index.toString(10), content: `${(x.index + 1).toString(10)}. ${x.title}` })));
  }
  function fillFile(input3) {
    fill(input3, state_default.files.map((file, index) => option({
      value: index.toString(10),
      content: `${(index + 1).toString(10).padStart(2, "0")} [${file.language}] ${file.name || "[no name]"}`,
      selected: state_default.currentFileIndex === index ? "selected" : void 0
    })));
  }
  function disableInput(input3) {
    input3.setAttribute("disabled", "disabled");
    if (input3.parentElement) {
      input3.parentElement.addEventListener("click", function() {
        send("error", new SystemError("This option cannot yet be modified in the online system."));
      });
    }
  }
  async function disableInputIfNotLoggedIn(input3) {
    const response = await fetch("/status");
    const user = response.ok ? await response.json() : null;
    if (user === null) {
      input3.setAttribute("disabled", "disabled");
      if (input3.parentElement) {
        input3.parentElement.addEventListener("click", function() {
          send("error", new SystemError("You must be logged in to change this setting."));
        });
      }
    }
  }

  // client/components/download.ts
  var download_default = init2();
  function init2() {
    const versionSelect = document.getElementById("version-select");
    const downloadLink = document.getElementById("download-link");
    if (versionSelect && downloadLink) {
      versionSelect.addEventListener("change", () => {
        const bits = downloadLink.href.split("/");
        bits.pop();
        bits.push(versionSelect.value);
        downloadLink.setAttribute("href", bits.join("/"));
      });
    }
  }

  // client/lexer/highlight.ts
  function highlight(code3, language2) {
    const tokens = typeof code3 === "string" ? tokenize(code3, language2) : code3;
    return tokens.map((token) => {
      switch (token.type) {
        case "spaces":
        case "newline":
          return token.content;
        case "unterminated-comment":
        case "unterminated-string":
        case "bad-binary":
        case "bad-octal":
        case "bad-hexadecimal":
        case "real":
        case "bad-keycode":
        case "bad-query":
        case "illegal":
          return `<span class="error">${token.content}</span>`;
        case "binary":
        case "octal":
        case "hexadecimal":
        case "decimal":
          return `<span class="integer">${token.content}</span>`;
        case "colour":
          const colour2 = colours.find((x) => x.names[language2] === token.content);
          return colour2 ? `<span class="colour" style="border-color:#${colour2.hex};">${token.content}</span>` : `<span class="colour">${token.content}</span>`;
        default:
          return `<span class="${token.type}">${token.content}</span>`;
      }
    }).join("");
  }

  // client/components/languages.ts
  var codeElements = document.querySelectorAll("code[data-language]");
  for (const code3 of codeElements) {
    code3.innerHTML = highlight(code3.innerText, code3.dataset.language);
  }
  on("languageChanged", language);
  function language() {
    const languageElements = document.querySelectorAll("[data-language]");
    for (const element2 of languageElements) {
      if (state_default.language === element2.dataset.language || element2.id === "turtle") {
        element2.classList.remove("hidden");
      } else {
        element2.classList.add("hidden");
      }
    }
  }

  // client/components/modes.ts
  on("modeChanged", mode);
  function mode() {
    const modeElements = document.querySelectorAll("[data-mode]");
    const guideToc = document.querySelector('[data-component="guide-toc"]');
    for (const element2 of modeElements) {
      if (element2.dataset.mode) {
        const modes = element2.dataset.mode.split(",");
        if (modes.includes(state_default.mode) || element2.id === "turtle") {
          element2.classList.remove("hidden");
        } else {
          element2.classList.add("hidden");
          if (element2.classList.contains("system-tab-pane") && element2.classList.contains("active")) {
            send("selectTab", "canvas");
          }
        }
      }
    }
    if (guideToc) {
      for (const child of guideToc.children) {
        if (state_default.mode === "simple" || state_default.mode === "normal") {
          switch (child.value) {
            case "the-compile-menu":
            case "the-tabs-menu":
              child.classList.add("hidden");
              break;
            case "the-run-menu":
              child.innerHTML = "8. The Run Menu";
              break;
            case "the-options-menu":
              child.innerHTML = "9. The Options Menu";
              break;
            case "the-examples-menu":
              child.innerHTML = "10. The Examples Menu";
              break;
          }
        } else {
          switch (child.value) {
            case "the-compile-menu":
            case "the-tabs-menu":
              child.classList.remove("hidden");
              break;
            case "the-run-menu":
              child.innerHTML = "10. The Run Menu";
              break;
            case "the-options-menu":
              child.innerHTML = "11. The Options Menu";
              break;
            case "the-examples-menu":
              child.innerHTML = "12. The Examples Menu";
              break;
          }
        }
      }
    }
  }

  // client/components/preview.ts
  var preview_default = init3();
  function init3() {
    const preview = document.querySelector("[data-preview]");
    if (preview && preview.dataset.preview) {
      const textarea = document.getElementById(preview.dataset.preview);
      textarea.addEventListener("change", (event) => {
        const element2 = event.currentTarget;
        preview.innerHTML = "<p>Dear <strong>{{ firstname }} {{ surname }}</strong>,</p>";
        preview.innerHTML += element2.value;
      });
    }
  }

  // client/components/reference/colours.ts
  var coloursTableBody = document.querySelector('[data-component="coloursTableBody"]');
  if (coloursTableBody) {
    on("languageChanged", updateTable);
  }
  function updateTable() {
    if (coloursTableBody) {
      coloursTableBody.innerHTML = "";
      for (let i2 = 0; i2 < 10; i2 += 1) {
        coloursTableBody.innerHTML += `<tr>${colours.slice(i2 * 5, i2 * 5 + 5).map(colourTableCells).join("")}</tr>`;
      }
    }
  }
  function colourTableCells(colour2) {
    return `
    <th>${colour2.index}</th>
    <td style="background:#${colour2.hex};color:${colour2.text}">
      ${colour2.names[state_default.language]}<br>${hex2(state_default.language, colour2.hex)}
    </td>`;
  }
  function hex2(language2, hex3) {
    switch (language2) {
      case "BASIC":
        return `&${hex3}`;
      case "Pascal":
        return `$${hex3}`;
      case "Python":
        return `0x${hex3}`;
    }
  }

  // client/components/reference/commands.ts
  var commandsTableBody = document.querySelector('[data-component="commandsTableBody"]');
  if (commandsTableBody) {
    on("languageChanged", updateTable2);
    on("commandsCategoryIndexChanged", updateTable2);
    on("showSimpleCommandsChanged", updateTable2);
    on("showIntermediateCommandsChanged", updateTable2);
    on("showAdvancedCommandsChanged", updateTable2);
  }
  function updateTable2() {
    if (commandsTableBody) {
      let commands2 = commandCategories[state_default.commandsCategoryIndex].expressions;
      if (!state_default.showSimpleCommands)
        commands2 = commands2.filter((x) => x.level !== 0);
      if (!state_default.showIntermediateCommands)
        commands2 = commands2.filter((x) => x.level !== 1);
      if (!state_default.showAdvancedCommands)
        commands2 = commands2.filter((x) => x.level !== 2);
      commands2 = commands2.filter((x) => x.names[state_default.language]);
      fill(commandsTableBody, commands2.map(commandTableRow));
    }
  }
  function commandTableRow(expression3) {
    const command2 = expression3;
    return tr({ content: [
      td({ content: [
        code({ content: highlight(command2.names[state_default.language], state_default.language) })
      ] }),
      td({ content: command2.parameters.map((x) => `<code>${highlight(x.name, state_default.language)}</code> (${x.type})`).join("<br>") }),
      td({ content: command2.returns || "-" }),
      td({ content: command2.description })
    ] });
  }

  // client/constants/cursors.ts
  var Cursor = class {
    constructor(index, name, css) {
      this.index = index;
      this.name = name;
      this.css = css;
    }
  };
  var cursors = [
    new Cursor(0, "None", "none"),
    new Cursor(1, "Default", "default"),
    new Cursor(2, "Pointer", "pointer"),
    new Cursor(3, "Crosshair", "crosshair"),
    new Cursor(4, "Text", "text"),
    new Cursor(5, "Move", "move"),
    new Cursor(6, "Resize NESW", "nesw-resize"),
    new Cursor(7, "Resize NS", "ns-resize"),
    new Cursor(8, "Resize NWSE", "nwse-resize"),
    new Cursor(9, "Resize EW", "ew-resize"),
    new Cursor(10, "Resize N", "n-resize"),
    new Cursor(11, "Wait", "wait"),
    new Cursor(12, "Progress", "progress"),
    new Cursor(13, "No Drop", "no-drop"),
    new Cursor(14, "Forbidden", "not-allowed"),
    new Cursor(15, "Help", "help")
  ];

  // client/components/reference/cursors.ts
  var cursorsTableBody = document.querySelector('[data-component="cursorsTableBody"]');
  if (cursorsTableBody) {
    on("languageChanged", updateTable3);
  }
  function updateTable3() {
    if (cursorsTableBody) {
      fill(cursorsTableBody, [
        tr({ content: cursors.slice(0, 4).map(cursorTableCells).join("") }),
        tr({ content: cursors.slice(4, 8).map(cursorTableCells).join("") }),
        tr({ content: cursors.slice(8, 12).map(cursorTableCells).join("") }),
        tr({ content: cursors.slice(12, 16).map(cursorTableCells).join("") })
      ]);
    }
  }
  function cursorTableCells(cursor) {
    return `<td>${cursor.index}</td><td style="cursor:${cursor.css}">${cursor.name}</td>`;
  }

  // client/constants/fonts.ts
  var Font = class {
    constructor(index, name, css) {
      this.index = index;
      this.name = name;
      this.css = css;
    }
  };
  var fonts = [
    new Font(0, "Arial", "Arial, sans-serif"),
    new Font(1, "Arial Black", '"Arial Black", sans-serif'),
    new Font(2, "Arial Narrow", '"Arial Narrow", sans-serif'),
    new Font(3, "Bookman Old Style", '"Bookman Old Style", serif'),
    new Font(4, "Comic Sans MS", '"Comic Sans MS", cursive, sans-serif'),
    new Font(5, "Courier New", '"Courier New", Courier, monospace'),
    new Font(6, "Georgia", "Georgia, serif"),
    new Font(7, "Lucida Bright", '"Lucida Bright", serif'),
    new Font(8, "Lucida Calligraphy", '"Lucida Calligraphy", cursive, serif'),
    new Font(9, "Lucida Handwriting", '"Lucida Handwriting", cursive, serif'),
    new Font(10, "Lucida Sans", '"Lucida Sans Unicode", sans-serif'),
    new Font(11, "Lucida Sans Typewriter", '"Lucida Sans Typewriter", sans-serif'),
    new Font(12, "Old English Text MT", '"Old English Text MT", serif'),
    new Font(13, "Symbol", "Symbol"),
    new Font(14, "Times New Roman", '"Times New Roman", Times, serif'),
    new Font(15, "Verdana", "Verdana, Geneva, sans-serif")
  ];

  // client/components/reference/fonts.ts
  var fontsTableBody = document.querySelector('[data-component="fontsTableBody"]');
  if (fontsTableBody) {
    on("languageChanged", updateTable4);
  }
  function updateTable4() {
    if (fontsTableBody) {
      fill(fontsTableBody, fonts.map(fontTableRow));
    }
  }
  function fontTableRow(font) {
    return tr({ style: `font-family: ${font.css};`, content: [
      td({ content: font.name }),
      td({ content: font.index.toString(10) }),
      td({ style: "font-style: italic;", content: (font.index + 16).toString(10) }),
      td({ style: "font-weight: bold;", content: (font.index + 32).toString(10) }),
      td({ style: "font-style: italic; font-weight: bold;", content: (font.index + 48).toString(10) }),
      td({ style: "text-decoration: underline;", content: (font.index + 64).toString(10) }),
      td({ style: "text-decoration: line-through;", content: (font.index + 128).toString(10) })
    ] });
  }

  // client/components/reference/keycodes.ts
  var keycodesTableBody = document.querySelector('[data-component="keycodesTableBody"]');
  if (keycodesTableBody) {
    on("languageChanged", updateTable5);
  }
  function updateTable5() {
    if (keycodesTableBody) {
      fill(keycodesTableBody, inputs.filter((x) => x.value > 0).map(keycodeTableRow));
    }
  }
  function keycodeTableRow(keycode2) {
    return tr({ content: [
      td({ content: [code({ content: keycode2.names[state_default.language] })] }),
      td({ content: keycode2.value.toString(10) })
    ] });
  }

  // client/components/system/canvas.ts
  var canvas2 = document.querySelector('[data-component="canvas"]');
  var xcoords = document.querySelector('[data-component="canvasXCoords"]');
  var ycoords = document.querySelector('[data-component="canvasYCoords"]');
  if (canvas2 && xcoords && ycoords) {
    const context2 = canvas2.getContext("2d");
    const xcoords1 = xcoords.querySelector(":nth-child(1)");
    const xcoords2 = xcoords.querySelector(":nth-child(2)");
    const xcoords3 = xcoords.querySelector(":nth-child(3)");
    const xcoords4 = xcoords.querySelector(":nth-child(4)");
    const xcoords5 = xcoords.querySelector(":nth-child(5)");
    const ycoords1 = ycoords.querySelector(":nth-child(1)");
    const ycoords2 = ycoords.querySelector(":nth-child(2)");
    const ycoords3 = ycoords.querySelector(":nth-child(3)");
    const ycoords4 = ycoords.querySelector(":nth-child(4)");
    const ycoords5 = ycoords.querySelector(":nth-child(5)");
    setCanvasAndContext(canvas2, context2);
    on("resolution", function(data) {
      canvas2.style.imageRendering = data.width < 500 || data.height < 500 ? "pixelated" : "auto";
      canvas2.width = data.width;
      canvas2.height = data.height;
    });
    on("canvas", function(data) {
      xcoords1.innerHTML = data.startx.toString(10);
      xcoords2.innerHTML = Math.round((data.startx + data.sizex) / 4).toString(10);
      xcoords3.innerHTML = Math.round((data.startx + data.sizex) / 2).toString(10);
      xcoords4.innerHTML = Math.round((data.startx + data.sizex) / 4 * 3).toString(10);
      xcoords5.innerHTML = Math.round(data.startx + data.sizex - 1).toString(10);
      ycoords1.innerHTML = data.starty.toString(10);
      ycoords2.innerHTML = Math.round((data.starty + data.sizey) / 4).toString(10);
      ycoords3.innerHTML = Math.round((data.starty + data.sizey) / 2).toString(10);
      ycoords4.innerHTML = Math.round((data.starty + data.sizey) / 4 * 3).toString(10);
      ycoords5.innerHTML = Math.round(data.starty + data.sizey - 1).toString(10);
    });
    on("cursor", function(code3) {
      const corrected = code3 < 0 || code3 > 15 ? 1 : code3;
      canvas2.style.cursor = cursors[corrected].css;
    });
    on("print", function(data) {
      context2.textBaseline = "hanging";
      context2.fillStyle = data.turtle.c;
      context2.font = `${data.size}pt ${fonts[data.font & 15].css}`;
      if ((data.font & 16) > 0) {
        context2.font = `bold ${context2.font}`;
      }
      if ((data.font & 32) > 0) {
        context2.font = `italic ${context2.font}`;
      }
      if ((data.font & 64) > 0) {
      }
      if ((data.font & 128) > 0) {
      }
      context2.fillText(data.string, data.turtle.x, data.turtle.y);
    });
    on("line", function(data) {
      context2.beginPath();
      context2.moveTo(data.turtle.x, data.turtle.y);
      context2.lineTo(data.x, data.y);
      context2.lineCap = "round";
      context2.lineWidth = Math.abs(data.turtle.p);
      context2.strokeStyle = data.turtle.c;
      context2.stroke();
    });
    on("poly", function(data) {
      context2.beginPath();
      data.coords.forEach((coords2, index) => {
        if (index === 0) {
          context2.moveTo(coords2[0], coords2[1]);
        } else {
          context2.lineTo(coords2[0], coords2[1]);
        }
      });
      if (data.fill) {
        context2.closePath();
        context2.fillStyle = data.turtle.c;
        context2.fill();
      } else {
        context2.lineCap = "round";
        context2.lineWidth = Math.abs(data.turtle.p);
        context2.strokeStyle = data.turtle.c;
        context2.stroke();
      }
    });
    on("arc", function(data) {
      context2.beginPath();
      if (data.x === data.y) {
        context2.arc(data.turtle.x, data.turtle.y, data.x, 0, 2 * Math.PI, false);
      } else {
        context2.save();
        context2.translate(data.turtle.x - data.x, data.turtle.y - data.y);
        context2.scale(data.x, data.y);
        context2.arc(1, 1, 1, 0, 2 * Math.PI, false);
        context2.restore();
      }
      if (data.fill) {
        context2.fillStyle = data.turtle.c;
        context2.fill();
      } else {
        context2.lineWidth = Math.abs(data.turtle.p);
        context2.strokeStyle = data.turtle.c;
        context2.stroke();
      }
    });
    on("box", function(data) {
      context2.beginPath();
      context2.moveTo(data.turtle.x, data.turtle.y);
      context2.lineTo(data.x, data.turtle.y);
      context2.lineTo(data.x, data.y);
      context2.lineTo(data.turtle.x, data.y);
      context2.closePath();
      context2.fillStyle = data.fill;
      context2.fill();
      if (data.border) {
        context2.lineCap = "round";
        context2.lineWidth = Math.abs(data.turtle.p);
        context2.strokeStyle = data.turtle.c;
        context2.stroke();
      }
    });
    on("pixset", function(data) {
      const img = context2.createImageData(1, 1);
      img.data[0] = data.c >> 16 & 255;
      img.data[1] = data.c >> 8 & 255;
      img.data[2] = data.c & 255;
      img.data[3] = 255;
      context2.putImageData(img, data.x, data.y);
      if (data.doubled) {
        context2.putImageData(img, data.x - 1, data.y);
        context2.putImageData(img, data.x, data.y - 1);
        context2.putImageData(img, data.x - 1, data.y - 1);
      }
    });
    on("blank", function(colour2) {
      context2.fillStyle = colour2;
      context2.fillRect(0, 0, canvas2.width, canvas2.height);
    });
    on("flood", function(data) {
      const img = context2.getImageData(0, 0, canvas2.width, canvas2.height);
      const pixStack = [];
      const dx = [0, -1, 1, 0];
      const dy = [-1, 0, 0, 1];
      let i2 = 0;
      let offset = (data.y * canvas2.width + data.x) * 4;
      const c3 = 256 * 256 * img.data[offset] + 256 * img.data[offset + 1] + img.data[offset + 2];
      let nextX;
      let nextY;
      let nextC;
      let test1;
      let test2;
      let test3;
      let tx = data.x;
      let ty = data.y;
      pixStack.push(tx);
      pixStack.push(ty);
      while (pixStack.length > 0) {
        ty = pixStack.pop();
        tx = pixStack.pop();
        for (i2 = 0; i2 < 4; i2 += 1) {
          nextX = tx + dx[i2];
          nextY = ty + dy[i2];
          test1 = nextX > 0 && nextX <= canvas2.width;
          test2 = nextY > 0 && nextY <= canvas2.height;
          if (test1 && test2) {
            offset = (nextY * canvas2.width + nextX) * 4;
            nextC = 256 * 256 * img.data[offset];
            nextC += 256 * img.data[offset + 1];
            nextC += img.data[offset + 2];
            test1 = nextC !== data.c1;
            test2 = nextC !== data.c2 || !data.boundary;
            test3 = nextC === c3 || data.boundary;
            if (test1 && test2 && test3) {
              offset = (nextY * canvas2.width + nextX) * 4;
              img.data[offset] = (data.c1 & 16711680) >> 16;
              img.data[offset + 1] = (data.c1 & 65280) >> 8;
              img.data[offset + 2] = data.c1 & 255;
              pixStack.push(nextX);
              pixStack.push(nextY);
            }
          }
        }
      }
      context2.putImageData(img, 0, 0);
    });
  }

  // client/components/system/comments.ts
  var commentsTableBody = document.querySelector('[data-component="commentsTableBody"]');
  if (commentsTableBody) {
    on("lexemesChanged", function() {
      fill(commentsTableBody, state_default.comments.map(commentTableRow));
    });
  }
  function commentTableRow(comment2) {
    return tr({ content: [
      td({ content: comment2.line.toString(10) }),
      td({ content: comment2.value })
    ] });
  }

  // client/components/system/console.ts
  var console2 = document.querySelector('[data-component="console"]');
  if (console2) {
    on("log", function(text) {
      console2.innerHTML += text;
      console2.scrollTop = console2.scrollHeight;
    });
    on("backspace", function() {
      console2.innerHTML = console2.innerHTML.slice(0, -1);
      console2.scrollTop = console2.scrollHeight;
    });
    on("console", function(data) {
      if (data.clear) {
        console2.innerHTML = "";
      }
      console2.style.background = data.colour;
    });
  }

  // client/components/system/controls.ts
  var playButton = document.querySelector('[data-component="runButton"]');
  var haltButton = document.querySelector('[data-component="haltButton"]');
  if (playButton && haltButton) {
    on("played", () => {
      playButton.innerHTML = '<i class="fa fa-pause"></i>';
      haltButton.removeAttribute("disabled");
    });
    on("paused", () => {
      playButton.innerHTML = '<i class="fa fa-play"></i>';
    });
    on("unpaused", () => {
      playButton.innerHTML = '<i class="fa fa-pause"></i>';
    });
    on("halted", () => {
      playButton.innerHTML = '<i class="fa fa-play"></i>';
      haltButton.setAttribute("disabled", "disabled");
    });
  }

  // client/components/system/editor.ts
  var editor = document.querySelector('[data-component="editor"]');
  if (editor) {
    let updateCodeDisplay = function() {
      const lines = state_default.code.split("\n");
      fill(lineNumbers, lines.map((x, y) => li({ content: (y + 1).toString(10) })));
      fill(code3, highlight(state_default.tokens, state_default.language));
      window.requestAnimationFrame(function() {
        textarea.value = state_default.code;
        textarea.style.height = `${lines.length * 1.5}em`;
        textarea.style.width = `${pre.scrollWidth.toString(10)}px`;
        pre.style.height = `${lines.length * 1.5}em`;
        lineNumbers.style.height = `${lines.length * 1.5}em`;
      });
    };
    const lineNumbers = editor.querySelector(".line-numbers");
    const codeWrapper = editor.querySelector(".code-wrapper");
    const textarea = editor.querySelector("textarea");
    const pre = editor.querySelector("pre");
    const code3 = editor.querySelector("code");
    textarea.addEventListener("keydown", function(event) {
      if (event.keyCode === 9) {
        const pos = textarea.selectionStart;
        const left = textarea.value.slice(0, pos);
        const right = textarea.value.slice(pos);
        event.preventDefault();
        textarea.value = [left, right].join("  ");
        state_default.code = textarea.value;
        textarea.selectionStart = pos + 2;
        textarea.selectionEnd = pos + 2;
      }
      if (event.keyCode === 13) {
        codeWrapper.scrollLeft = 0;
      }
    });
    textarea.addEventListener("input", function() {
      state_default.code = textarea.value;
    });
    on("codeChanged", updateCodeDisplay);
    on("editorFontFamilyChanged", function() {
      editor.style.fontFamily = state_default.editorFontFamily;
      updateCodeDisplay();
    });
    on("editorFontSizeChanged", function() {
      editor.style.fontSize = `${state_default.editorFontSize.toString(10)}px`;
      updateCodeDisplay();
    });
    on("selectAll", function() {
      textarea.select();
    });
    codeWrapper.addEventListener("scroll", function() {
      lineNumbers.scrollTop = codeWrapper.scrollTop;
      if (codeWrapper.scrollLeft <= 8) {
        codeWrapper.scrollLeft = 0;
      }
    });
  }

  // client/components/system/examples.ts
  var examplesMenu = document.querySelector('[data-component="examplesMenu"]');
  if (examplesMenu) {
    const groupLinks = groups.slice(1).map(exampleGroupLink);
    const groupMenus = groups.slice(1).map(exampleGroupMenu);
    fill(examplesMenu, groupLinks.concat(groupMenus));
  }
  function exampleGroupLink(group) {
    return a({
      on: ["click", function() {
        toggleMenu(group.id);
      }],
      "data-action": "toggleMenu",
      "data-arg": group.id,
      content: [
        span({ content: `Examples ${group.index.toString(10)} - ${group.title}` }),
        i({ className: "fa fa-caret-right", "aria-hidden": "true" })
      ]
    });
  }
  function exampleGroupMenu(group) {
    return div({
      className: "system-sub-menu",
      "data-menu": group.id,
      content: [
        a({
          on: ["click", function() {
            closeMenu(group.id);
          }],
          "data-action": "closeMenu",
          "data-arg": group.id,
          content: [
            i({ className: "fa fa-caret-left", "aria-hidden": "true" }),
            span({ content: "back" })
          ]
        })
      ].concat(group.examples.map(exampleLink))
    });
  }
  function exampleLink(example) {
    return a({
      on: ["click", function() {
        state_default.openExampleFile(example.id);
      }],
      content: [span({ content: example.names[state_default.language] })]
    });
  }

  // client/components/system/memory.ts
  var stackTableBody = document.querySelector('[data-component="memoryStackTableBody"]');
  var heapTableBody = document.querySelector('[data-component="memoryHeapTableBody"]');
  var wrap = 10;
  if (stackTableBody && heapTableBody) {
    on("memoryDumped", function(memory) {
      const stackSplit = [];
      const heapSplit = [];
      while (memory.stack.length > 0) {
        stackSplit.push(memory.stack.splice(0, wrap));
      }
      while (memory.heap.length > 0) {
        heapSplit.push(memory.heap.splice(0, wrap));
      }
      fill(stackTableBody, stackSplit.map(tableRow.bind(null, 0)));
      fill(heapTableBody, heapSplit.map(tableRow.bind(null, memory.heapBase)));
    });
  }
  function tableRow(offset, bytes, index) {
    const content = bytes.map((byte) => td({ content: byte.toString(10) }));
    content.unshift(th({ content: (offset + index * wrap).toString(10) }));
    return tr({ content });
  }

  // client/components/system/output.ts
  var output = document.querySelector('[data-component="output"]');
  if (output) {
    on("write", function(text) {
      output.innerHTML += text;
    });
    on("output", function(data) {
      if (data.clear) {
        output.innerHTML = "";
      }
      output.style.background = data.colour;
    });
  }

  // client/components/system/pcode.ts
  var list = document.querySelector('[data-component="pcodeList"]');
  if (list) {
    on("pcodeChanged", function() {
      fill(list, state_default.pcode.map(pcodeListItem));
    });
  }
  function pcodeListItem(line2) {
    const content = state_default.assembler ? assemble(line2, 0) : line2.reduce((sofar, current) => sofar.concat(cell(current)), []);
    while (content.length % 10 > 0) {
      content.push(div());
    }
    return li({ content });
  }
  function assemble(line2, index) {
    const hit = PCode[line2[index]];
    const pcode2 = hit ? [cell(hit.toUpperCase())] : [cell(line2[index])];
    let args = 0;
    if (hit) {
      if (pcodeArgs(line2[index]) < 0) {
        const length = line2[index + 1];
        pcode2.push(cell(length));
        args += 1;
        while (args <= length) {
          args += 1;
          pcode2.push(cell(String.fromCharCode(line2[index + args])));
        }
      } else {
        while (args < pcodeArgs(line2[index])) {
          args += 1;
          pcode2.push(cell(line2[index + args]));
        }
      }
    }
    if (index + args < line2.length - 1) {
      return pcode2.concat(assemble(line2, index + args + 1));
    }
    return pcode2;
  }
  function cell(content) {
    if (content === null || content === void 0) {
      return div({ content: ":(" });
    } else if (typeof content === "string") {
      return div({ content });
    } else if (state_default.decimal) {
      return div({ content: content.toString(10) });
    } else {
      return div({ content: content.toString(16).toUpperCase() });
    }
  }

  // client/components/system/syntax.ts
  var syntaxTableBody = document.querySelector('[data-component="syntaxTableBody"]');
  if (syntaxTableBody) {
    on("lexemesChanged", function() {
      fill(syntaxTableBody, state_default.lexemes.map(tableBodyRow));
    });
  }
  function tableBodyRow(lexeme, index) {
    return tr({
      content: [
        td({ content: `${index + 1}` }),
        td({ content: lexeme.line.toString(10) }),
        td({
          className: "wide",
          content: [
            code({ content: lexeme.content ? highlight(lexeme.content, state_default.language) : "" })
          ]
        }),
        td({ className: "wide", content: `${lexeme.type}${lexeme.subtype ? ` (${lexeme.subtype})` : ""}` })
      ]
    });
  }

  // client/components/system/turtle.ts
  var turtX = document.querySelector('[data-component="turtxDisplay"]');
  var turtY = document.querySelector('[data-component="turtyDisplay"]');
  var turtD = document.querySelector('[data-component="turtdDisplay"]');
  var turtA = document.querySelector('[data-component="turtaDisplay"]');
  var turtT = document.querySelector('[data-component="turttDisplay"]');
  var turtC = document.querySelector('[data-component="turtcDisplay"]');
  if (turtX && turtY && turtD && turtA && turtT && turtC) {
    on("turtxChanged", function(x) {
      turtX.innerHTML = x.toString(10);
    });
    on("turtyChanged", function(y) {
      turtY.innerHTML = y.toString(10);
    });
    on("turtdChanged", function(d) {
      turtD.innerHTML = d.toString(10);
    });
    on("turtaChanged", function(a2) {
      turtA.innerHTML = a2.toString(10);
    });
    on("turttChanged", function(t) {
      const penup = t < 0;
      const thickness = Math.abs(t);
      turtT.innerHTML = penup ? `(${thickness.toString(10)})` : thickness.toString(10);
    });
    on("turtcChanged", function(c2) {
      turtC.style.background = c2;
    });
  }

  // client/components/system/usage.ts
  var usageTableBody = document.querySelector('[data-component="usageTableBody"]');
  if (usageTableBody) {
    on("usageChanged", function() {
      fill(usageTableBody, state_default.usage.map(categoryFragment));
    });
  }
  function categoryFragment(category) {
    return fragment([
      tr({
        className: "category-heading",
        content: [
          th({ colspan: "4", content: category.category })
        ]
      }),
      fragment(category.expressions.map(expressionRow)),
      tr({
        content: [
          td(),
          td({ content: "TOTAL:" }),
          td({ content: category.total.toString(10) }),
          td()
        ]
      })
    ]);
  }
  function expressionRow(expression3) {
    return tr({
      content: [
        td({
          content: [
            code({ content: highlight(expression3.name, state_default.language) })
          ]
        }),
        td({ content: expression3.level.toString(10) }),
        td({ content: expression3.count.toString(10) }),
        td({ content: expression3.lines.replace(/\s/g, ", ") })
      ]
    });
  }

  // client/index.ts
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
      navigator.serviceWorker.register("/service-worker.js");
    });
  }
  globalThis.state = state_default;
  var turtle3 = document.getElementById("turtle");
  if (turtle3) {
    if (turtle3.dataset.language) {
      if (languages.includes(turtle3.dataset.language)) {
        state_default.language = turtle3.dataset.language;
      }
    }
    if (turtle3.dataset.example) {
      state_default.openExampleFile(turtle3.dataset.example);
    }
    if (turtle3.dataset.file) {
      state_default.openRemoteFile(turtle3.dataset.file);
    }
    on("systemReady", function() {
      turtle3.classList.remove("hidden");
    });
  }
  window.addEventListener("beforeunload", function() {
    if (state_default.alwaysSaveSettings) {
      state_default.saveSettings();
    }
  });
  on("error", function(error) {
    console.error(error);
    window.alert(error.message);
  });
  state_default.init();
})();
