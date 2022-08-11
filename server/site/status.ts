import { type ParsedRequest } from "../request.ts"
import { jsonResponse } from "../utils/response.ts"

export default (_request: ParsedRequest): Response => jsonResponse({ username: null })
