import { React } from "../../../deps.ts"
import type { RequestParams } from "../../types.ts"
import page from "../../layout/page.tsx"
import { htmlResponse } from "../../utils/response.ts"

export default (requestParams: RequestParams): Response => htmlResponse(page(requestParams, header, main))

const header = <h1>Turtle Language Specifications</h1>

const main = <p>Updated specifications for the Turtle languages are currently being prepared. Please check back here soon.</p>
