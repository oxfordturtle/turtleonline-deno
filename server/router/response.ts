import { Status } from "https://deno.land/std@0.161.0/http/mod.ts"
import { extname } from "https://deno.land/std@0.161.0/path/mod.ts"
import type { Imp, RequestParams } from "../types.ts"
import { fileResponse } from "../utils/response.ts"
import about from "../pages/about.tsx"
import account from "../pages/account.tsx"
import contact from "../pages/contact.tsx"
import documentation from "../pages/documentation.tsx"
import download from "../pages/download.ts"
import error from "../pages/error.tsx"
import forgot from "../pages/forgot.tsx"
import index from "../pages/index.tsx"
import login from "../pages/login.tsx"
import logout from "../pages/logout.tsx"
import register from "../pages/register.tsx"
import reset from "../pages/reset.tsx"
import run from "../pages/run.tsx"
import status from "../pages/status.tsx"
import verify from "../pages/verify.tsx"

export default async (requestParams: RequestParams, imp: Imp): Promise<Response> => {
  const assetDirectories = ["downloads", "css", "js", "images", "examples"]
  return assetDirectories.includes(requestParams.sections[0])
    ? await asset(requestParams, imp)
    : await page(requestParams, imp)
}

const asset = async (requestParams: RequestParams, imp: Imp): Promise<Response> => {
  const path =
    requestParams.sections[0] === "downloads"
      ? `./files/downloads/${requestParams.sections.join("/")}`
      : `./public/${requestParams.sections.join("/")}`
  const fileInfo = await imp.readFile(path)
  return fileInfo === undefined ? error(requestParams, Status.NotFound) : fileResponse(fileInfo, extname(path))
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
  download,
  forgot,
  index,
  login,
  logout,
  register,
  reset,
  run,
  status,
  verify,
}
