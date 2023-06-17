import React from "react"
import { Status } from "http"
import type { Imp, RequestParams } from "../types.ts"
import page from "./_layout/page.tsx"
import { htmlResponse } from "../utils/response.ts"
import error from "./error.tsx"

export default async (requestParams: RequestParams, imp: Imp): Promise<Response> =>
  (await isValidUserToken(imp, requestParams.sections[1], requestParams.sections[2]))
    ? verifyResponse(requestParams, requestParams.sections[1], imp)
    : error(requestParams, Status.NotFound)

// TODO: this function is duplicated in reset.tsx
const isValidUserToken = async (imp: Imp, username: string, token: string): Promise<boolean> => {
  const user = await imp.readUser(username)
  // if tokenExpires is null, the date comparison will be false, which is fine
  return user !== undefined && user.token === token && new Date(user.tokenExpires!) > new Date()
}
    
const verifyResponse = async (requestParams: RequestParams, username: string, imp: Imp): Promise<Response> => {
  const result = await imp.updateUser(username, { emailConfirmed: true, tokenExpires: new Date().toString() })
  return result[0] === "right"
    ? htmlResponse(page(requestParams, header, main(true)))
    : htmlResponse(page(requestParams, header, main(false)))
}

const header: JSX.Element = <h1>Verify Your Email Address</h1>

const main = (success: boolean): JSX.Element =>
  success ? (
    <p>Your email address has been confirmed.</p>
  ) : (
    <p>Failed to confirm your email address. Please try again later.</p>
  )
