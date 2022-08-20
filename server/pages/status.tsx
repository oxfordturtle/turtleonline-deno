import type { RequestParams } from "../types.ts"
import { jsonResponse } from "../utils/response.ts"

export default (_requestParams: RequestParams): Promise<Response> => jsonResponse({ username: null })
