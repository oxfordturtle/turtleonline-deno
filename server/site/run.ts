import { type ParsedRequest } from "../request.ts"
import page from "../layout/page.ts"
import { htmlResponse } from "../utils/response.ts"
import canvas from "./system/canvas.ts"
import comments from "./system/comments.ts"
import controls from "./system/controls.ts"
import editor from "./system/editor.ts"
import filename from "./system/filename.ts"
import memory from "./system/memory.ts"
import menu from "./system/menu.ts"
import options from "./system/options.ts"
import output from "./system/output.ts"
import pcode from "./system/pcode.ts"
import properties from "./system/properties.ts"
import syntax from "./system/syntax.ts"
import usage from "./system/usage.ts"
import variables from "./system/variables.ts"

export default (request: ParsedRequest): Response => htmlResponse(page(request, "", main(request.searchParams)))

const main = (searchParams: URLSearchParams) => `<div id="turtle" class="system"${
  searchParams.get("l") ? `data-language="${searchParams.get("l")}"` : ""
}${searchParams.get("x") ? `data-example="${searchParams.get("x")}"` : ""}${
  searchParams.get("f") ? `data-file="${searchParams.get("f")}"` : ""
}${searchParams.get("fullscreen") ? `data-fullscreen="${searchParams.get("fullscreen")}"` : ""}>
  <header class="system-header">
    <button aria-label="system menu" data-action="toggleMenu" data-arg="system"><i class="fa fa-bars" aria-hidden="true"></i></button>
    ${controls}
  </header>
  <div class="system-body">
    ${menu}
    <main class="system-main" data-action="closeMenu" data-arg="system">
      <section class="system-section left">
        ${filename}
        ${editor}
      </section>
      <section class="system-section right">
        ${properties}
        <div class="system-tabs">
          ${canvas}
          ${output}
          ${usage}
          ${comments}
          ${syntax}
          ${variables}
          ${pcode}
          ${memory}
          ${options}
        </div>
      </section>
    </main>
  </div>
</div>`
