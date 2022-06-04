import { getCookies } from "../deps.ts"
import { Either, asafely, safelyOptional } from "./utils/tools.ts"

export type ParsedRequest = {
  method: string
  session: Session
  sections: [string, ...string[]]
  searchParams: URLSearchParams
  jsonData: Either<Error, Record<string, unknown>>
}

export type Session = { username: false | string }

export const parseRequest = async (request: Request): Promise<ParsedRequest> => ({
  method: request.method,
  session: session(request),
  sections: sections(request),
  searchParams: searchParams(request),
  jsonData: await asafely(async () => await request.json()),
})

const session = (request: Request) => getSession(getCookies(request.headers)["x"]) ?? { username: false }

const getSession = (sessionId: string) =>
  safelyOptional(() => JSON.parse(Deno.readTextFileSync(`./session/${sessionId}`)) as Session)

const sections = (request: Request): [string, ...string[]] => combinePath(splitPath(new URL(request.url).pathname))

const splitPath = (path: string) => path.split("/").slice(1)

const combinePath = (bits: string[]): [string, ...string[]] => [bits[0] || "index", ...bits.slice(1)]

const searchParams = (request: Request) => new URL(request.url).searchParams
