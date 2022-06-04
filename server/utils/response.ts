import { Status, contentType } from "../../deps.ts"

export const htmlResponse = (html: string, status: Status = Status.OK): Response =>
  new Response(html, responseInit("text/html", status))

export const jsonResponse = (object: Record<string, unknown>, status: Status = Status.OK): Response =>
  new Response(JSON.stringify(object), responseInit("application/json", status))

export const fileResponse = (file: Uint8Array, ext: string): Response =>
  new Response(file, responseInit(contentType(ext) ?? "application/octet-stream", Status.OK))

const responseInit = (contentType: string, status: number): ResponseInit => ({
  headers: headersInit(contentType),
  status,
})

const headersInit = (contentType: string): HeadersInit => ({
  "content-type": contentType,
  date: new Date().toUTCString(),
})
