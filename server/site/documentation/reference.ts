import { type ParsedRequest } from "../../request.ts"
import page from "../../layout/page.ts"
import { htmlResponse } from "../../utils/response.ts"
import * as notes from "./reference/notes.ts"
import * as tables from "./reference/tables.ts"

export default (request: ParsedRequest): Response => htmlResponse(page(request, header(tab(request)), main(tab(request))))

const tab = (request: ParsedRequest) => request.searchParams.get("tab") ?? "commands"

const header = (tab: string) => `
  <div class="title">
    <h1>Commands &amp; Constants Reference</h1>
    <select data-action="selectTab">
      <option value="commands"${tab === "commands" ? " selected" : ""}>Native Commands</option>
      <option value="colours"${tab === "colours" ? " selected" : ""}>Colour Constants</option>
      <option value="fonts"${tab === "fonts" ? " selected" : ""}>Fonts</option>
      <option value="cursors"${tab === "cursors" ? " selected" : ""}>Cursors</option>
      <option value="keycodes"${tab === "keycodes" ? " selected" : ""}>Input Keycodes</option>
    </select>
    <select data-binding="language"></select>
  </div>
  <div class="tab-panes">
    <div class="tab-pane${tab === "commands" ? " active" : ""}" data-tab="commands">
      ${notes.commands}
    </div>
    <div class="tab-pane${tab === "colours" ? " active" : ""}" data-tab="colours">
      ${notes.colours}
    </div>
    <div class="tab-pane${tab === "fonts" ? " active" : ""}" data-tab="fonts">
      ${notes.fonts}
    </div>
    <div class="tab-pane${tab === "cursors" ? " active" : ""}" data-tab="cursors">
      ${notes.cursors}
    </div>
    <div class="tab-pane${tab === "keycodes" ? " active" : ""}" data-tab="keycodes">
      ${notes.keycodes}
    </div>
  </div>
`

const main = (tab: string) => `
  <div class="tab-panes">
    <div class="tab-pane${tab === "commands" ? " active" : ""}" data-tab="commands">
      ${tables.commands}
    </div>
    <div class="tab-pane${tab === "colours" ? " active" : ""}" data-tab="colours">
      ${tables.colours}
    </div>
    <div class="tab-pane${tab === "fonts" ? " active" : ""}" data-tab="fonts">
      ${tables.fonts}
    </div>
    <div class="tab-pane${tab === "cursors" ? " active" : ""}" data-tab="cursors">
      ${tables.cursors}
    </div>
    <div class="tab-pane${tab === "keycodes" ? " active" : ""}" data-tab="keycodes">
      ${tables.keycodes}
    </div>
  </div>
`
