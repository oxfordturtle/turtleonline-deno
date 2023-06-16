import React from "react"
import { Status } from "http"
import type { RequestParams } from "../types.ts"
import page from "./_layout/page.tsx"
import { htmlResponse } from "../utils/response.ts"

export type ErrorCode =
  | Status.NotFound
  | Status.MethodNotAllowed
  | Status.BadRequest
  | Status.InternalServerError
  | Status.Forbidden

export default (requestParams: RequestParams, errorCode: ErrorCode): Promise<Response> =>
  htmlResponse(errorPages[errorCode](requestParams), errorCode)

const notFound = (requestParams: RequestParams): string =>
  page(
    requestParams,
    <h1>Not Found</h1>,
    <p>This page could not be found. Please navigate the site using the menus above.</p>
  )

const methodNotAllowed = (requestParams: RequestParams): string =>
  page(requestParams, <h1>Method not Allowed</h1>, <p>This method is not allowed at this URL.</p>)

const badRequest = (requestParams: RequestParams): string =>
  page(requestParams, <h1>Bad Request</h1>, <p>The data you sent doesn't make sense.</p>)

const forbidden = (requestParams: RequestParams): string =>
  page(
    requestParams,
    <h1>Login Required</h1>,
    <p>This page is for registered users only. Please register or sign up for a free account.</p>
  )

const internalServerError = (requestParams: RequestParams): string =>
  page(requestParams, <h1>Internal Server Error</h1>, <p>Something went wrong.</p>)

const errorPages: Record<ErrorCode, (requestParams: RequestParams) => string> = {
  [Status.NotFound]: notFound,
  [Status.MethodNotAllowed]: methodNotAllowed,
  [Status.BadRequest]: badRequest,
  [Status.Forbidden]: forbidden,
  [Status.InternalServerError]: internalServerError,
}
