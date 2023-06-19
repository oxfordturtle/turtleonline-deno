import React from "react";
import { Status } from "http";
import * as bcrypt from "bcrypt";
import type { Imp, RequestParams, User } from "../../types.ts";
import page from "../_layout/page.tsx";
import { FormInput } from "../_layout/form.tsx";
import Feedback, { FeedbackProps } from "../_layout/feedback.tsx";
import { htmlResponse } from "../../utils/response.ts";
import { getFormField } from "../../utils/form.ts";
import error from "../error.tsx";
import BackButton from "./backButton.tsx";

export default (
  requestParams: RequestParams,
  user: User,
  imp: Imp
): Promise<Response> =>
  requestParams.method === "GET"
    ? passwordResponse(requestParams, user)
    : requestParams.method === "POST"
    ? handleForm(requestParams, user, imp)
    : error(requestParams, Status.MethodNotAllowed);

const passwordResponse = (
  requestParams: RequestParams,
  user: User,
  feedback?: FeedbackProps
): Promise<Response> =>
  htmlResponse(page(requestParams, header(user), main(feedback)));

const handleForm = async (
  requestParams: RequestParams,
  user: User,
  imp: Imp
): Promise<Response> => {
  // check for form data
  if (requestParams.formData === undefined) {
    return passwordResponse(requestParams, user, {
      ok: false,
      message: "You didn't submit any form data.",
    });
  }

  // get form fields
  const currentPassword =
    getFormField("currentPassword", requestParams.formData) ?? "";
  const newPassword = getFormField("newPassword", requestParams.formData) ?? "";
  const repeatPassword =
    getFormField("repeatPassword", requestParams.formData) ?? "";

  // validate form fields
  if (newPassword !== repeatPassword) {
    return passwordResponse(requestParams, user, {
      ok: false,
      message: "New passwords don't match.",
    });
  }
  if (!(await bcrypt.compare(currentPassword, user.password))) {
    return passwordResponse(requestParams, user, {
      ok: false,
      message: "You entered the wrong value for your current password.",
    });
  }

  // create user details
  const userDetails: Partial<User> = {
    password: await bcrypt.hash(newPassword, await bcrypt.genSalt()),
  };

  // (try to) update password
  return (await imp.updateUser(user.username, userDetails))
    ? passwordResponse(
        requestParams,
        { ...user, ...userDetails },
        { ok: true, message: "Your password has been updated." }
      )
    : passwordResponse(requestParams, user, {
        ok: false,
        message: "Something went wrong saving your data. Please try again.",
      });
};

const header = (user: User): JSX.Element => (
  <h1>
    {user.firstName} {user.lastName}: Change Password
  </h1>
);

const main = (feedback?: FeedbackProps): JSX.Element => (
  <>
    <BackButton />
    {feedback ? <Feedback {...feedback} /> : null}
    <div className="form">
      <form method="post">
        <FormInput
          label="Current Password"
          id="currentPassword"
          type="password"
          required={true}
        />
        <div className="columns">
          <div className="column">
            <FormInput
              label="New Password"
              id="newPassword"
              type="password"
              required={true}
            />
          </div>
          <div className="column">
            <FormInput
              label="Repeat Password"
              id="repeatPassword"
              type="password"
              required={true}
            />
          </div>
        </div>
        <div className="form-buttons">
          <button type="submit" className="green button">
            Change Password
          </button>
        </div>
      </form>
    </div>
  </>
);
