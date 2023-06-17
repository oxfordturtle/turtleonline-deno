import { assertEquals } from "testing"
import type { User } from "../types.ts"
import { createUser, readUser, updateUser, deleteUser } from "./user.ts"

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
}

Deno.test({
  name: "imp: user",
  fn: async () => {
    // create user
    const result1 = await createUser(dummyUser)
    assertEquals(result1[0], "right")

    // check user was created
    const result2 = await readUser(dummyUser.username)
    assertEquals(result2, dummyUser)

    // check repeat attempt complains of duplicate username
    const result3 = await createUser(dummyUser)
    assertEquals(result3[0], "left")
    assertEquals(result3[1]?.message, "duplicate username")

    // read non-existent user
    const nobody = await readUser("nopeThisIsNobody")
    assertEquals(nobody, undefined)

    // update existing user
    const result4 = await updateUser("dummy", { firstName: "DumDum" })
    assertEquals(result4[0], "right")
    const user = await readUser("dummy")
    assertEquals(user?.firstName, "DumDum")

    // update non-existent user
    const result5 = await updateUser("nopeThisIsNobody", {})
    assertEquals(result5[0], "left")

    // delete existing user
    const result6 = await deleteUser("dummy")
    assertEquals(result6[0], "right")

    // delete non-existent user
    const result7 = await deleteUser("dummy")
    assertEquals(result7[0], "left")
  },
})
