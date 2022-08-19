import type { RequestParams } from "../types.ts"
import { jsonResponse } from "../utils/response.ts"

export default (_requestParams: RequestParams): Response => jsonResponse({ username: null })
