import { Status } from "../../deps.ts"
import { type ParsedRequest } from "../request.ts"
import error from "./error.ts"
import { user } from "./data/user.ts"
import { session } from "./data/session.ts"

export default (request: ParsedRequest): Response =>
  handler[request.sections[1]] ? handler[request.sections[1]](request) : error(request, Status.NotFound)

const handler: Record<string, (request: ParsedRequest) => Response> = {
  user,
  session,
}
