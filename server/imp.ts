import type { Imp } from "./types.ts"
import { readFile } from "./imp/file.ts"
import { createUser, readUser, updateUser, deleteUser } from "./imp/user.ts"

const imp: Imp = {
  readFile,
  createUser,
  readUser,
  updateUser,
  deleteUser,
}

export default imp

// dummy implementations for use in tests
export const testImpFail: Imp = {
  readFile: async () => await undefined,
  createUser: async () => await ["left", new Error()],
  readUser: async () => await undefined,
  updateUser: async () => await ["left", new Error()],
  deleteUser: async () => await ["left", new Error()],
}

export const testImpSucceed: Imp = {
  readFile: async () => await new Uint8Array(),
  createUser: async () => await ["right", undefined],
  readUser: async () => await {
    username: "dummy",
    password: "12345",
    firstName: "Dummy",
    lastName: "Dummy",
    email: "dummy@dummail.com",
    accountType: 1,
    receivingEmails: true,
  },
  updateUser: async () => await ["right", undefined],
  deleteUser: async () => await ["right", undefined],
}
