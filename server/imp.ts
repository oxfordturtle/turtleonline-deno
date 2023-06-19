import type { Imp, User } from "./types.ts";
import { readFile } from "./imp/file.ts";
import {
  createUser,
  readUser,
  updateUser,
  deleteUser,
  readUsers,
} from "./imp/user.ts";
import { sendVerifyEmail, sendCredentialsEmail } from "./imp/email.ts";

const imp: Imp = {
  readFile,
  createUser,
  readUser,
  readUsers,
  updateUser,
  deleteUser,
  sendVerifyEmail,
  sendCredentialsEmail,
};

export default imp;

// dummy implementations for use in tests
export const testImpFail: Imp = {
  readFile: async () => await undefined,
  createUser: async () => await ["left", new Error()],
  readUser: async () => await undefined,
  readUsers: async () => await [],
  updateUser: async () => await ["left", new Error()],
  deleteUser: async () => await ["left", new Error()],
  sendVerifyEmail: async () => await { success: false },
  sendCredentialsEmail: async () => await { success: false },
};

export const testImpSucceed: Imp = {
  readFile: async () => await new Uint8Array(),
  createUser: async () => await ["right", undefined],
  readUser: async () => await dummyUser,
  readUsers: async () => await [dummyUser],
  updateUser: async () => await ["right", undefined],
  deleteUser: async () => await ["right", undefined],
  sendVerifyEmail: async () => await { success: true },
  sendCredentialsEmail: async () => await { success: true },
};

const dummyUser: User = {
  username: "dummy",
  email: "dummy@dummail.com",
  emailConfirmed: true,
  password: "12345",
  lastLoginDate: null,
  token: "",
  tokenExpires: new Date().toString(),
  firstName: "Dummy",
  lastName: "Dummy",
  accountType: 1,
  guardian: null,
  schoolName: null,
  schoolPostcode: null,
  admin: false,
  receivingEmails: true,
  systemSettings: null,
};
