import { Status } from "../../deps.ts"
import { type ParsedRequest } from "../request.ts"
import page from "../layout/page.ts"
import { htmlResponse } from "../utils/response.ts"

export type ErrorCode = Status.NotFound | Status.InternalServerError

export default (request: ParsedRequest, errorCode: ErrorCode): Response => htmlResponse(errorPages[errorCode](request), errorCode)

const errorPages: Record<ErrorCode, (request: ParsedRequest) => string> = {
  [Status.NotFound]: (request: ParsedRequest) =>
    page(
      request,
      "<h1>Not Found</h1>",
      "<p>This page could not be found. Please navigate the site using the menus above.</p>"
    ),
  [Status.InternalServerError]: (request: ParsedRequest) =>
    page(request, "<h1>Internal Server Error</h1>", "<p>Something went wrong.</p>"),
}
