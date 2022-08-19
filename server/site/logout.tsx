import type { RequestParams } from "../types.ts"
import { redirectResponse } from "../utils/response.ts"

export default (requestParams: RequestParams): Response =>
  redirectResponse(requestParams.url.origin, null)
