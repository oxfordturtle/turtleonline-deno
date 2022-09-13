import React from "react"
import { Status } from "http"
import * as bcrypt from "bcrypt"
import type { Imp, RequestParams } from "../types.ts"
import page from "./_layout/page.tsx"
import { htmlResponse } from "../utils/response.ts"
import { getFormField } from "../utils/form.ts"
import error from "./error.tsx"
import Feedback, { FeedbackProps } from "./_layout/feedback.tsx"
import { FormInput } from "./_layout/form.tsx"

export default async (requestParams: RequestParams, imp: Imp): Promise<Response> =>
  (await isValidUserToken(imp, requestParams.sections[1], requestParams.sections[2]))
    ? requestParams.method === "GET"
      ? resetResponse(requestParams)
      : requestParams.method === "POST"
      ? handleForm(requestParams, requestParams.sections[1], imp)
      : error(requestParams, Status.MethodNotAllowed)
    : error(requestParams, Status.NotFound)

const isValidUserToken = async (imp: Imp, username: string, token: string): Promise<boolean> => {
  const user = await imp.readUser(username)
  return user !== undefined && user.token === token && new Date(user.tokenExpires) > new Date()
}

const resetResponse = (requestParams: RequestParams, feedback?: FeedbackProps): Promise<Response> =>
  htmlResponse(page(requestParams, header, main(feedback)))

const handleForm = async (requestParams: RequestParams, username: string, imp: Imp): Promise<Response> => {
  // check for form data
  if (!requestParams.formData) {
    return resetResponse(requestParams, { ok: false, message: "You didn't submit any form data." })
  }

  // get form fields
  const password1 = getFormField("password1", requestParams.formData)
  const password2 = getFormField("password2", requestParams.formData)

  // validate form data
  if (!password1) {
    return resetResponse(requestParams, { ok: false, message: "New password cannot be blank." })
  }
  if (!password2) {
    return resetResponse(requestParams, { ok: false, message: "Repeat password cannot be blank." })
  }
  if (password1 !== password2) {
    return resetResponse(requestParams, { ok: false, message: "New passwords don't match." })
  }

  // (try to) update user's password
  const password = await bcrypt.hash(password1, await bcrypt.genSalt())
  const tokenExpires = new Date().toString()
  const result = await imp.updateUser(username, { password, tokenExpires })
  if (result[0] === "left") {
    return resetResponse(requestParams, { ok: false, message: "Failed to update password. Please try again later." })
  }

  // return happy response
  return resetResponse(requestParams, {
    ok: true,
    message: "Your password has been reset. You can now login using your new password.",
  })
}

const header = <h1>Reset Password</h1>

const main = (feedback?: FeedbackProps): JSX.Element => (
  <div className="form">
    {feedback ? <Feedback {...feedback} /> : null}
    <form method="post">
      <FormInput id="password1" label="New Password" type="password" required={true} />
      <FormInput id="password2" label="Repeat Password" type="password" required={true} />
      <div className="form-buttons">
        <button type="submit" className="green button">
          Reset Password
        </button>
      </div>
    </form>
  </div>
)
