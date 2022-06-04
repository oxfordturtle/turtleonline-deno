import { type ParsedRequest } from "../../request.ts"
import page from "../../layout/page.ts"
import { htmlResponse } from "../../utils/response.ts"

export default (request: ParsedRequest): Response => htmlResponse(page(request, header, main))

const header = `
  <h1>Sign In</h1>
`

const main = `
  <form action="/login" method="post">
    <div class="form-group">
      <label for="username">Username</label>
      <input type="text" class="form-control" id="username" name="_username" required="required" autofocus="">
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input type="password" class="form-control" id="password" name="_password" required="required">
    </div>
    <div class="form-buttons">
      <a href="/forgot">Forgot Credentials?</a>
      <button type="submit" class="green button">Login</button>
    </div>
  </form>
`
