import { Status } from "../../../deps.ts"
import { ParsedRequest } from "../../request.ts"
import { jsonResponse } from "../../utils/response.ts"
import { safely, safelyOptional } from "../../utils/tools.ts"

export type User = {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  accountType: 1 | 2
  guardian?: string
  schoolName?: string
  schoolPostcode?: string
}

export const user = (request: ParsedRequest): Response =>
  request.session.username !== request.sections[2]
    ? jsonResponse({ error: "permission denied" }, Status.Forbidden)
    : handlers[request.method] ? handlers[request.method](request) : jsonResponse({ error: "user not found" }, Status.NotFound)

const getUser = (request: ParsedRequest) => {
  const user = get(request.sections[2])
  return user ? jsonResponse(user) : jsonResponse({ error: "user not found" }, Status.NotFound)
}

const persistUser = (request: ParsedRequest) => {
  const payload = request.jsonData
  if (payload[0] === "left") {
    return jsonResponse({ error: "invalid user data" }, Status.BadRequest)
  }

  if (isUser(payload[1])) {
    const result = persist(payload[1])
    return result[0] === "left"
      ? jsonResponse({ error: "failed to save user" }, Status.InternalServerError)
      : jsonResponse({ success: "user saved" })
  }
  return jsonResponse({ error: "invalid user data" }, Status.BadRequest)
}

const handlers: Record<string, (request: ParsedRequest) => Response> = {
  GET: getUser,
  POST: persistUser,
}

const isUser = (payload: Record<string, unknown>): payload is User =>
  typeof payload.username === "string" &&
  typeof payload.email === "string" &&
  typeof payload.password === "string" &&
  typeof payload.firstName === "string" &&
  typeof payload.lastName === "string" &&
  (payload.accountType === 1 || payload.accountType === 2) &&
  (payload.guardian === undefined || typeof payload.guardian === "string") &&
  (payload.schoolName === undefined || typeof payload.schoolName === "string") &&
  (payload.schoolPostcode === undefined || typeof payload.schoolPostcode === "string")

const get = (username: string) =>
  safelyOptional(() => JSON.parse(Deno.readTextFileSync(`./data/user/${username}.json`)) as User)

const persist = (user: User) =>
  safely(() => Deno.writeTextFileSync(`./data/user/${user.username}.json`, JSON.stringify(user)))
