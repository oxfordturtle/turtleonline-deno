import { Status } from "http"
import { extname } from "path"
import type { Imp, RequestParams } from "../types.ts"
import { fileResponse } from "../utils/response.ts"
import about from "../pages/about.tsx"
import account from "../pages/account.tsx"
import contact from "../pages/contact.tsx"
import documentation from "../pages/documentation.tsx"
import error from "../pages/error.tsx"
import forgot from "../pages/forgot.tsx"
import index from "../pages/index.tsx"
import login from "../pages/login.tsx"
import logout from "../pages/logout.tsx"
import register from "../pages/register.tsx"
import run from "../pages/run.tsx"
import status from "../pages/status.tsx"

export default async (requestParams: RequestParams, imp: Imp): Promise<Response> => {
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
