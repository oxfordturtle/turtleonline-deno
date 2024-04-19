import { type Language, extension, isLanguage } from "../constants/languages.ts";
import tokenize from "../tokenizer/tokenize.ts";
import { SystemError } from "../tools/error.ts";
import state, { compilerOptions, initialState, file, machineOptions } from "./state.ts";
import makeFile, { type File, skeletons } from "./file.ts";
import { createHub } from "../elementary/index.ts";

const hub = createHub<{
  init: undefined;
  setLanguage: Language;
  setCurrentFileIndex: number;
  newFile: boolean;
  openLocalFile: undefined;
  saveExportFile: undefined;
  closeCurrentFile: undefined;
  copyCanvasGraphic: undefined;
  saveCanvasGraphic: undefined;
  printProgram: undefined;
  printOutputText: undefined;
  printConsoleText: undefined;
  undo: undefined;
  redo: undefined;
  cut: undefined;
  copy: undefined;
  paste: undefined;
  selectAll: undefined;
  findAndReplace: undefined;
  autoFormat: undefined;
  backupCode: undefined;
  restoreCode: undefined;
  compileCurrentFile: undefined;
  savePCodeJson: undefined;
  savePCodeBinary: undefined;
  playPauseMachine: undefined;
  loadAndRunPCode: undefined;
  saveSettings: undefined;
  loadSavedSettings: undefined;
  resetDefaults: undefined;
  addFile: File;
  openFile: {
    filename: string;
    content: string;
    example: string | null;
  };
  openRemoteFile: string;
  openExampleFile: string;
  openExampleGroup: string;
  saveLocalFile: undefined;
  saveRemoteFile: undefined;
  outputAllExamples: undefined;
  dumpMemory: undefined;
  error: Error;
}>();

export default hub;

hub.on("init", async (): Promise<void> => {
  const response = await fetch("/status");
  const user = await response.json();
  if (user) {
    if (!state.savedSettingsHaveBeenLoaded) {
      hub.send("loadSavedSettings");
    }
  } else {
    state.savedSettingsHaveBeenLoaded = false;
    state.alwaysSaveSettings = false;
  }

  if (state.files.length === 1 && file().code === "") {
    file().language = state.language;
  } else {
    state.tokens = tokenize(file().code, file().language);
  }
  if (file().compiled) {
    // the session doesn't save the results of compilation, so we need to compile again here
    hub.send("compileCurrentFile");
  }
});

hub.on("setLanguage", (language: Language) => {
  // check the input; the compiler cannot always do so, since the language can
  // be set on the HTML page itself
  if (!isLanguage(language)) {
    hub.send("error", new SystemError(`Unknown language "${language}".`));
  }
  state.language = language;

  // set current file as not compiled
  file().compiled = false;
  // TODO: .... send("codeChanged"); // update the syntax highlighting

  // maybe load corresponding example
  const currentFile = file();
  if (currentFile.example && state.loadCorrespondingExample) {
    hub.send("openExampleFile", currentFile.example);
  }
});

hub.on("setCurrentFileIndex", (currentFileIndex: number) => {
  this.#currentFileIndex = currentFileIndex;
  save("currentFileIndex", currentFileIndex);

  // update language to match current file language
  // don't use setter for this.language, because that does a bunch of other
  // stuff as well that shouldn't be done in this case
  this.#language = this.file.language;
  save("language", this.file.language);
  send("languageChanged");

  // update lexemes, pcode, and usage to match current file
  if (this.file.compiled) {
    this.compileCurrentFile();
  } else {
    this.tokens = tokenize(this.code, this.language);
    this.lexemes = [];
    this.program = makeProgram(this.language, "");
    this.usage = [];
    this.pcode = [];
  }

  send("currentFileIndexChanged");
});

hub.on("newFile", (skeleton = false) => {
  const file = makeFile(state.language);
  if (skeleton) {
    file.code = skeletons[state.language];
  }
  hub.send("addFile", file);
});

hub.on("openLocalFile", () => {
  const fileInput = create.input({
    type: "file",
    on: [
      "change",
      function () {
        if (fileInput.files) {
          const file = fileInput.files[0];
          const fr = new FileReader();
          fr.onload = function () {
            hub.send("openFile", { filename: file().name, content: fr.result as string, example: null });
          };
          fr.readAsText(file);
        }
      },
    ],
  });
  fileInput.click();
});

hub.on("saveExportFile", () => {
  hub.send(
    "error",
    new SystemError(
      "This feature has not yet been implemented in the online system."
    )
  );
});

hub.on("closeCurrentFile", () => {
  machine.halt();
  this.files = this.files
    .slice(0, this.currentFileIndex)
    .concat(this.files.slice(this.currentFileIndex + 1));
  if (this.files.length === 0) {
    this.newFile();
  } else if (this.currentFileIndex > this.files.length - 1) {
    this.currentFileIndex = this.currentFileIndex - 1;
  } else {
    // although the currentFileIndex doesn't change in this case, we want
    // everything refreshed as though it has changed
    this.currentFileIndex = this.currentFileIndex;
  }
  send("closeMenu", "system");
});

hub.on("copyCanvasGraphic", () => {
  hub.send(
    "error",
    new SystemError(
      "This feature has not yet been implemented in the online system."
    )
  );
});

hub.on("saveCanvasGraphic", () => {
  hub.send(
    "error",
    new SystemError(
      "This feature has not yet been implemented in the online system."
    )
  );
});

hub.on("printProgram", () => {
  hub.send(
    "error",
    new SystemError(
      "This feature has not yet been implemented in the online system."
    )
  );
});

hub.on("printOutputText", () => {
  hub.send(
    "error",
    new SystemError(
      "This feature has not yet been implemented in the online system."
    )
  );
});

hub.on("printConsoleText", () => {
  hub.send(
    "error",
    new SystemError(
      "This feature has not yet been implemented in the online system."
    )
  );
});

// edit actions
hub.on("undo", () => {});

hub.on("redo", () => {});

hub.on("cut", () => {});

hub.on("copy", () => {});

hub.on("paste", () => {});

hub.on("selectAll", () => {});

hub.on("findAndReplace", () => {});

hub.on("autoFormat", () => {});

hub.on("backupCode", () => {
  file().backup = file().code;
});

hub.on("restoreCode", () => {
  const currentFile = file();
  if (currentFile.code !== currentFile.backup) {
    currentFile.compiled = false;
  }
  currentFile.code = currentFile.backup;
});

// compile actions
hub.on("compileCurrentFile", () => {
  const currentFile = file();
  // if this file's language doesn't match the current language, now is the
  // time to make it match
  currentFile.language = state.language;
  try {
    state.tokens = tokenize(currentFile.code, state.language);
    state.lexemes = lexify(state.tokens, state.language);
    state.program = parser(state.lexemes, state.language);
    state.usage = analyse(state.lexemes, state.program);
    state.pcode = encoder(state.program, compilerOptions());
    currentFile.compiled = true;
    state.files = [...state.files]; // to update the session storage
  } catch (error) {
    hub.send("error", error);
  }
});

hub.on("savePCodeJson", () => {
  hub.send(
    "error",
    new SystemError(
      "This feature has not yet been implemented in the online system."
    )
  );
});

hub.on("savePCodeBinary", () => {
  hub.send(
    "error",
    new SystemError(
      "This feature has not yet been implemented in the online system."
    )
  );
});

// run actions
hub.on("playPauseMachine", () => {
  if (machine.isRunning()) {
    if (machine.isPaused()) {
      machine.play();
    } else {
      machine.pause();
    }
  } else {
    if (!file().compiled) {
      hub.send("compileCurrentFile");
    }
    if (file().compiled) {
      machine.run(state.pcode, machineOptions());
    }
  }
  send("closeMenu", "system");
});

hub.on("loadAndRunPCode", () => {
  hub.send(
    "error",
    new SystemError(
      "This feature has not yet been implemented in the online system."
    )
  );
});

// options actions
hub.on("saveSettings", async (): Promise<void> => {
  const response = await fetch("/status");
  const user = response.ok ? await response.json() : null;
  if (user) {
    const settings = {
      // system settings
      language: state.language,
      mode: state.mode,
      editorFontFamily: state.editorFontFamily,
      editorFontSize: state.editorFontSize,
      outputFontFamily: state.outputFontFamily,
      outputFontSize: state.outputFontSize,
      includeCommentsInExamples: state.includeCommentsInExamples,
      loadCorrespondingExample: state.loadCorrespondingExample,
      assembler: state.assembler,
      decimal: state.decimal,
      autoCompileOnLoad: state.autoCompileOnLoad,
      autoRunOnLoad: state.autoRunOnLoad,
      autoFormatOnLoad: state.autoFormatOnLoad,
      alwaysSaveSettings: state.alwaysSaveSettings,
      // machine runtime options
      showCanvasOnRun: state.showCanvasOnRun,
      showOutputOnWrite: state.showOutputOnWrite,
      showMemoryOnDump: state.showMemoryOnDump,
      drawCountMax: state.drawCountMax,
      codeCountMax: state.codeCountMax,
      smallSize: state.smallSize,
      stackSize: state.stackSize,
      traceOnRun: state.traceOnRun,
      activateHCLR: state.activateHCLR,
      preventStackCollision: state.preventStackCollision,
      rangeCheckArrays: state.rangeCheckArrays,
      // compiler options
      canvasStartSize: state.canvasStartSize,
      setupDefaultKeyBuffer: state.setupDefaultKeyBuffer,
      turtleAttributesAsGlobals: state.turtleAttributesAsGlobals,
      initialiseLocals: state.initialiseLocals,
      allowCSTR: state.allowCSTR,
      separateReturnStack: state.separateReturnStack,
      separateMemoryControlStack: state.separateMemoryControlStack,
      separateSubroutineRegisterStack: state.separateSubroutineRegisterStack,
    };
    const response = await fetch("/account/update-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (response.ok) {
      send("closeMenu", "system");
    } else {
      hub.send(
        "error",
        new SystemError(
          "Your settings could not be saved. Please try again later."
        )
      );
    }
  } else {
    hub.send(
      "error",
      new SystemError("You must be logged in to save your settings.")
    );
  }
});

hub.on("loadSavedSettings", async (): Promise<void> => {
  const response = await fetch("/status");
  const user = response.ok ? await response.json() : null;
  if (user && user.systemSettings) {
    state.savedSettingsHaveBeenLoaded = true;
    // system settings
    state.language = user.systemSettings.language;
    state.mode = user.systemSettings.mode;
    state.editorFontFamily = user.systemSettings.editorFontFamily;
    state.editorFontSize = user.systemSettings.editorFontSize;
    state.outputFontFamily = user.systemSettings.outputFontFamily;
    state.outputFontSize = user.systemSettings.outputFontSize;
    state.includeCommentsInExamples =
      user.systemSettings.includeCommentsInExamples;
    state.loadCorrespondingExample =
      user.systemSettings.loadCorrespondingExample;
    state.assembler = user.systemSettings.assembler;
    state.decimal = user.systemSettings.decimal;
    state.autoCompileOnLoad = user.systemSettings.autoCompileOnLoad;
    state.autoRunOnLoad = user.systemSettings.autoRunOnLoad;
    state.autoFormatOnLoad = user.systemSettings.autoFormatOnLoad;
    state.alwaysSaveSettings = user.systemSettings.alwaysSaveSettings;
    // machine runtime options
    state.showCanvasOnRun = user.systemSettings.showCanvasOnRun;
    state.showOutputOnWrite = user.systemSettings.showOutputOnWrite;
    state.showMemoryOnDump = user.systemSettings.showMemoryOnDump;
    state.drawCountMax = user.systemSettings.drawCountMax;
    state.codeCountMax = user.systemSettings.codeCountMax;
    state.smallSize = user.systemSettings.smallSize;
    state.stackSize = user.systemSettings.stackSize;
    state.traceOnRun = user.systemSettings.traceOnRun;
    state.activateHCLR = user.systemSettings.activateHCLR;
    state.preventStackCollision = user.systemSettings.preventStackCollision;
    state.rangeCheckArrays = user.systemSettings.rangeCheckArrays;
    // compiler options
    state.canvasStartSize = user.systemSettings.canvasStartSize;
    state.setupDefaultKeyBuffer = user.systemSettings.setupDefaultKeyBuffer;
    state.turtleAttributesAsGlobals =
      user.systemSettings.turtleAttributesAsGlobals;
    state.initialiseLocals = user.systemSettings.initialiseLocals;
    state.allowCSTR = user.systemSettings.allowCSTR;
    state.separateReturnStack = user.systemSettings.separateReturnStack;
    state.separateMemoryControlStack =
      user.systemSettings.separateMemoryControlStack;
    state.separateSubroutineRegisterStack =
      user.systemSettings.separateSubroutineRegisterStack;
  }
});

hub.on("resetDefaults", () => {
  // system settings
  state.language = initialState.language;
  state.mode = initialState.mode;
  state.editorFontFamily = initialState.editorFontFamily;
  state.editorFontSize = initialState.editorFontSize;
  state.outputFontFamily = initialState.outputFontFamily;
  state.outputFontSize = initialState.outputFontSize;
  state.includeCommentsInExamples = initialState.includeCommentsInExamples;
  state.loadCorrespondingExample = initialState.loadCorrespondingExample;
  state.assembler = initialState.assembler;
  state.decimal = initialState.decimal;
  state.autoCompileOnLoad = initialState.autoCompileOnLoad;
  state.autoRunOnLoad = initialState.autoRunOnLoad;
  state.autoFormatOnLoad = initialState.autoFormatOnLoad;
  state.alwaysSaveSettings = initialState.alwaysSaveSettings;
  // machine runtime options
  state.showCanvasOnRun = initialState.showCanvasOnRun;
  state.showOutputOnWrite = initialState.showOutputOnWrite;
  state.showMemoryOnDump = initialState.showMemoryOnDump;
  state.drawCountMax = initialState.drawCountMax;
  state.codeCountMax = initialState.codeCountMax;
  state.smallSize = initialState.smallSize;
  state.stackSize = initialState.stackSize;
  state.traceOnRun = initialState.traceOnRun;
  state.activateHCLR = initialState.activateHCLR;
  state.preventStackCollision = initialState.preventStackCollision;
  state.rangeCheckArrays = initialState.rangeCheckArrays;
  // compiler options
  state.canvasStartSize = initialState.canvasStartSize;
  state.setupDefaultKeyBuffer = initialState.setupDefaultKeyBuffer;
  state.turtleAttributesAsGlobals = initialState.turtleAttributesAsGlobals;
  state.initialiseLocals = initialState.initialiseLocals;
  state.allowCSTR = initialState.allowCSTR;
  state.separateReturnStack = initialState.separateReturnStack;
  state.separateMemoryControlStack = initialState.separateMemoryControlStack;
  state.separateSubroutineRegisterStack =
    initialState.separateSubroutineRegisterStack;
  // close the system menu
  send("closeMenu", "system");
});

// other actions
hub.on("addFile", (file: File) => {
  // stop the machine (if it's running)
  machine.halt();

  if (this.file && this.file.code === "" && this.file.edited === false) {
    // if current file is empty, overwrite it
    this.files[this.currentFileIndex] = file;
    this.files = this.files; // to update session
    send("currentFileIndexChanged"); // it hasn't, but this will get file displays to update
  } else {
    // otherwise add a new file
    this.files.push(file);
    this.files = this.files; // to update session
    this.currentFileIndex = this.files.length - 1;
    this.code = file.code;
  }
  send("closeMenu", "system");
});

hub.on(
  "openFile",
   ({ filename, content, example }) => {
    const file = makeFile(state.language, example);
    const bits = filename.split(".");
    const ext = bits.pop();
    const name = bits.join(".");
    let json: any;
    switch (ext) {
      case "tbas": // fallthrough
      case "tgb": // support old file extension
        file.language = "BASIC";
        file.name = name;
        file.code = content.trim().replace(/\r\n/g, "\n");
        break;

      case "tc":
        file.language = "C";
        file.name = name;
        file.code = content.trim().replace(/\r\n/g, "\n");
        break;

      case "tjav":
        file.language = "Java";
        file.name = name;
        file.code = content.trim().replace(/\r\n/g, "\n");
        break;

      case "tpas": // fallthrough
      case "tgp": // support old file extension
        file.language = "Pascal";
        file.name = name;
        file.code = content.trim().replace(/\r\n/g, "\n");
        break;

      case "tpy": // fallthrough
      case "tgy": // support old file extension
        file.language = "Python";
        file.name = name;
        file.code = content.trim().replace(/\r\n/g, "\n");
        break;

      case "tts":
        file.language = "TypeScript";
        file.name = name;
        file.code = content.trim().replace(/\r\n/g, "\n");
        break;

      case "tmx": // fallthrough
      case "tgx": // support old file extension
        try {
          json = JSON.parse(content);
          if (
            json.language &&
            json.name &&
            json.code &&
            json.usage &&
            json.pcode
          ) {
            file.language = json.language;
            file.name = json.name;
            file.code = json.code.trim().replace(/\r\n/g, "\n");
          } else {
            hub.send("error", new SystemError("Invalid TMX file."));
          }
        } catch {
          hub.send("error", new SystemError("Invalid TMX file."));
        }
        break;

      case "tmj": // pcode only; TODO; fallthrough for now
      case "tmb": // pcode binary file; TODO; fallthrough for now
      default:
        throw new SystemError("Invalid file type.");
    }
    hub.send("addFile", file);
    if (json) {
      state.lexemes = lexify(json.code.trim(), state.language);
      state.program = parser(state.lexemes, state.language);
      state.usage = json.usage;
      state.pcode = json.pcode;
      file().compiled = true;
    }
  }
);

hub.on("openRemoteFile", (_url: string) => {
  hub.send("error", new SystemError("Feature not yet available."));
});

hub.on("openExampleFile", (exampleId: string) => {
  const example = examples.find((x) => x.id === exampleId);
  if (!example) {
    hub.send("error", new SystemError(`Unknown example "${exampleId}".`));
  } else {
    const filename = `${example.id}.${extension[state.language]}`;
    const path = `/examples/${state.language}/${example.groupId}/${filename}`;
    fetch(path).then((response) => {
      if (response.ok) {
        response.text().then((content) => {
          hub.send("openFile", { filename, content: content.trim(), example: exampleId });
        });
      } else {
        hub.send(
          "error",
          new SystemError(
            `Example "${exampleId}" is not available for Turtle ${this.language}.`
          )
        );
      }
      menus.send("closeMenu", "system");
    });
  }
});

hub.on("openExampleGroup", (groupId: string) => {
  const group = exampleGroups.find((x) => x.id === groupId);
  if (!group) {
    send("error", new SystemError(`Group ID ${groupId} not found.`));
  } else {
    for (const example of group.examples) {
      this.openExampleFile(example.id);
    }
  }
});

hub.on("saveLocalFile", () => {
  const a = document.createElement("a");
  const blob = new Blob([file().code], {
    type: "text/plain;charset=utf-8",
  });
  a.setAttribute("href", URL.createObjectURL(blob));
  a.setAttribute("download", file().filename);
  a.click();
});

hub.on("saveRemoteFile", () => {
  hub.send("error", new SystemError("Feature not yet available."));
});

hub.on("outputAllExamples", async (): Promise<void> => {
  let allExamplesText = "";
  for (const example of examples) {
    const filename = `${example.id}.${extension[state.language]}`;
    const response = await fetch(
      `/examples/${state.language}/${example.groupId}/${filename}`
    );
    const content = await response.text();
    allExamplesText += `Example ${example.id}:\n----------\n`;
    allExamplesText += `${content}\n\n\n`;
  }
  const a = document.createElement("a");
  const blob = new Blob([allExamplesText], {
    type: "text/plain;charset=utf-8",
  });
  a.setAttribute("href", URL.createObjectURL(blob));
  a.setAttribute("download", `${state.language}_examples.txt`);
  a.click();
});

hub.on("dumpMemory", () => {
  hub.send("memoryDumped", memory.dump());
});

hub.on("error", (error: Error) => {
  console.error(error);
  alert(error.message);
});
