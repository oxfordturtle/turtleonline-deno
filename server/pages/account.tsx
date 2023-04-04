import { Status } from "../../deps.ts"
import type { Imp, RequestParams, User } from "../types.ts"
import error from "./error.tsx"
import account from "./account/account.tsx"
import delete_ from "./account/delete.tsx"
import details from "./account/details.tsx"
import email from "./account/email.tsx"
import files from "./account/files.tsx"
import password from "./account/password.tsx"

export default (requestParams: RequestParams, imp: Imp): Promise<Response> =>
  requestParams.user
    ? requestParams.sections[1] === undefined
      ? account(requestParams, requestParams.user)
      : handler[requestParams.sections[1]]
      ? handler[requestParams.sections[1]](requestParams, requestParams.user, imp)
      : error(requestParams, Status.NotFound)
    : error(requestParams, Status.Forbidden)

const handler: Record<string, (requestParams: RequestParams, user: User, imp: Imp) => Promise<Response>> = {
  delete: delete_,
  details,
  email,
  files,
  password,
}
