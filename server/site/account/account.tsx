import { React } from "../../../deps.ts"
import type { RequestParams, User } from "../../types.ts"
import page from "../../layout/page.tsx"
import { htmlResponse } from "../../utils/response.ts"

export default (requestParams: RequestParams, user: User): Promise<Response> =>
  htmlResponse(page(requestParams, header(user), main))

const header = (user: User): JSX.Element => (
  <h1>
    {user.firstName} {user.lastName}: Welcome!
  </h1>
)

const main = (
  <>
    <p>Welcome to your account area on our site. Click on the buttons below to manage your account.</p>
    <ul className="dashboard-buttons">
      <a href="/account/details" className="green button">
        <span className="icon">
          <i className="fa fa-user"></i>
        </span>
        <span className="text">Edit your personal details</span>
      </a>
      <a href="/account/email" className="green button">
        <span className="icon">
          <i className="fa fa-envelope"></i>
        </span>
        <span className="text">Change your email settings</span>
      </a>
      <a href="/account/password" className="green button">
        <span className="icon">
          <i className="fa fa-lock"></i>
        </span>
        <span className="text">Change your password</span>
      </a>
      <a href="/account/delete" className="red button">
        <span className="icon">
          <i className="fa fa-exclamation-triangle"></i>
        </span>
        <span className="text">Delete your account</span>
      </a>
    </ul>
  </>
)
