import { type ParsedRequest } from "../../request.ts"
import page from "../../layout/page.ts"
import { htmlResponse } from "../../utils/response.ts"

export default (request: ParsedRequest): Response => htmlResponse(page(request, header, main))

const header = `<h1>Turtle Language Specifications</h1>`

const main = `<p>Updated specifications for the Turtle languages are currently being prepared. Please check back here soon.</p>`
