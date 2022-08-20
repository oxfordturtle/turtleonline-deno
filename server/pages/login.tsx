import React from "react"
import { Status } from "http"
import * as bcrypt from "bcrypt"
import type { Imp, RequestParams } from "../types.ts"
import page from "./_layout/page.tsx"
import Feedback, { FeedbackProps } from "./_layout/feedback.tsx"
import { FormInput } from "./_layout/form.tsx"
import { htmlResponse, redirectResponse } from "../utils/response.ts"
import { getFormField } from "../utils/form.ts"
import error from "./error.tsx"

export default async (requestParams: RequestParams, imp: Imp): Promise<Response> =>
  requestParams.method === "GET"
    ? loginResponse(requestParams)
    : requestParams.method === "POST"
    ? await handleForm(requestParams, imp)
    : error(requestParams, Status.MethodNotAllowed)

const loginResponse = (requestParams: RequestParams, feedback?: FeedbackProps): Promise<Response> =>
  htmlResponse(page(requestParams, header, main(requestParams.formData, feedback)))

const handleForm = async (requestParams: RequestParams, imp: Imp): Promise<Response> => {
  // check for form data
  if (requestParams.formData === undefined) {
    return loginResponse(requestParams, { ok: false, message: "You didn't submit any form data." })
  }

  // get form fields
  const username = getFormField("username", requestParams.formData)
  const password = getFormField("password", requestParams.formData)

  // validate form data
  if (!username) return loginResponse(requestParams, { ok: false, message: "Username is required." })
  if (!password) return loginResponse(requestParams, { ok: false, message: "Password is required." })
  const user = await imp.readUser(username)
  if (user === undefined) return loginResponse(requestParams, { ok: false, message: "Unknown username." })
  if (!(await bcrypt.compare(password, user.password)))
    return loginResponse(requestParams, { ok: false, message: "Incorrect password." })

  // login and redirect to home page
  return redirectResponse(requestParams.url.origin, username)
}

const header: JSX.Element = <h1>Sign In</h1>

const main = (formData?: FormData, feedback?: FeedbackProps): JSX.Element => (
  <div className="form">
    {feedback ? <Feedback {...feedback} /> : null}
    <form method="post">
      <FormInput
        type="text"
        id="username"
        label="Username"
        required={true}
        autoFocus={true}
        value={formData?.get("username")}
      />
      <FormInput type="password" id="password" label="Password" required={true} />
      <div className="form-buttons">
        <a href="/forgot">Forgot Credentials?</a>
        <button type="submit" className="green button">
          Login
        </button>
      </div>
    </form>
  </div>
)
