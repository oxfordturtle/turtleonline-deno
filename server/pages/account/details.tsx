import React from "react"
import { Status } from "http"
import type { Imp, RequestParams, User } from "../../types.ts"
import page from "../_layout/page.tsx"
import { FormInput, FormOption, FormSelect } from "../_layout/form.tsx"
import Feedback, { FeedbackProps } from "../_layout/feedback.tsx"
import { htmlResponse } from "../../utils/response.ts"
import { getFormField } from "../../utils/form.ts"
import error from "../error.tsx"
import BackButton from "./backButton.tsx"

export default (requestParams: RequestParams, user: User, imp: Imp): Promise<Response> =>
  requestParams.method === "GET"
    ? detailsResponse(requestParams, user)
    : requestParams.method === "POST"
    ? handleForm(requestParams, user, imp)
    : error(requestParams, Status.MethodNotAllowed)

const detailsResponse = (requestParams: RequestParams, user: User, feedback?: FeedbackProps): Promise<Response> =>
  htmlResponse(page(requestParams, header(user), main(user, feedback)))

const handleForm = async (requestParams: RequestParams, user: User, imp: Imp): Promise<Response> => {
  // check for form data
  if (requestParams.formData === undefined) {
    return detailsResponse(requestParams, user, { ok: false, message: "You didn't submit any form data." })
  }

  // get form fields
  const username = getFormField("username", requestParams.formData)
  const firstName = getFormField("firstName", requestParams.formData)
  const lastName = getFormField("lastName", requestParams.formData)
  const accountTypeString = getFormField("accountType", requestParams.formData)
  const accountTypeNumber = parseInt(accountTypeString!)
  const accountType = accountTypeNumber === 1 || accountTypeNumber === 2 ? accountTypeNumber : undefined
  const guardian = getFormField("guardian", requestParams.formData)
  const schoolName = getFormField("schoolName", requestParams.formData)
  const schoolPostcode = getFormField("schoolPostcode", requestParams.formData)

  // create user details
  const userDetails: Partial<User> = {}
  if (username) userDetails.username = username
  if (firstName) userDetails.firstName = firstName
  if (lastName) userDetails.lastName = lastName
  if (accountType) userDetails.accountType = accountType
  if (guardian) userDetails.guardian = guardian
  if (schoolName) userDetails.schoolName = schoolName
  if (schoolPostcode) userDetails.schoolPostcode = schoolPostcode

  // validate user details
  if (userDetails.accountType === 2 && userDetails.guardian === undefined) {
    return detailsResponse(requestParams, user, { ok: false, message: "Name of parent or guardian is required." })
  }
  if (username && username !== user.username && (await imp.readUser(username)) !== undefined) {
    return detailsResponse(requestParams, user, { ok: false, message: "Username is already taken." })
  }

  // (try to) update the user
  return (await imp.updateUser(user.username, userDetails))
    ? detailsResponse(
        requestParams,
        { ...user, ...userDetails },
        { ok: true, message: "Your account details have been updated." }
      )
    : detailsResponse(requestParams, user, {
        ok: false,
        message: "Something went wrong saving your data. Please try again.",
      })
}

const header = (user: User): JSX.Element => (
  <h1>
    {user.firstName} {user.lastName}: Edit Details
  </h1>
)

const main = (user: User, feedback?: FeedbackProps): JSX.Element => (
  <>
    <BackButton />
    {feedback ? <Feedback {...feedback} /> : null}
    <div className="form">
      <form className="form" method="post">
        <FormInput label="Username" id="username" type="text" value={user.username} required={true} />
        <div className="columns">
          <div className="column">
            <FormInput label="First Name" id="firstName" type="text" value={user.firstName} required={true} />
          </div>
          <div className="column">
            <FormInput label="Last Name" id="lastName" type="text" value={user.lastName} required={true} />
          </div>
        </div>
        <FormSelect id="accountType" label="Account Type" value="1" required={true}>
          <FormOption
            label="This account is for me, and I am at least 13 years old"
            value="1"
            selectedValue={user.accountType.toString()}
          />
          <FormOption
            label="This account is for a child under 13, and I am their legal guardian"
            value="2"
            selectedValue={user.accountType.toString()}
          />
        </FormSelect>
        <FormInput id="guardian" label="Full Name of Parent/Guardian" type="text" value={user.guardian} />
        <div className="columns">
          <div className="column">
            <FormInput label="School Name (optional)" id="schoolName" type="text" value={user.schoolName} />
          </div>
          <div className="column">
            <FormInput label="School Postcode (optional)" id="schoolPostcode" type="text" value={user.schoolPostcode} />
          </div>
        </div>
        <div className="form-buttons">
          <button type="submit" className="green button">
            Update
          </button>
        </div>
      </form>
    </div>
  </>
)
