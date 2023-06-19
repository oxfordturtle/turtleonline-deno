import { type IResult } from "sendgrid";
import type { Either, Maybe } from "./utils/tools.ts";

export type Imp = {
  readFile: (path: string) => Promise<Maybe<Uint8Array>>;
  createUser: (user: User) => Promise<Either<Error, void>>;
  readUser: (fields: string | Partial<User>) => Promise<User | undefined>;
  readUsers: (fields: Partial<User>) => Promise<User[]>;
  updateUser: (
    username: string,
    userDetails: Partial<User>
  ) => Promise<Either<Error, void>>;
  deleteUser: (username: string) => Promise<Either<Error, void>>;
  sendVerifyEmail: (user: User) => Promise<IResult>;
  sendCredentialsEmail: (user: User) => Promise<IResult>;
};

export type RequestParams = {
  method: string;
  url: URL;
  sections: [string, ...string[]];
  page: string;
  formData?: FormData;
  user?: User;
};

export type Session = {
  username: string;
  key: string;
};

export type User = {
  username: string;
  email: string;
  emailConfirmed: boolean;
  password: string;
  lastLoginDate: string | null;
  token: string | null;
  tokenExpires: string | null;
  firstName: string;
  lastName: string;
  schoolName: string | null;
  schoolPostcode: string | null;
  accountType: 1 | 2; // 1 = over 13, account created by user, 2 = under 13, account created by guardian
  guardian: string | null;
  admin: boolean;
  receivingEmails: boolean;
  systemSettings: SystemSettings | null;
};

export type SystemSettings = {
  language: string;
  mode: string;
  editorFontFamily: string;
  editorFontSize: number;
  outputFontFamily: string;
  outputFontSize: number;
  includeCommentsInExamples: boolean;
  loadCorrespondingExample: boolean;
  assembler: boolean;
  decimal: boolean;
  autoCompileOnLoad: boolean;
  autoRunOnLoad: boolean;
  autoFormatOnLoad: boolean;
  alwaysSaveSettings: boolean;
  showCanvasOnRun: boolean;
  showOutputOnWrite: boolean;
  showMemoryOnDump: boolean;
  drawCountMax: number;
  codeCountMax: number;
  smallSize: number;
  stackSize: number;
  traceOnRun: boolean;
  activateHCLR: boolean;
  preventStackCollision: boolean;
  rangeCheckArrays: boolean;
  canvasStartSize: number;
  setupDefaultKeyBuffer: boolean;
  turtleAttributesAsGlobals: boolean;
  initialiseLocals: boolean;
  allowCSTR: boolean;
  separateReturnStack: boolean;
  separateMemoryControlStack: boolean;
  separateSubroutineRegisterStack: boolean;
};
