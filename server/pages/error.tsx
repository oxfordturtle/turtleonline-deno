import React from "react";
import { STATUS_CODE } from "http";
import type { RequestParams } from "../types.ts";
import page from "./_layout/page.tsx";
import { htmlResponse } from "../utils/response.ts";

export type ErrorCode =
  | typeof STATUS_CODE.NotFound
  | typeof STATUS_CODE.MethodNotAllowed
  | typeof STATUS_CODE.BadRequest
  | typeof STATUS_CODE.InternalServerError
  | typeof STATUS_CODE.Forbidden;

export default (
  requestParams: RequestParams,
  errorCode: ErrorCode
): Promise<Response> =>
  htmlResponse(errorPages[errorCode](requestParams), errorCode);

const notFound = (requestParams: RequestParams): string =>
  page(
    requestParams,
    <h1>Not Found</h1>,
    <p>
      This page could not be found. Please navigate the site using the menus
      above.
    </p>
  );

const methodNotAllowed = (requestParams: RequestParams): string =>
  page(
    requestParams,
    <h1>Method not Allowed</h1>,
    <p>This method is not allowed at this URL.</p>
  );

const badRequest = (requestParams: RequestParams): string =>
  page(
    requestParams,
    <h1>Bad Request</h1>,
    <p>The data you sent doesn't make sense.</p>
  );

const forbidden = (requestParams: RequestParams): string =>
  page(
    requestParams,
    <h1>Login Required</h1>,
    <p>
      This page is for registered users only. Please register or sign up for a
      free account.
    </p>
  );

const internalServerError = (requestParams: RequestParams): string =>
  page(
    requestParams,
    <h1>Internal Server Error</h1>,
    <p>Something went wrong.</p>
  );

const errorPages: Record<ErrorCode, (requestParams: RequestParams) => string> =
  {
    [STATUS_CODE.NotFound]: notFound,
    [STATUS_CODE.MethodNotAllowed]: methodNotAllowed,
    [STATUS_CODE.BadRequest]: badRequest,
    [STATUS_CODE.Forbidden]: forbidden,
    [STATUS_CODE.InternalServerError]: internalServerError,
  };
