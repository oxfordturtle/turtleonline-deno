import type { Imp, User } from "./types.ts"
import { type Maybe, asafely, asafelyOptional } from "./utils/tools.ts"

const readFile = async (path: string): Promise<Maybe<Uint8Array>> =>
  await asafelyOptional(async () => await Deno.readFile(path))

const createUser = async (user: User): Promise<boolean> => {
  const result = await asafely(() => Deno.writeTextFile(`./data/user/${user.username}.json`, JSON.stringify(user)))
  return result[0] === "right"
}

const readUser = (username: string): Promise<Maybe<User>> =>
  asafelyOptional(async () => JSON.parse(await Deno.readTextFile(`./data/user/${username}.json`)))

const updateUser = async (username: string, userDetails: Partial<User>): Promise<boolean> => {
  const user = await readUser(username)
  if (user) {
    const result = await asafely(() => Deno.writeTextFile(`./data/user/${user.username}.json`, JSON.stringify({ ...user, ... userDetails })))
    return result[0] === "right"
  }
  return false
}

const deleteUser = async (username: string): Promise<boolean> => {
  const result = await asafely(() => Deno.remove(`./data/user/${username}.json`))
  return result[0] === "right"
}

const imp: Imp = {
  readFile,
  createUser,
  readUser,
  updateUser,
  deleteUser,
}

export default imp
