import { assertEquals } from "testing"
import type { User } from "../types.ts"
import { createUser, readUser, updateUser, deleteUser } from "./user.ts"

const dummyUser: User = {
  username: "dummy",
  password: "12345",
  firstName: "Dummy",
  lastName: "Dummy",
  email: "dummy@dummail.com",
  accountType: 1,
  receivingEmails: true,
}

const path = (username: string): string => `./data/user/${username}.json`

Deno.test({
  name: "imp: create user",
  fn: async () => {
    // create user
    const result1 = await createUser(dummyUser)
    assertEquals(result1[0], "right")

    // check user was created
    const savedUserJson = await Deno.readTextFile(path(dummyUser.username))
    const savedUser = JSON.parse(savedUserJson)
    assertEquals(savedUser, dummyUser)

    // check repeat attempt complains of duplicate username
    const result2 = await createUser(dummyUser)
    assertEquals(result2[0], "left")
    assertEquals(result2[1]?.message, "duplicate username")

    // cleanup
    await Deno.remove(path(dummyUser.username))
  },
})

Deno.test({
  name: "imp: read user",
  fn: async () => {
    // setup
    await Deno.writeTextFile(path(dummyUser.username), JSON.stringify(dummyUser))

    // read existing user
    const user = await readUser("dummy")
    assertEquals(user, dummyUser)

    // read non-existent user
    const nobody = await readUser("nopeThisIsNobody")
    assertEquals(nobody, undefined)

    // cleanup
    await Deno.remove(path(dummyUser.username))
  },
})

Deno.test({
  name: "imp: update user",
  fn: async () => {
    // setup
    await Deno.writeTextFile(path(dummyUser.username), JSON.stringify(dummyUser))

    // update existing user
    const result1 = await updateUser("dummy", { firstName: "DumDum" })
    assertEquals(result1[0], "right")
    const user = await readUser("dummy")
    assertEquals(user?.firstName, "DumDum")

    // update non-existent user
    const result2 = await updateUser("nopeThisIsNobody", {})
    assertEquals(result2[0], "left")

    // update user with new username
    const result3 = await updateUser("dummy", { username: "dumdum" })
    assertEquals(result3[0], "right")
    const movedUser = await readUser("dumdum")
    assertEquals(movedUser, { ...user!, username: "dumdum" })
    const removedUser = await readUser("dummy")
    assertEquals(removedUser, undefined)

    // update user with duplicate username
    await Deno.writeTextFile(path(dummyUser.username), JSON.stringify(dummyUser))
    const result4 = await updateUser("dumdum", { username: "dummy" })
    assertEquals(result4[0], "left")
    assertEquals(result4[1]?.message, "duplicate username")

    // cleanup
    await Deno.remove(path(dummyUser.username))
    await Deno.remove(path("dumdum"))
  },
})

Deno.test({
  name: "imp: delete user",
  fn: async () => {
    // setup
    await Deno.writeTextFile(path(dummyUser.username), JSON.stringify(dummyUser))

    // delete existing user
    const result1 = await deleteUser("dummy")
    assertEquals(result1[0], "right")

    // delete non-existent user
    const result2 = await deleteUser("dummy")
    assertEquals(result2[0], "left")
  },
})
