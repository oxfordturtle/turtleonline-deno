import type { User } from "../types.ts"
import { type Either, type Maybe, asafely, asafelyOptional } from "../utils/tools.ts"

export const readUser = async (usernameOrFields: string | Partial<User>): Promise<Maybe<User>> => {
  const fields = typeof usernameOrFields === "string" ? { username: usernameOrFields } : usernameOrFields
  const users = await readUsers(fields)
  return users[0]
}

export const readUsers = async (fields: Partial<User> = {}): Promise<User[]> => {
  const users = await asafelyOptional<User[]>(async () => JSON.parse(await Deno.readTextFile(usersPath)))
  return users !== undefined
    ? users.filter(user => matches(user, fields))
    : []
}

export const createUser = async (newUser: User): Promise<Either<Error, void>> => {
  const users = await readUsers()

  // prevent username clash
  if (users.find(user => user.username === newUser.username)) {
    return ["left", new Error("duplicate username")]
  }

  // prevent email clash
  if (users.find(user => user.email === newUser.email)) {
    return ["left", new Error("duplicate email")]
  }

  // add user
  users.push(newUser)

  // save to disk
  return updateUsersOnDisk(users)
}

export const updateUser = async (username: string, newDetails: Partial<User>): Promise<Either<Error, void>> => {
  const users = await readUsers()
  const user = users.find(user => user.username === username)
  const userIndex = users.findIndex(user => user.username === username)

  // check user exists
  if (user === undefined) {
    return ["left", new Error("user not found")]
  }

  // prevent new username clash
  if (newDetails.username && newDetails.username !== user.username) {
    const existingUser = users.find(user => user.username === newDetails.username)
    if (existingUser) {
      return ["left", new Error("duplicate username")]
    }
  }

  // prevent new email clash
  if (newDetails.email && newDetails.email !== user.email) {
    const existingUser = users.find(user => user.email === newDetails.email)
    if (existingUser) {
      return ["left", new Error("duplicate email")]
    }
    // make sure emailedConfirmed is false
    newDetails.emailConfirmed = false
  }

  // update user in memory
  users[userIndex] = { ...user, ...newDetails }

  // update users on disk
  return await updateUsersOnDisk(users)
}

export const deleteUser = async (username: string): Promise<Either<Error, void>> => {
  const users = await readUsers()
  const userIndex = users.findIndex(user => user.username === username)

  // check user exists
  if (userIndex < 0) {
    return ["left", new Error("user not found")]
  }

  // update users in memory
  users.splice(userIndex, 1)

  // update users on disk
  return await updateUsersOnDisk(users)
}

const updateUsersOnDisk = (users: User[]): Promise<Either<Error, void>> =>
  asafely(() => Deno.writeTextFile(usersPath, JSON.stringify(users)))

const usersPath = "./data/users.json"

const matches = (user: User, fields: Partial<User>): boolean =>
  (fields.username === undefined || fields.username === user.username) &&
  (fields.email === undefined || fields.email === user.email) &&
  (fields.emailConfirmed === undefined || fields.emailConfirmed === user.emailConfirmed) &&
  (fields.password === undefined || fields.password === user.password) &&
  (fields.lastLoginDate === undefined || fields.lastLoginDate === user.lastLoginDate) &&
  (fields.token === undefined || fields.token === user.token) &&
  (fields.tokenExpires === undefined || fields.tokenExpires === user.tokenExpires) &&
  (fields.firstName === undefined || fields.firstName === user.firstName) &&
  (fields.lastName === undefined || fields.lastName === user.lastName) &&
  (fields.schoolName === undefined || fields.schoolName === user.schoolName) &&
  (fields.schoolPostcode === undefined || fields.schoolPostcode === user.schoolPostcode) &&
  (fields.guardian === undefined || fields.guardian === user.guardian) &&
  (fields.admin === undefined || fields.admin === user.admin) &&
  (fields.receivingEmails === undefined || fields.receivingEmails === user.receivingEmails) &&
  (fields.systemSettings === undefined || fields.systemSettings === user.systemSettings)
