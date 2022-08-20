import { getCookies } from "http"
import * as bcrypt from "bcrypt"
import type { Imp, RequestParams, User } from "../types.ts"
import { asafelyOptional } from "../utils/tools.ts"

export default async (request: Request, imp: Imp): Promise<RequestParams> => {
  const method = request.method
  const url = new URL(request.url)
  const sections = combinePath(splitPath(url.pathname))
  const page = sections[1] ?? sections[0]
  const formData = await asafelyOptional(() => request.formData())
  const user = await userFromSession(getCookies(request.headers), imp)
  return { method, url, sections, page, formData, user }
}

const splitPath = (path: string) => path.split("/").slice(1).filter(x => x !== "")
  
const combinePath = (bits: string[]): [string, ...string[]] => [bits[0] || "index", ...bits.slice(1)]

const userFromSession = async (cookies: Record<string, string>, imp: Imp): Promise<User | undefined> => {
  const username = cookies["username"]
  const key = cookies["key"]
  const isValid = username && key && await bcrypt.compare(username, key)
  return isValid ? asafelyOptional(() => imp.readUser(username)) : undefined
}
