import React from "react"
import { Status } from "http"
import * as bcrypt from "bcrypt"
import type { Imp, User, RequestParams } from "../types.ts"
import page from "./_layout/page.tsx"
import Feedback, { FeedbackProps } from "./_layout/feedback.tsx"
import { FormInput, FormSelect, FormOption } from "./_layout/form.tsx"
import { htmlResponse, redirectResponse } from "../utils/response.ts"
import { getFormField } from "../utils/form.ts"
import error from "./error.tsx"

export default (requestParams: RequestParams, imp: Imp): Promise<Response> =>
  requestParams.method === "GET"
    ? registerResponse(requestParams)
    : requestParams.method === "POST"
    ? handleForm(requestParams, imp)
    : error(requestParams, Status.MethodNotAllowed)

const registerResponse = (requestParams: RequestParams, feedback?: FeedbackProps): Promise<Response> =>
  htmlResponse(page(requestParams, header, main(requestParams.formData, feedback)))

const handleForm = async (requestParams: RequestParams, imp: Imp): Promise<Response> => {
  // check for form data
  if (requestParams.formData === undefined) {
    return registerResponse(requestParams, { ok: false, message: "You didn't submit any form data." })
  }

  // get form fields
  const username = getFormField("username", requestParams.formData)
  const email = getFormField("email", requestParams.formData)
  const password1 = getFormField("password1", requestParams.formData)
  const password2 = getFormField("password2", requestParams.formData)
  const firstName = getFormField("firstName", requestParams.formData)
  const lastName = getFormField("lastName", requestParams.formData)
  const accountTypeString = getFormField("accountType", requestParams.formData)
  const accountTypeNumber = accountTypeString ? parseInt(accountTypeString) : undefined
  const accountType = accountTypeNumber === 1 || accountTypeNumber === 2 ? accountTypeNumber : undefined
  const guardian = getFormField("guardian", requestParams.formData)
  const schoolName = getFormField("schoolName", requestParams.formData)
  const schoolPostcode = getFormField("schoolPostcode", requestParams.formData)

  // validate form data
  if (!username) {
    return registerResponse(requestParams, { ok: false, message: "Username is required." })
  }
  if (await imp.readUser(username)) {
    return registerResponse(requestParams, { ok: false, message: "Username is already taken." })
  }
  if (!email) {
    return registerResponse(requestParams, { ok: false, message: "Email is required." })
  }
  if (!password1) {
    return registerResponse(requestParams, { ok: false, message: "Password is required." })
  }
  if (!password2) {
    return registerResponse(requestParams, { ok: false, message: "Repeated password is required." })
  }
  if (password1 !== password2) {
    return registerResponse(requestParams, { ok: false, message: "Passwords don't match." })
  }
  if (!firstName) {
    return registerResponse(requestParams, { ok: false, message: "First name is required." })
  }
  if (!lastName) {
    return registerResponse(requestParams, { ok: false, message: "Last name is required." })
  }
  if (!accountType) {
    return registerResponse(requestParams, { ok: false, message: "Invalid account type." })
  }
  if (accountType === 2 && !guardian) {
    return registerResponse(requestParams, { ok: false, message: "Full name of parent/guardian is required." })
  }

  // create user out of form data
  const token = crypto.randomUUID()
  const tokenExpires = new Date()
  tokenExpires.setHours(tokenExpires.getHours() + 24)
  const user: User = {
    username,
    email,
    password: await bcrypt.hash(password1, await bcrypt.genSalt()),
    emailConfirmed: false,
    token,
    tokenExpires: tokenExpires.toString(),
    firstName,
    lastName,
    accountType,
    guardian,
    schoolName,
    schoolPostcode,
    receivingEmails: true,
  }

  // (try to) create an account
  const result = await imp.createUser(user)

  if (result[0] === "left") {
    return registerResponse(requestParams, {
      ok: false,
      message: "Something went wrong creating your account. Please try again.",
    })
  }

  // (try to) send a confirmation email
  const response = await imp.sendVerifyEmail(user)
  if (!response.success) {
    return registerResponse(requestParams, {
      ok: false,
      message: "Couldn't send verification email. Please try again later.",
    })
  }

  // return happy response
  return redirectResponse(requestParams.url.origin, user.username)
}

const header = (
  <>
    <h1>Register</h1>
    <p>
      Creating an account on this site is free and easy. Simply fill in the form below and click ‘Register’. You will
      then be able to upload and share your Turtle programs with others, save your online system preferences, create and
      join programming courses, and access our free course materials.
    </p>
  </>
)

const main = (formData?: FormData, feedback?: FeedbackProps): JSX.Element => (
  <div className="form">
    {feedback ? <Feedback {...feedback} /> : null}
    <form method="post">
      <div className="columns">
        <div className="column">
          <FormInput
            id="username"
            label="Username (choose any)"
            type="text"
            required={true}
            value={formData?.get("username")}
          />
        </div>
        <div className="column">
          <FormInput id="email" label="Email Address" type="email" required={true} value={formData?.get("email")} />
        </div>
      </div>
      <div className="columns">
        <div className="column">
          <FormInput id="password1" label="Password" type="password" required={true} />
        </div>
        <div className="column">
          <FormInput id="password2" label="Repeat Password" type="password" required={true} />
        </div>
      </div>
      <div className="columns">
        <div className="column">
          <FormInput id="firstName" label="First Name" type="text" required={true} value={formData?.get("firstName")} />
        </div>
        <div className="column">
          <FormInput id="lastName" label="Last Name" type="text" required={true} value={formData?.get("lastName")} />
        </div>
      </div>
      <FormSelect id="accountType" label="Account Type" value="1" required={true}>
        <FormOption label="This account is for me, and I am at least 13 years old" value="1" selectedValue="1" />
        <FormOption
          label="This account is for a child under 13, and I am their legal guardian"
          value="2"
          selectedValue="1"
        />
      </FormSelect>
      <FormInput id="guardian" label="Full Name of Parent/Guardian" type="text" value={formData?.get("guardian")} />
      <div className="columns">
        <div className="column">
          <FormInput id="schoolName" label="School Name (optional)" type="text" value={formData?.get("schoolName")} />
        </div>
        <div className="column">
          <FormInput
            id="schoolPostcode"
            label="School Postcode (optional)"
            type="text"
            value={formData?.get("schoolPostcode")}
          />
        </div>
      </div>
      <div className="form-buttons">
        <button type="submit" className="green button">
          Register
        </button>
      </div>
    </form>
  </div>
)
