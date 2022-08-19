import { Status, extname, getCookies, bcrypt } from "../deps.ts"
import type { Imp, RequestParams, User } from "./types.ts"
import { fileResponse } from "./utils/response.ts"
import { asafely, asafelyOptional } from "./utils/tools.ts"
import {
  about,
  account,
  contact,
  documentation,
  error,
  forgot,
  index,
  login,
  logout,
  register,
  run,
  status,
} from "./site/site.tsx"

export default async (request: Request, imp: Imp): Promise<Response> => {
  const requestParams = await parseRequest(request, imp)
  const result = await asafely(() => response(requestParams, imp))
  if (result[0] === "left") {
    console.log(result[1])
    return error(requestParams, Status.InternalServerError)
  }
  return result[1]
}

const parseRequest = async (request: Request, imp: Imp): Promise<RequestParams> => {
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

const response = async (requestParams: RequestParams, imp: Imp): Promise<Response> => {
  const assetDirectories = ["downloads", "css", "js", "images", "examples"]
  return assetDirectories.includes(requestParams.sections[0])
    ? await asset(requestParams, imp)
    : await page(requestParams, imp)
}

const asset = async (requestParams: RequestParams, imp: Imp): Promise<Response> => {
  const path = requestParams.sections[0] === "downloads"
    ? `./data/${requestParams.sections.join("/")}`
    : `./public/${requestParams.sections.join("/")}`
  const fileInfo = await imp.readFile(path)
  return fileInfo === undefined
    ? error(requestParams, Status.NotFound)
    : fileResponse(fileInfo, extname(path))
}

const page = async (requestParams: RequestParams, imp: Imp): Promise<Response> =>
  handler[requestParams.sections[0]]
    ? await handler[requestParams.sections[0]](requestParams, imp)
    : error(requestParams, Status.NotFound)

const handler: Record<string, (requestParams: RequestParams, imp: Imp) => Response | Promise<Response>> = {
  about,
  account,
  contact,
  documentation,
  forgot,
  index,
  login,
  logout,
  register,
  run,
  status,
}
