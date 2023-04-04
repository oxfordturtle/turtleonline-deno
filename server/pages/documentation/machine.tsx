import { React } from "../../../deps.ts"
import type { RequestParams } from "../../types.ts"
import page from "../_layout/page.tsx"
import { htmlResponse } from "../../utils/response.ts"

export default (requestParams: RequestParams): Promise<Response> => htmlResponse(page(requestParams, header, main))

const header = <h1>Turtle Machine Specification</h1>

const main = (
  <p>Updated documentation for the virtual Turtle Machine is currently being prepared. Please check back here soon.</p>
)
