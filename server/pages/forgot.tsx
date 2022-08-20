import React from "react"
import type { RequestParams } from "../types.ts"
import page from "./_layout/page.tsx"
import { htmlResponse } from "../utils/response.ts"

export default (requestParams: RequestParams): Promise<Response> => htmlResponse(page(requestParams, header, main))

const header = <h1>Forgot Credentials</h1>

const main = (
  <>
    <p>
      If you have forgotten your login credentials, enter your email address into the form below and click ‘Send
      Credentials’. You will receive an email with your username, and a link to reset your password.
    </p>
    <div className="form">
      <form name="email_credentials" method="post">
        <div className="form-group">
          <label htmlFor="email_credentials_email" className="required">
            Email Address
          </label>
          <input type="email" id="email_credentials_email" name="email_credentials[email]" required={true} />
        </div>
        <div className="form-buttons">
          <button type="submit" className="green button">
            Send Credentials
          </button>
        </div>
      </form>
    </div>
  </>
)
