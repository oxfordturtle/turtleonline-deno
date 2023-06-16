import React from "react"
import type { RequestParams } from "../../types.ts"
import page from "../_layout/page.tsx"
import { htmlResponse } from "../../utils/response.ts"

export default (requestParams: RequestParams): Promise<Response> => htmlResponse(page(requestParams, header, main))

const header = <h1>Your Files</h1>

const main = <p>File management has not yet been implemented. Please check back here soon.</p>
