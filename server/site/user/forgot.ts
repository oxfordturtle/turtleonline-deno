import { type ParsedRequest } from "../../request.ts"
import page from "../../layout/page.ts"
import { htmlResponse } from "../../utils/response.ts"

export default (request: ParsedRequest): Response => htmlResponse(page(request, header, main))

const header = `
  <h1>Forgot Credentials</h1>
`

const main = `
  <p>If you have forgotten your login credentials, enter your email address into the form below and click ‘Send Credentials’. You will receive an email with your username, and a link to reset your password.</p>
  <div class="form">
    <form name="email_credentials" method="post">
      <div class="form-group">
        <label for="email_credentials_email" class="required">Email Address</label>
        <input type="email" id="email_credentials_email" name="email_credentials[email]" required="required">
      </div>
      <div class="form-buttons">
        <button type="submit" class="green button">Send Credentials</button>
      </div>
    </form>
  </div>
`
