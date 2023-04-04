import { React, Status } from "../../../deps.ts"
import type { Imp, RequestParams, User } from "../../types.ts"
import page from "../_layout/page.tsx"
import { FormInput, FormSelect, FormOption } from "../_layout/form.tsx"
import Feedback, { FeedbackProps } from "../_layout/feedback.tsx"
import { htmlResponse } from "../../utils/response.ts"
import { getFormField } from "../../utils/form.ts"
import error from "../error.tsx"
import BackButton from "./backButton.tsx"

export default (requestParams: RequestParams, user: User, imp: Imp): Promise<Response> =>
  requestParams.method === "GET"
    ? emailResponse(requestParams, user)
    : requestParams.method === "POST"
    ? handleForm(requestParams, user, imp)
    : error(requestParams, Status.MethodNotAllowed)

const emailResponse = (requestParams: RequestParams, user: User, feedback?: FeedbackProps): Promise<Response> =>
  htmlResponse(page(requestParams, header(user), main(user, feedback)))

const handleForm = async (requestParams: RequestParams, user: User, imp: Imp): Promise<Response> => {
  // check for form data
  if (requestParams.formData === undefined) {
    return emailResponse(requestParams, user, { ok: false, message: "You didn't submit any form data." })
  }

  // get form fields
  const email = getFormField("email", requestParams.formData)
  const receivingEmailsString = getFormField("receivingEmails", requestParams.formData) ?? ""
  const receivingEmailsNumber = parseInt(receivingEmailsString)
  const receivingEmails = isNaN(receivingEmailsNumber) ? undefined : Boolean(receivingEmailsNumber)

  // create user details
  const userDetails: Partial<User> = {}
  if (email) userDetails.email = email
  if (receivingEmails !== undefined) userDetails.receivingEmails = receivingEmails

  // (try to) update email details
  return (await imp.updateUser(user.username, userDetails))
    ? emailResponse(
        requestParams,
        { ...user, ...userDetails },
        { ok: true, message: "Your email settings have been updated." }
      )
    : emailResponse(requestParams, user, {
        ok: false,
        message: "Something went wrong saving your data. Please try again.",
      })
}

const header = (user: User): JSX.Element => (
  <h1>
    {user.firstName} {user.lastName}: Edit Email Settings
  </h1>
)

const main = (user: User, feedback?: FeedbackProps): JSX.Element => (
  <>
    <BackButton />
    {feedback ? <Feedback {...feedback} /> : null}
    <div className="form">
      <form method="post">
        <FormInput label="Email Address" id="email" type="email" required={true} value={user.email} />
        <FormSelect label="Email Preferences" id="receivingEmails">
          <FormOption
            label="Keep me informed about updates to the Turtle System by email"
            value="1"
            selectedValue={user.receivingEmails ? "1" : "0"}
          />
          <FormOption
            label="Don't email me about updates to the Turtle System"
            value="0"
            selectedValue={user.receivingEmails ? "1" : "0"}
          />
        </FormSelect>
        <div className="form-buttons">
          <button type="submit" className="green button">
            Update
          </button>
        </div>
      </form>
    </div>
  </>
)
