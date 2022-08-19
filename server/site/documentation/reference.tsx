import { React } from "../../../deps.ts"
import type { RequestParams } from "../../types.ts"
import page from "../../layout/page.tsx"
import { htmlResponse } from "../../utils/response.ts"
import * as notes from "./reference/notes.tsx"
import * as tables from "./reference/tables.tsx"

export default (requestParams: RequestParams): Response => htmlResponse(page(requestParams, header(tab(requestParams)), main(tab(requestParams))))

const tab = (requestParams: RequestParams): string =>
  requestParams.url.searchParams.get("tab") ?? "commands"

const header = (tab: string): JSX.Element => <>
  <div className="title">
    <h1>Commands &amp; Constants Reference</h1>
    <select data-action="selectTab">
      <option value="commands" selected={tab === "commands"}>Native Commands</option>
      <option value="colours" selected={tab === "colours"}>Colour Constants</option>
      <option value="fonts" selected={tab === "fonts"}>Fonts</option>
      <option value="cursors" selected={tab === "cursors"}>Cursors</option>
      <option value="keycodes" selected={tab === "keycodes"}>Input Keycodes</option>
    </select>
    <select data-binding="language"></select>
  </div>
  <div className="tab-panes">
    <div className={`tab-pane${tab === "commands" ? " active" : ""}`} data-tab="commands">
      {notes.commands}
    </div>
    <div className={`tab-pane${tab === "colours" ? " active" : ""}`} data-tab="colours">
      {notes.colours}
    </div>
    <div className={`tab-pane${tab === "fonts" ? " active" : ""}`} data-tab="fonts">
      {notes.fonts}
    </div>
    <div className={`tab-pane${tab === "cursors" ? " active" : ""}`} data-tab="cursors">
      {notes.cursors}
    </div>
    <div className={`tab-pane${tab === "keycodes" ? " active" : ""}`} data-tab="keycodes">
      {notes.keycodes}
    </div>
  </div>
</>

const main = (tab: string): JSX.Element => <>
  <div className="tab-panes">
    <div className={`tab-pane${tab === "commands" ? " active" : ""}`} data-tab="commands">
      {tables.commands}
    </div>
    <div className={`tab-pane${tab === "colours" ? " active" : ""}`} data-tab="colours">
      {tables.colours}
    </div>
    <div className={`tab-pane${tab === "fonts" ? " active" : ""}`} data-tab="fonts">
      {tables.fonts}
    </div>
    <div className={`tab-pane${tab === "cursors" ? " active" : ""}`} data-tab="cursors">
      {tables.cursors}
    </div>
    <div className={`tab-pane${tab === "keycodes" ? " active" : ""}`} data-tab="keycodes">
      {tables.keycodes}
    </div>
  </div>
</>
