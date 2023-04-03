import { Status } from "https://deno.land/std@0.161.0/http/mod.ts"
import { extname } from "https://deno.land/std@0.161.0/path/mod.ts"
import { Imp, RequestParams } from "../types.ts"
import { fileResponse } from "../utils/response.ts"
import error from "./error.tsx"

export default (requestParams: RequestParams, imp: Imp): Promise<Response> =>
  ["14", "15"].includes(requestParams.sections[1])
    ? downloadResponse(requestParams, requestParams.sections[1], imp)
    : error(requestParams, Status.NotFound)

const downloadResponse = async (requestParams: RequestParams, version: string, imp: Imp): Promise<Response> => {
  const path = `./files/turtle/TurtleSystem_${version}.exe`
  const fileInfo = await imp.readFile(path)
  return fileInfo === undefined ? error(requestParams, Status.NotFound) : fileResponse(fileInfo, extname(path))
}
