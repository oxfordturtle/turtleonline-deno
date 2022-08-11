import { Status, extname } from "../deps.ts"
import { type ParsedRequest, parseRequest } from "./request.ts"
import { fileResponse } from "./utils/response.ts"
import { error, index, status, data, run, documentation, contact, about, register, login, forgot } from "./site/site.ts"
import { type Either, safely } from "./utils/tools.ts"

export default async (request: Request): Promise<Response> => response(await parseRequest(request))

const response = (request: ParsedRequest): Response =>
  ["downloads", "css", "js", "images", "examples"].includes(request.sections[0])
    ? asset(request)
    : page(request)

const asset = (request: ParsedRequest): Response => request.sections[0] === "downloads"
  ? createFileResponse(request, `./data/${request.sections.join("/")}`, readFile(`./data/${request.sections.join("/")}`))
  : createFileResponse(request, `./public/${request.sections.join("/")}`, readFile(`./public/${request.sections.join("/")}`))

const readFile = (path: string) => safely(() => Deno.readFileSync(path))

const createFileResponse = (request: ParsedRequest, path: string, fileInfo: Either<Error, Uint8Array>) => fileInfo[0] === "left"
  ? error(request, Status.NotFound)
  : fileResponse(fileInfo[1], extname(path))

const page = (request: ParsedRequest): Response =>
  handler[request.sections[0]] ? handler[request.sections[0]](request) : error(request, Status.NotFound)

const handler: Record<string, (request: ParsedRequest) => Response> = {
  index,
  status,
  data,
  run,
  documentation,
  contact,
  about,
  register,
  login,
  forgot,
}
