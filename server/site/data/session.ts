import { Status } from "../../../deps.ts"
import { ParsedRequest } from "../../request.ts"
import { jsonResponse } from "../../utils/response.ts"
import { safely, safelyOptional } from "../../utils/tools.ts"

export const session = (request: ParsedRequest): Response => jsonResponse({})
