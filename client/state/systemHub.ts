import { type Language, isLanguage } from "../constants/languages.ts";
import tokenize from "../tokenizer/tokenize.ts";
import { SystemError } from "../tools/error.ts";
import systemState from "./systemState.ts";
import fileMemory, { makeFile } from "./fileMemory.ts";

export const init = async (): Promise<void> => {
  const response = await fetch("/status");
  const user = await response.json();
  if (user) {
    if (!systemState.savedSettingsHaveBeenLoaded) {
      await loadSavedSettings();
    }
  } else {
    systemState.savedSettingsHaveBeenLoaded = false;
    systemState.alwaysSaveSettings = false;
  }

  const currentFile = fileMemory.files[fileMemory.currentFileIndex];
  if (!currentFile) {
    fileMemory.files = [...fileMemory.files, makeFile(systemState.language)];
  } else if (fileMemory.files.length === 1 && currentFile.code === "") {
    currentFile.language = systemState.language;
  } else {
    fileMemory.tokens = tokenize(currentFile.code, currentFile.language);
  }
  if (currentFile.compiled) {
    // the session doesn't save the results of compilation, so we need to compile again here
    compileCurrentFile();
  }
};

export const setLanguage = (language: Language): void => {
  // check the input; the compiler cannot always do so, since the language can
  // be set on the HTML page itself
  if (!isLanguage(language)) {
    error(new SystemError(`Unknown language "${language}".`));
  }
  this.#language = language;
  save("language", language);
  send("languageChanged");

  // set current file as not compiled
  this.file.compiled = false;
  save("files", this.files);
  send("codeChanged"); // update the syntax highlighting

  // maybe load corresponding example
  if (this.files) {
    // false when language is set on first page load
    if (this.file.example && this.loadCorrespondingExample) {
      this.openExampleFile(this.file.example);
    }
  }
};

export const setCurrentFileIndex = (currentFileIndex: number): void => {
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
};

export const newFile = (skeleton = false): void => {
  const file = new File(this.language);
  if (skeleton) {
    file.code = skeletons[this.language];
  }
  this.addFile(file);
};

export const openLocalFile = (): void => {
  const state = this;
  const fileInput = input({
    type: "file",
    on: [
      "change",
      function () {
        if (fileInput.files) {
          const file = fileInput.files[0];
          const fr = new FileReader();
          fr.onload = function () {
            state.openFile(file.name, fr.result as string);
          };
          fr.readAsText(file);
        }
      },
    ],
  });
  fileInput.click();
};

export const saveExportFile = (): void => {
  send("error", new SystemError("This feature has not yet been implemented in the online system."));
};

export const closeCurrentFile = (): void => {
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
};

export const copyCanvasGraphic = (): void => {
  send("error", new SystemError("This feature has not yet been implemented in the online system."));
};

export const saveCanvasGraphic = (): void => {
  send("error", new SystemError("This feature has not yet been implemented in the online system."));
};

export const printProgram = (): void => {
  send("error", new SystemError("This feature has not yet been implemented in the online system."));
};

export const printOutputText = (): void => {
  send("error", new SystemError("This feature has not yet been implemented in the online system."));
};

export const printConsoleText = (): void => {
  send("error", new SystemError("This feature has not yet been implemented in the online system."));
};

// edit actions
export const undo = (): void => {};

export const redo = (): void => {};

export const cut = (): void => {};

export const copy = (): void => {};

export const paste = (): void => {};

export const selectAll = (): void => {};

export const findAndReplace = (): void => {};

export const autoFormat = (): void => {};

export const backupCode = (): void => {
  this.file.backup = this.file.code;
};

export const restoreCode = (): void => {
  if (this.file.code !== this.file.backup) {
    this.file.compiled = false;
  }
  this.file.code = this.file.backup;
};

// compile actions
export const compileCurrentFile = (): void => {
  // if this file's language doesn't match the current language, now is the
  // time to make it match
  this.file.language = this.language;
  try {
    this.tokens = tokenize(this.code, this.language);
    this.lexemes = lexify(this.tokens, this.language);
    this.program = parser(this.lexemes, this.language);
    this.usage = analyse(this.lexemes, this.program);
    this.pcode = encoder(this.program, this.compilerOptions);
    this.file.language = this.language;
    this.file.compiled = true;
    this.files = this.files; // to update the session storage
  } catch (error) {
    send("error", error);
  }
};

export const savePCodeJson = (): void => {
  send("error", new SystemError("This feature has not yet been implemented in the online system."));
};

export const savePCodeBinary = (): void => {
  send("error", new SystemError("This feature has not yet been implemented in the online system."));
};

// run actions
export const playPauseMachine = (): void => {
  if (machine.isRunning()) {
    if (machine.isPaused()) {
      machine.play();
    } else {
      machine.pause();
    }
  } else {
    if (!this.file.compiled) {
      this.compileCurrentFile();
    }
    if (this.file.compiled) {
      machine.run(this.pcode, this.machineOptions);
    }
  }
  send("closeMenu", "system");
};

export const loadAndRunPCode = (): void => {
  send("error", new SystemError("This feature has not yet been implemented in the online system."));
};

// options actions
export const saveSettings = async (): Promise<void> => {
  const response = await fetch("/status");
  const user = response.ok ? await response.json() : null;
  if (user) {
    const settings: Partial<Record<Property, any>> = {
      // system settings
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
      // machine runtime options
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
      // compiler options
      canvasStartSize: this.canvasStartSize,
      setupDefaultKeyBuffer: this.setupDefaultKeyBuffer,
      turtleAttributesAsGlobals: this.turtleAttributesAsGlobals,
      initialiseLocals: this.initialiseLocals,
      allowCSTR: this.allowCSTR,
      separateReturnStack: this.separateReturnStack,
      separateMemoryControlStack: this.separateMemoryControlStack,
      separateSubroutineRegisterStack: this.separateSubroutineRegisterStack,
    };
    const response = await fetch("/account/update-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (response.ok) {
      send("closeMenu", "system");
    } else {
      send("error", new SystemError("Your settings could not be saved. Please try again later."));
    }
  } else {
    send("error", new SystemError("You must be logged in to save your settings."));
  }
};

export const loadSavedSettings = async (): Promise<void> => {
  const response = await fetch("/status");
  const user = response.ok ? await response.json() : null;
  if (user && user.systemSettings) {
    this.savedSettingsHaveBeenLoaded = true;
    // system settings
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
    // machine runtime options
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
    // compiler options
    this.canvasStartSize = user.systemSettings.canvasStartSize;
    this.setupDefaultKeyBuffer = user.systemSettings.setupDefaultKeyBuffer;
    this.turtleAttributesAsGlobals = user.systemSettings.turtleAttributesAsGlobals;
    this.initialiseLocals = user.systemSettings.initialiseLocals;
    this.allowCSTR = user.systemSettings.allowCSTR;
    this.separateReturnStack = user.systemSettings.separateReturnStack;
    this.separateMemoryControlStack = user.systemSettings.separateMemoryControlStack;
    this.separateSubroutineRegisterStack = user.systemSettings.separateSubroutineRegisterStack;
  }
};

export const resetDefaults = (): void => {
  // system settings
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
  // machine runtime options
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
  // compiler options
  this.canvasStartSize = defaults.canvasStartSize;
  this.setupDefaultKeyBuffer = defaults.setupDefaultKeyBuffer;
  this.turtleAttributesAsGlobals = defaults.turtleAttributesAsGlobals;
  this.initialiseLocals = defaults.initialiseLocals;
  this.allowCSTR = defaults.allowCSTR;
  this.separateReturnStack = defaults.separateReturnStack;
  this.separateMemoryControlStack = defaults.separateMemoryControlStack;
  this.separateSubroutineRegisterStack = defaults.separateSubroutineRegisterStack;
  // close the system menu
  send("closeMenu", "system");
};

// other actions
export const addFile = (file: File): void => {
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
};

export const openFile = (filename: string, content: string, example: string | null = null): void => {
  const file = new File(this.language, example);
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
        if (json.language && json.name && json.code && json.usage && json.pcode) {
          file.language = json.language;
          file.name = json.name;
          file.code = json.code.trim().replace(/\r\n/g, "\n");
        } else {
          send("error", new SystemError("Invalid TMX file."));
        }
      } catch {
        send("error", new SystemError("Invalid TMX file."));
      }
      break;

    case "tmj": // pcode only; TODO; fallthrough for now
    case "tmb": // pcode binary file; TODO; fallthrough for now
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
};

export const openRemoteFile = (_url: string): void => {
  send("error", new SystemError("Feature not yet available."));
};

export const openExampleFile = (exampleId: string): void => {
  const example = examples.find((x) => x.id === exampleId);
  if (!example) {
    send("error", new SystemError(`Unknown example "${exampleId}".`));
  } else {
    const filename = `${example.id}.${extension[this.language]}`;
    const path = `/examples/${this.language}/${example.groupId}/${filename}`;
    fetch(path).then((response) => {
      if (response.ok) {
        response.text().then((content) => {
          this.openFile(filename, content.trim(), exampleId);
        });
      } else {
        send(
          "error",
          new SystemError(`Example "${exampleId}" is not available for Turtle ${this.language}.`)
        );
      }
      view.send("closeMenu", "system");
    });
  }
};

export const openExampleGroup = (groupId: string): void => {
  const group = exampleGroups.find((x) => x.id === groupId);
  if (!group) {
    send("error", new SystemError(`Group ID ${groupId} not found.`));
  } else {
    for (const example of group.examples) {
      this.openExampleFile(example.id);
    }
  }
};

export const saveLocalFile = (): void => {
  const a = document.createElement("a");
  const blob = new Blob([this.file.code], {
    type: "text/plain;charset=utf-8",
  });
  a.setAttribute("href", URL.createObjectURL(blob));
  a.setAttribute("download", this.file.filename);
  a.click();
};

export const saveRemoteFile = (): void => {
  send("error", new SystemError("Feature not yet available."));
};

export const outputAllExamples = async (): Promise<void> => {
  let allExamplesText = "";
  for (const example of examples) {
    const filename = `${example.id}.${extension[this.language]}`;
    const response = await fetch(`/examples/${this.language}/${example.groupId}/${filename}`);
    const content = await response.text();
    allExamplesText += `Example ${example.id}:\n----------\n`;
    allExamplesText += `${content}\n\n\n`;
  }
  const a = document.createElement("a");
  const blob = new Blob([allExamplesText], {
    type: "text/plain;charset=utf-8",
  });
  a.setAttribute("href", URL.createObjectURL(blob));
  a.setAttribute("download", `${this.language}_examples.txt`);
  a.click();
};

// TODO: this should be in the machine module
export const dumpMemory = (): void => {
  send("memoryDumped", memory.dump());
};

export const error = (error: Error): void => {
  console.error(error);
  alert(error.message);
};
