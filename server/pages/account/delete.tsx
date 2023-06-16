import React from "react"
import { Status } from "http"
import type { Imp, RequestParams, User } from "../../types.ts"
import page from "../_layout/page.tsx"
import Feedback, { FeedbackProps } from "../_layout/feedback.tsx"
import { htmlResponse } from "../../utils/response.ts"
import error from "../error.tsx"
import BackButton from "./backButton.tsx"

export default (requestParams: RequestParams, user: User, imp: Imp): Promise<Response> =>
  requestParams.method === "GET"
    ? deleteResponse(requestParams, user)
    : requestParams.method === "POST"
    ? handleForm(requestParams, user, imp)
    : error(requestParams, Status.MethodNotAllowed)

const deleteResponse = (requestParams: RequestParams, user: User, feedback?: FeedbackProps): Promise<Response> =>
  htmlResponse(page(requestParams, header(user), main(feedback)))

const handleForm = async (requestParams: RequestParams, user: User, imp: Imp): Promise<Response> =>
  (await imp.deleteUser(user.username))
    ? htmlResponse(
        page(requestParams, <h1>Account Deleted</h1>, <p>Your account has been deleted.</p>),
        Status.OK,
        null
      )
    : deleteResponse(requestParams, user, {
        ok: false,
        message: "Something went wrong deleting your account. Please try again.",
      })

const header = (user: User): JSX.Element => (
  <h1>
    {user.firstName} {user.lastName}: Delete your Account
  </h1>
)

const main = (feedback?: FeedbackProps): JSX.Element => (
  <>
    <BackButton />
    {feedback ? <Feedback {...feedback} /> : null}
    <p>
      Are you sure you want to delete your account? All of your details and files on our server will be deleted, and
      this action cannot be undone. You can sign up again for a new account at any time.
    </p>
    <div className="form">
      <form method="post">
        <div className="form-buttons">
          <button type="submit" className="red button">
            Delete Account
          </button>
        </div>
      </form>
    </div>
  </>
)
