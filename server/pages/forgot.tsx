import React from "react";
import { Status } from "http";
import type { Imp, RequestParams } from "../types.ts";
import page from "./_layout/page.tsx";
import { htmlResponse } from "../utils/response.ts";
import { getFormField } from "../utils/form.ts";
import error from "./error.tsx";
import Feedback, { FeedbackProps } from "./_layout/feedback.tsx";
import { FormInput } from "./_layout/form.tsx";

export default (requestParams: RequestParams, imp: Imp): Promise<Response> =>
  requestParams.method === "GET"
    ? forgotResponse(requestParams)
    : requestParams.method === "POST"
    ? handleForm(requestParams, imp)
    : error(requestParams, Status.MethodNotAllowed);

const forgotResponse = (
  requestParams: RequestParams,
  feedback?: FeedbackProps
): Promise<Response> =>
  htmlResponse(
    page(requestParams, header, main(requestParams.formData, feedback))
  );

const handleForm = async (
  requestParams: RequestParams,
  imp: Imp
): Promise<Response> => {
  // check for form data
  if (requestParams.formData === undefined) {
    return forgotResponse(requestParams, {
      ok: false,
      message: "You didn't submit any form data.",
    });
  }

  // get form fields
  const email = getFormField("email", requestParams.formData);

  // validate form data
  if (!email) {
    return forgotResponse(requestParams, {
      ok: false,
      message: "Email address is required.",
    });
  }

  // check for user with the given email address
  const user = await imp.readUser({ email });

  // return error message if email doesn't match
  if (!user) {
    return forgotResponse(requestParams, {
      ok: false,
      message: "Email address not found.",
    });
  }

  // (try to) set a new token
  user.token = crypto.randomUUID();
  const tokenExpires = new Date();
  tokenExpires.setHours(tokenExpires.getHours() + 24);
  user.tokenExpires = tokenExpires.toString();
  const result = await imp.updateUser(user.username, user);
  if (result[0] === "left") {
    console.log(result[1]);
    return forgotResponse(requestParams, {
      ok: false,
      message: "Couldn't send email. Please try again later.",
    });
  }

  // (try to) send the email
  const response = await imp.sendCredentialsEmail(user);
  if (!response.success) {
    return forgotResponse(requestParams, {
      ok: false,
      message: "Couldn't send email. Please try again later.",
    });
  }

  // return happy response
  return forgotResponse(requestParams, {
    ok: true,
    message: "An email has been sent to your address.",
  });
};

const header = <h1>Forgot Credentials</h1>;

const main = (formData?: FormData, feedback?: FeedbackProps): JSX.Element => (
  <>
    <p>
      If you have forgotten your login credentials, enter your email address
      into the form below and click ‘Send Credentials’. You will receive an
      email with your username, and a link to reset your password.
    </p>
    <div className="form">
      {feedback ? <Feedback {...feedback} /> : null}
      <form method="post">
        <FormInput
          id="email"
          label="Email Address"
          type="email"
          required={true}
          value={formData?.get("email")}
        />
        <div className="form-buttons">
          <button type="submit" className="green button">
            Send Credentials
          </button>
        </div>
      </form>
    </div>
  </>
);
