import type { User } from "../types.ts"
import { type Either, type Maybe, asafely, asafelyOptional } from "../utils/tools.ts"

export const createUser = async (user: User): Promise<Either<Error, void>> => {
  const existingUser = await readUser(user.username)
  return existingUser
    ? ["left", new Error("duplicate username")]
    : await asafely(() => Deno.writeTextFile(path(user.username), JSON.stringify(user)))
}

export const readUser = (username: string): Promise<Maybe<User>> =>
  asafelyOptional(async () => JSON.parse(await Deno.readTextFile(path(username))))

export const updateUser = async (username: string, userDetails: Partial<User>): Promise<Either<Error, void>> => {
  const user = await readUser(username)
  if (user === undefined) return ["left", new Error("user not found")]

  if (userDetails.username && userDetails.username !== username) {
    const existingUser = await readUser(userDetails.username)
    if (existingUser) return ["left", new Error("duplicate username")]
    return await asafely(async () => {
      await Deno.writeTextFile(path(userDetails.username!), JSON.stringify({ ...user, ...userDetails }))
      await deleteUser(username)
    })
  }

  return await asafely(() =>
    Deno.writeTextFile(path(username), JSON.stringify({ ...user, ...userDetails }))
  )
}

export const deleteUser = async (username: string): Promise<Either<Error, void>> =>
  await asafely(() => Deno.remove(path(username)))

const path = (username: string): string => `./data/user/${username}.json`
