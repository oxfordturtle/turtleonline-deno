/// <reference lib="dom" />

// type imports
import type { Language } from "../constants/languages.ts";
import type { Mode } from "../constants/modes.ts";
import type { Property } from "../constants/properties.ts";
import type { Options as CompilerOptions } from "../encoder/options.ts";
import type { Options as MachineOptions } from "../machine/types.ts";
import type { Token } from "../tokenizer/token.ts";
import type { CommentLexeme, Lexeme } from "../lexer/lexeme.ts";
import type { UsageCategory } from "../analyser/usageCategory.ts";

// module imports
import { File, skeletons } from "./file.ts";
import { load, save } from "./storage.ts";
import examples from "../constants/examples.ts";
import exampleGroups from "../constants/exampleGroups.ts";
import languages, { extension } from "../constants/languages.ts";
import { defaults } from "../constants/properties.ts";
import { input } from "../tools/elements.ts";
import { SystemError } from "../tools/error.ts";
import { send } from "../tools/hub.ts";
import * as machine from "../machine/index.ts";
import * as memory from "../machine/memory.ts";
import tokenize from "../tokenizer/tokenize.ts";
import lexify from "../lexer/lexify.ts";
import parser from "../parser/parser.ts";
import makeProgram, { type Program } from "../parser/definitions/routines/program.ts";
import analyse from "../analyser/analyse.ts";
import encoder from "../encoder/encode.ts";

/** system state */
export class State {
  // whether user's saved settings have been loaded in this session
  #savedSettingsHaveBeenLoaded: boolean;
  // system settings
  #language: Language;
  #mode: Mode;
  #editorFontFamily: string;
  #editorFontSize: number;
  #outputFontFamily: string;
  #outputFontSize: number;
  #includeCommentsInExamples: boolean;
  #loadCorrespondingExample: boolean;
  #assembler: boolean;
  #decimal: boolean;
  #autoCompileOnLoad: boolean;
  #autoRunOnLoad: boolean;
  #autoFormatOnLoad: boolean;
  #alwaysSaveSettings: boolean;
  // help page properties
  #commandsCategoryIndex: number;
  #showSimpleCommands: boolean;
  #showIntermediateCommands: boolean;
  #showAdvancedCommands: boolean;
  // file memory
  #files: File[];
  #currentFileIndex: number;
  #tokens: Token[];
  #lexemes: Lexeme[];
  #program: Program;
  #usage: UsageCategory[];
  #pcode: number[][];
  // machine runtime options
  #showCanvasOnRun: boolean;
  #showOutputOnWrite: boolean;
  #showMemoryOnDump: boolean;
  #drawCountMax: number;
  #codeCountMax: number;
  #smallSize: number;
  #stackSize: number;
  #traceOnRun: boolean;
  #activateHCLR: boolean;
  #preventStackCollision: boolean;
  #rangeCheckArrays: boolean;
  // compiler options
  #canvasStartSize: number;
  #setupDefaultKeyBuffer: boolean;
  #turtleAttributesAsGlobals: boolean;
  #initialiseLocals: boolean;
  #allowCSTR: boolean;
  #separateReturnStack: boolean;
  #separateMemoryControlStack: boolean;
  #separateSubroutineRegisterStack: boolean;

  // constructor
  constructor() {
    // whether user's saved settings have been loaded in this session
    this.#savedSettingsHaveBeenLoaded = load("savedSettingsHaveBeenLoaded");
    // system settings
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
    // help page properties
    this.#commandsCategoryIndex = load("commandsCategoryIndex");
    this.#showSimpleCommands = load("showSimpleCommands");
    this.#showIntermediateCommands = load("showIntermediateCommands");
    this.#showAdvancedCommands = load("showAdvancedCommands");
    // file memory
    this.#files = load("files");
    this.#currentFileIndex = load("currentFileIndex");
    this.#tokens = [];
    this.#lexemes = [];
    this.#program = makeProgram(this.#language, "");
    this.#usage = [];
    this.#pcode = [];
    // machine runtime options
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
    // compiler options
    this.#canvasStartSize = load("canvasStartSize");
    this.#setupDefaultKeyBuffer = load("setupDefaultKeyBuffer");
    this.#turtleAttributesAsGlobals = load("turtleAttributesAsGlobals");
    this.#initialiseLocals = load("initialiseLocals");
    this.#allowCSTR = load("allowCSTR");
    this.#separateReturnStack = load("separateReturnStack");
    this.#separateMemoryControlStack = load("separateMemoryControlStack");
    this.#separateSubroutineRegisterStack = load("separateSubroutineRegisterStack");
  }

  // initialise the app (i.e. send all property changed messages)
  async init(): Promise<void> {
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
      // the session doesn't save the results of compilation, so we need to
      // compile again here
      this.compileCurrentFile();
    }
    // system settings
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
    // help page properties
    send("commandsCategoryIndexChanged");
    send("showSimpleCommandsChanged");
    send("showIntermediateCommandsChanged");
    send("showAdvancedCommandsChanged");
    // file memory
    send("filesChanged");
    send("currentFileIndexChanged");
    send("tokensChanged");
    send("lexemesChanged");
    send("programChanged");
    send("usageChanged");
    send("pcodeChanged");
    // machine runtime options
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
    // compiler options
    send("canvasStartSizeChanged");
    send("setupDefaultKeyBufferChanged");
    send("turtleAttributesAsGlobalsChanged");
    send("initialiseLocalsChanged");
    send("allowCSTRChanged");
    send("separateReturnStackChanged");
    send("separateMemoryControlStackChanged");
    send("separateSubroutineRegisterStackChanged");
    // all good
    send("systemReady");
  }

  // whether user's saved settings have been loaded in this session
  get savedSettingsHaveBeenLoaded(): boolean {
    return this.#savedSettingsHaveBeenLoaded;
  }
  set savedSettingsHaveBeenLoaded(savedSettingsHaveBeenLoaded: boolean) {
    this.#savedSettingsHaveBeenLoaded = savedSettingsHaveBeenLoaded;
    save("savedSettingsHaveBeenLoaded", savedSettingsHaveBeenLoaded);
  }

  // system settings
  get language(): Language {
    return this.#language;
  }
  set language(language: Language) {
    // check the input; the compiler cannot always do so, since the language can
    // be set on the HTML page itself
    if (!languages.includes(language)) {
      send("error", new SystemError(`Unknown language "${language}".`));
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
  }

  get mode(): Mode {
    return this.#mode;
  }
  set mode(mode: Mode) {
    this.#mode = mode;
    save("mode", mode);
    send("modeChanged");
  }

  get editorFontFamily(): string {
    return this.#editorFontFamily;
  }
  set editorFontFamily(editorFontFamily: string) {
    this.#editorFontFamily = editorFontFamily;
    save("editorFontFamily", editorFontFamily);
    send("editorFontFamilyChanged");
  }

  get editorFontSize(): number {
    return this.#editorFontSize;
  }
  set editorFontSize(editorFontSize: number) {
    this.#editorFontSize = editorFontSize;
    save("editorFontSize", editorFontSize);
    send("editorFontSizeChanged");
  }

  get outputFontFamily(): string {
    return this.#outputFontFamily;
  }
  set outputFontFamily(outputFontFamily: string) {
    this.#outputFontFamily = outputFontFamily;
    save("outputFontFamily", outputFontFamily);
    send("outputFontFamilyChanged");
  }

  get outputFontSize(): number {
    return this.#outputFontSize;
  }
  set outputFontSize(outputFontSize: number) {
    this.#outputFontSize = outputFontSize;
    save("outputFontSize", outputFontSize);
    send("outputFontSizeChanged");
  }

  get includeCommentsInExamples(): boolean {
    return this.#includeCommentsInExamples;
  }
  set includeCommentsInExamples(includeCommentsInExamples: boolean) {
    this.#includeCommentsInExamples = includeCommentsInExamples;
    save("includeCommentsInExamples", includeCommentsInExamples);
    send("includeCommentsInExamplesChanged");
  }

  get loadCorrespondingExample(): boolean {
    return this.#loadCorrespondingExample;
  }
  set loadCorrespondingExample(loadCorrespondingExample: boolean) {
    this.#loadCorrespondingExample = loadCorrespondingExample;
    save("loadCorrespondingExample", loadCorrespondingExample);
    send("loadCorrespondingExampleChanged");
  }

  get assembler(): boolean {
    return this.#assembler;
  }
  set assembler(assembler: boolean) {
    this.#assembler = assembler;
    save("assembler", assembler);
    send("pcodeChanged");
  }

  get decimal(): boolean {
    return this.#decimal;
  }
  set decimal(decimal: boolean) {
    this.#decimal = decimal;
    save("decimal", decimal);
    send("pcodeChanged");
  }

  get autoCompileOnLoad(): boolean {
    return this.#autoCompileOnLoad;
  }
  set autoCompileOnLoad(autoCompileOnLoad: boolean) {
    this.#autoCompileOnLoad = autoCompileOnLoad;
    save("autoCompileOnLoad", this.#autoCompileOnLoad);
    send("autoCompileOnLoadChanged");
  }

  get autoRunOnLoad(): boolean {
    return this.#autoRunOnLoad;
  }
  set autoRunOnLoad(autoRunOnLoad: boolean) {
    this.#autoRunOnLoad = autoRunOnLoad;
    save("autoRunOnLoad", this.#autoRunOnLoad);
    send("autoRunOnLoadChanged");
  }

  get autoFormatOnLoad(): boolean {
    return this.#autoFormatOnLoad;
  }
  set autoFormatOnLoad(autoFormatOnLoad: boolean) {
    this.#autoFormatOnLoad = autoFormatOnLoad;
    save("autoFormatOnLoad", this.#autoFormatOnLoad);
    send("autoFormatOnLoadChanged");
  }

  get alwaysSaveSettings(): boolean {
    return this.#alwaysSaveSettings;
  }
  set alwaysSaveSettings(alwaysSaveSettings: boolean) {
    this.#alwaysSaveSettings = alwaysSaveSettings;
    save("alwaysSaveSettings", alwaysSaveSettings);
    send("alwaysSaveSettingsChanged");
  }

  // help page properties
  get commandsCategoryIndex(): number {
    return this.#commandsCategoryIndex;
  }
  set commandsCategoryIndex(commandsCategoryIndex: number) {
    this.#commandsCategoryIndex = commandsCategoryIndex;
    save("commandsCategoryIndex", commandsCategoryIndex);
    send("commandsCategoryIndexChanged");
  }

  get showSimpleCommands(): boolean {
    return this.#showSimpleCommands;
  }
  set showSimpleCommands(showSimpleCommands: boolean) {
    this.#showSimpleCommands = showSimpleCommands;
    save("showSimpleCommands", showSimpleCommands);
    send("showSimpleCommandsChanged");
  }

  get showIntermediateCommands(): boolean {
    return this.#showIntermediateCommands;
  }
  set showIntermediateCommands(showIntermediateCommands: boolean) {
    this.#showIntermediateCommands = showIntermediateCommands;
    save("showIntermediateCommands", showIntermediateCommands);
    send("showIntermediateCommandsChanged");
  }

  get showAdvancedCommands(): boolean {
    return this.#showAdvancedCommands;
  }
  set showAdvancedCommands(showAdvancedCommands: boolean) {
    this.#showAdvancedCommands = showAdvancedCommands;
    save("showAdvancedCommands", showAdvancedCommands);
    send("showAdvancedCommandsChanged");
  }

  // file memory
  get files(): File[] {
    return this.#files;
  }
  set files(files: File[]) {
    this.#files = files;
    save("files", files);
    send("filesChanged");
  }

  get currentFileIndex(): number {
    return this.#currentFileIndex;
  }
  set currentFileIndex(currentFileIndex: number) {
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
  }

  get file(): File {
    return this.files[this.currentFileIndex];
  }

  get filename(): string {
    return this.files[this.currentFileIndex].name;
  }
  set filename(name: string) {
    this.file.name = name;
    this.file.edited = true;
    save("files", this.files);
    send("filenameChanged");
  }

  get code(): string {
    return this.files[this.currentFileIndex].code;
  }
  set code(code: string) {
    this.file.code = code;
    this.file.edited = true;
    this.file.compiled = false;
    this.tokens = tokenize(code, this.language);
    save("files", this.files);
    send("codeChanged");
  }

  get tokens(): Token[] {
    return this.#tokens;
  }
  set tokens(tokens: Token[]) {
    this.#tokens = tokens;
    send("tokensChanged");
  }

  get lexemes(): Lexeme[] {
    return this.#lexemes.filter((x) => x.type !== "comment");
  }
  set lexemes(lexemes: Lexeme[]) {
    this.#lexemes = lexemes;
    send("lexemesChanged");
  }

  get comments(): CommentLexeme[] {
    return this.#lexemes.filter((x) => x.type === "comment") as CommentLexeme[];
  }

  get program(): Program {
    return this.#program;
  }
  set program(program: Program) {
    this.#program = program;
    send("programChanged");
  }

  get usage(): UsageCategory[] {
    return this.#usage;
  }
  set usage(usage: UsageCategory[]) {
    this.#usage = usage;
    send("usageChanged");
  }

  get pcode(): number[][] {
    return this.#pcode;
  }
  set pcode(pcode: number[][]) {
    this.#pcode = pcode;
    send("pcodeChanged");
  }

  // machine runtime options
  get showCanvasOnRun(): boolean {
    return this.#showCanvasOnRun;
  }
  set showCanvasOnRun(showCanvasOnRun: boolean) {
    this.#showCanvasOnRun = showCanvasOnRun;
    save("showCanvasOnRun", showCanvasOnRun);
    send("showCanvasOnRunChanged");
  }

  get showOutputOnWrite(): boolean {
    return this.#showOutputOnWrite;
  }
  set showOutputOnWrite(showOutputOnWrite: boolean) {
    this.#showOutputOnWrite = showOutputOnWrite;
    save("showOutputOnWrite", showOutputOnWrite);
    send("showOutputOnWriteChanged");
  }

  get showMemoryOnDump(): boolean {
    return this.#showMemoryOnDump;
  }
  set showMemoryOnDump(showMemoryOnDump: boolean) {
    this.#showMemoryOnDump = showMemoryOnDump;
    save("showMemoryOnDump", showMemoryOnDump);
    send("showMemoryOnDumpChanged");
  }

  get drawCountMax(): number {
    return this.#drawCountMax;
  }
  set drawCountMax(drawCountMax: number) {
    this.#drawCountMax = drawCountMax;
    save("drawCountMax", drawCountMax);
    send("drawCountMaxChanged");
  }

  get codeCountMax(): number {
    return this.#codeCountMax;
  }
  set codeCountMax(codeCountMax: number) {
    this.#codeCountMax = codeCountMax;
    save("codeCountMax", codeCountMax);
    send("codeCountMaxChanged");
  }

  get smallSize(): number {
    return this.#smallSize;
  }
  set smallSize(smallSize: number) {
    this.#smallSize = smallSize;
    save("smallSize", smallSize);
    send("smallSizeChanged");
  }

  get stackSize(): number {
    return this.#stackSize;
  }
  set stackSize(stackSize: number) {
    this.#stackSize = stackSize;
    save("stackSize", stackSize);
    send("stackSizeChanged");
  }

  get traceOnRun(): boolean {
    return this.#traceOnRun;
  }
  set traceOnRun(traceOnRun: boolean) {
    this.#traceOnRun = traceOnRun;
    save("traceOnRun", traceOnRun);
    send("traceOnRunChanged");
  }

  get activateHCLR(): boolean {
    return this.#activateHCLR;
  }
  set activateHCLR(activateHCLR: boolean) {
    this.#activateHCLR = activateHCLR;
    save("activateHCLR", activateHCLR);
    send("activateHCLRChanged");
  }

  get preventStackCollision(): boolean {
    return this.#preventStackCollision;
  }
  set preventStackCollision(preventStackCollision: boolean) {
    this.#preventStackCollision = preventStackCollision;
    save("preventStackCollision", preventStackCollision);
    send("preventStackCollisionChanged");
  }

  get rangeCheckArrays(): boolean {
    return this.#rangeCheckArrays;
  }
  set rangeCheckArrays(rangeCheckArrays: boolean) {
    this.#rangeCheckArrays = rangeCheckArrays;
    save("rangeCheckArrays", rangeCheckArrays);
    send("rangeCheckArraysChanged");
  }

  // compiler options
  get canvasStartSize(): number {
    return this.#canvasStartSize;
  }
  set canvasStartSize(canvasStartSize: number) {
    this.#canvasStartSize = canvasStartSize;
    save("canvasStartSize", canvasStartSize);
    send("canvasStartSizeChanged");
  }

  get setupDefaultKeyBuffer(): boolean {
    return this.#setupDefaultKeyBuffer;
  }
  set setupDefaultKeyBuffer(setupDefaultKeyBuffer: boolean) {
    this.#setupDefaultKeyBuffer = setupDefaultKeyBuffer;
    save("setupDefaultKeyBuffer", setupDefaultKeyBuffer);
    send("setupDefaultKeyBufferChanged");
  }

  get turtleAttributesAsGlobals(): boolean {
    return this.#turtleAttributesAsGlobals;
  }
  set turtleAttributesAsGlobals(turtleAttributesAsGlobals: boolean) {
    this.#turtleAttributesAsGlobals = turtleAttributesAsGlobals;
    save("turtleAttributesAsGlobals", turtleAttributesAsGlobals);
    send("turtleAttributesAsGlobalsChanged");
  }

  get initialiseLocals(): boolean {
    return this.#initialiseLocals;
  }
  set initialiseLocals(initialiseLocals: boolean) {
    this.#initialiseLocals = initialiseLocals;
    save("initialiseLocals", initialiseLocals);
    send("initialiseLocalsChanged");
  }

  get allowCSTR(): boolean {
    return this.#allowCSTR;
  }
  set allowCSTR(allowCSTR: boolean) {
    this.#allowCSTR = allowCSTR;
    save("allowCSTR", allowCSTR);
    send("allowCSTRChanged");
  }

  get separateReturnStack(): boolean {
    return this.#separateReturnStack;
  }
  set separateReturnStack(separateReturnStack: boolean) {
    this.#separateReturnStack = separateReturnStack;
    save("separateReturnStack", separateReturnStack);
    send("separateReturnStackChanged");
  }

  get separateMemoryControlStack(): boolean {
    return this.#separateMemoryControlStack;
  }
  set separateMemoryControlStack(separateMemoryControlStack: boolean) {
    this.#separateMemoryControlStack = separateMemoryControlStack;
    save("separateMemoryControlStack", separateMemoryControlStack);
    send("separateMemoryControlStackChanged");
  }

  get separateSubroutineRegisterStack(): boolean {
    return this.#separateSubroutineRegisterStack;
  }
  set separateSubroutineRegisterStack(separateSubroutineRegisterStack: boolean) {
    this.#separateSubroutineRegisterStack = separateSubroutineRegisterStack;
    save("separateSubroutineRegisterStack", separateSubroutineRegisterStack);
    send("separateSubroutineRegisterStackChanged");
  }

  // derivative properties
  get machineOptions(): MachineOptions {
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
      rangeCheckArrays: this.rangeCheckArrays,
    };
  }

  get compilerOptions(): CompilerOptions {
    return {
      canvasStartSize: this.canvasStartSize,
      setupDefaultKeyBuffer: this.setupDefaultKeyBuffer,
      turtleAttributesAsGlobals: this.turtleAttributesAsGlobals,
      initialiseLocals: this.initialiseLocals,
      allowCSTR: this.allowCSTR,
      separateReturnStack: this.separateReturnStack,
      separateMemoryControlStack: this.separateMemoryControlStack,
      separateSubroutineRegisterStack: this.separateSubroutineRegisterStack,
    };
  }

  // edit actions
  undo(): void {}

  redo(): void {}

  cut(): void {}

  copy(): void {}

  paste(): void {}

  selectAll(): void {}

  // save settings (requires login)
  async saveSettings(): Promise<void> {
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
  }

  async loadSavedSettings(): Promise<void> {
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
  }

  // reset default settings
  resetDefaults(): void {
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
  }

  // add a file to the files array (and update current file index)
  addFile(file: File): void {
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
  }

  // close the current file (and update current file index)
  closeCurrentFile(): void {
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
  }

  // create a new file
  newFile(skeleton = false) {
    const file = new File(this.language);
    if (skeleton) {
      file.code = skeletons[this.language];
    }
    this.addFile(file);
  }

  // open a file from disk
  openFile(filename: string, content: string, example: string | null = null) {
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
  }

  openLocalFile() {
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
  }

  openRemoteFile(_url: string) {
    send("error", new SystemError("Feature not yet available."));
  }

  openExampleFile(exampleId: string) {
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
      });
    }
  }

  openExampleGroup(groupId: string) {
    const group = exampleGroups.find((x) => x.id === groupId);
    if (!group) {
      send("error", new SystemError(`Group ID ${groupId} not found.`));
    } else {
      for (const example of group.examples) {
        this.openExampleFile(example.id);
      }
    }
  }

  saveLocalFile() {
    const a = document.createElement("a");
    const blob = new Blob([this.file.code], {
      type: "text/plain;charset=utf-8",
    });
    a.setAttribute("href", URL.createObjectURL(blob));
    a.setAttribute("download", this.file.filename);
    a.click();
  }

  saveRemoteFile() {
    send("error", new SystemError("Feature not yet available."));
  }

  compileCurrentFile(): void {
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
  }

  async outputAllExamples(): Promise<void> {
    let allExamplesText = "";
    for (const example of examples) {
      const filename = `${example.id}.${extension[this.language]}`;
      const response = await fetch(
        `/examples/${this.language}/${example.groupId}/${filename}`
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
    a.setAttribute("download", `${this.language}_examples.txt`);
    a.click();
  }

  backupCode(): void {
    this.file.backup = this.file.code;
  }

  restoreCode(): void {
    if (this.file.code !== this.file.backup) {
      this.file.compiled = false;
    }
    this.file.code = this.file.backup;
  }

  // TODO: this should be in the machine module
  dumpMemory(): void {
    send("memoryDumped", memory.dump());
  }

  // play/pause the machine
  playPauseMachine() {
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
  }
}

// export a new system state object
export const state = new State();
