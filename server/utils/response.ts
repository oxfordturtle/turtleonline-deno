import { Status, bcrypt, contentType, deleteCookie, setCookie } from "../../deps.ts"

export const htmlResponse = async (html: string, status: Status = Status.OK, username?: string | null): Promise<Response> =>
  new Response(html, await responseInit("text/html", status, username))

export const jsonResponse = async (object: Record<string, unknown>, status: Status = Status.OK, username?: string | null): Promise<Response> =>
  new Response(JSON.stringify(object), await responseInit("application/json", status, username))

export const fileResponse = async (file: Uint8Array, ext: string, username?: string | null): Promise<Response> =>
  new Response(file, await responseInit(contentType(ext) ?? "application/octet-stream", Status.OK, username))

export const redirectResponse = async (path: string, username?: string | null): Promise<Response> =>
  new Response(null, await redirectResponseInit(path, username))

const responseInit = async (contentType: string, status: number, username?: string | null): Promise<ResponseInit> => {
  const headers = new Headers(headersInit(contentType))
  await fixCookies(headers, username)
  return { headers, status }
}

const redirectResponseInit = async (url: string, username?: string | null): Promise<ResponseInit> => {
  const headers = new Headers()
  headers.append("location", url)
  await fixCookies(headers, username)
  return { headers, status: Status.Found}
}

const headersInit = (contentType: string): HeadersInit => ({
  "content-type": contentType,
  date: new Date().toUTCString(),
})

const fixCookies = async (headers: Headers, username?: string | null): Promise<void> => {
  if (username !== undefined) {
    if (username === null) {
      deleteCookie(headers, "username")
    } else {
      const key = await bcrypt.hash(username, await bcrypt.genSalt())
      setCookie(headers, { name: "username", value: username })
      setCookie(headers, { name: "key", value: key })
    }
  }
}
