import type { User } from "../types.ts"
import { type Either, type Maybe, asafely, asafelyOptional } from "../utils/tools.ts"

export const createUser = async (user: User): Promise<Either<Error, void>> => {
  const existingUser = await readUser(user.username)
  return existingUser
    ? ["left", new Error("duplicate username")]
    : await asafely(() => Deno.writeTextFile(path(user.username), JSON.stringify(user)))
}

export const readUser = async (fields: string | Partial<User>): Promise<Maybe<User>> =>
  typeof fields === "string"
    ? asafelyOptional(async () => JSON.parse(await Deno.readTextFile(path(fields))))
    : (await readUsers(fields))[0]

export const readUsers = async (fields: Partial<User>): Promise<User[]> => {
  const users: User[] = []
  for await (const dirEntry of Deno.readDir("./data/user")) {
    if (dirEntry.isFile) {
      const user = await asafelyOptional<User>(async () =>
        JSON.parse(await Deno.readTextFile(`./data/user/${dirEntry.name}`))
      )
      if (user && matches(user, fields)) {
        users.push(user)
      }
    }
  }
  return users
}

export const updateUser = async (username: string, userDetails: Partial<User>): Promise<Either<Error, void>> => {
  const user = await readUser({ username })
  if (user === undefined) return ["left", new Error("user not found")]

  if (userDetails.username && userDetails.username !== username) {
    const existingUser = await readUser(userDetails.username)
    if (existingUser) return ["left", new Error("duplicate username")]
    return await asafely(async () => {
      await Deno.writeTextFile(path(userDetails.username!), JSON.stringify({ ...user, ...userDetails }))
      await deleteUser(username)
    })
  }

  return await asafely(() => Deno.writeTextFile(path(username), JSON.stringify({ ...user, ...userDetails })))
}

export const deleteUser = async (username: string): Promise<Either<Error, void>> =>
  await asafely(() => Deno.remove(path(username)))

const path = (username: string): string => `./data/user/${username}.json`

const matches = (user: User, fields: Partial<User>): boolean =>
  (fields.username === undefined || fields.username === user.username) &&
  (fields.email === undefined || fields.email === user.email) &&
  (fields.password === undefined || fields.password === user.password) &&
  (fields.emailConfirmed === undefined || fields.emailConfirmed === user.emailConfirmed) &&
  (fields.token === undefined || fields.token === user.token) &&
  (fields.firstName === undefined || fields.firstName === user.firstName) &&
  (fields.lastName === undefined || fields.lastName === user.lastName) &&
  (fields.accountType === undefined || fields.accountType === user.accountType) &&
  (fields.guardian === undefined || fields.guardian === user.guardian) &&
  (fields.schoolName === undefined || fields.schoolName === user.schoolName) &&
  (fields.schoolPostcode === undefined || fields.schoolPostcode === user.schoolPostcode) &&
  (fields.receivingEmails === undefined || fields.receivingEmails === user.receivingEmails)
