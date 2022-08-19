import { React } from "../../../deps.ts"
import type { RequestParams } from "../../types.ts"
import page from "../../layout/page.tsx"
import { htmlResponse } from "../../utils/response.ts"
import * as BASIC from "./help/BASIC.tsx"
import * as C from "./help/C.tsx"
import * as Java from "./help/Java.tsx"
import * as Pascal from "./help/Pascal.tsx"
import * as Python from "./help/Python.tsx"
import * as TypeScript from "./help/TypeScript.tsx"

export default (requestParams: RequestParams): Response => htmlResponse(page(requestParams, header(tab(requestParams)), main(tab(requestParams))))

const tab = (requestParams: RequestParams): string =>
  requestParams.url.searchParams.get("tab") ?? "basics"

const header = (tab: string): JSX.Element => <>
  <div className="title">
    <h1>Turtle Languages Help</h1>
    <select data-action="selectTab">
      <option value="basics" selected={tab === "basics"}>Programs &amp; Procedures</option>
      <option value="structures" selected={tab === "structures"}>Command Structures</option>
      <option value="operators" selected={tab === "operators"}>Operators</option>
      <option value="input" selected={tab === "input"}>User Input</option>
    </select>
    <select data-binding="language"></select>
  </div>
  <p>The <em>Turtle System</em> supports programming in several specially designed languages. These languages all mimic an existing language, but incorporate native Turtle Graphics support, and are pared down to facilitate teaching and learning in a simpler and less daunting environment (and to enable the compilers to produce much more precise and detailed error messages). The guides on this page, together with the <a href="/documentation/reference">Commands &amp; Constants Reference</a>, cover the essentials for programming in the <em>Turtle System</em>. For a more complete description of the languages, see the <a href="/documentation/languages">Turtle Language Specifications</a>.</p>
</>

const main = (tab: string): JSX.Element => <>
  <div className="tab-panes">
    <div className={`tab-pane${tab === "basics" ? " active" : ""}`} data-tab="basics">
      <div data-language="BASIC">${BASIC.basics}</div>
      <div data-language="C">${C.basics}</div>
      <div data-language="Java">${Java.basics}</div>
      <div data-language="Pascal">${Pascal.basics}</div>
      <div data-language="Python">${Python.basics}</div>
      <div data-language="TypeScript">${TypeScript.basics}</div>
    </div>
    <div className={`tab-pane${tab === "structures" ? " active" : ""}`} data-tab="structures">
      <div data-language="BASIC">${BASIC.structures}</div>
      <div data-language="C">${C.structures}</div>
      <div data-language="Java">${Java.structures}</div>
      <div data-language="Pascal">${Pascal.structures}</div>
      <div data-language="Python">${Python.structures}</div>
      <div data-language="TypeScript">${TypeScript.structures}</div>
    </div>
    <div className={`tab-pane${tab === "operators" ? " active" : ""}`} data-tab="operators">
      <div data-language="BASIC">${BASIC.operators}</div>
      <div data-language="C">${C.operators}</div>
      <div data-language="Java">${Java.operators}</div>
      <div data-language="Pascal">${Pascal.operators}</div>
      <div data-language="Python">${Python.operators}</div>
      <div data-language="TypeScript">${TypeScript.operators}</div>
    </div>
    <div className={`tab-pane${tab === "input" ? " active" : ""}`} data-tab="input">
      <div data-language="BASIC">${BASIC.input}</div>
      <div data-language="C">${C.input}</div>
      <div data-language="Java">${Java.input}</div>
      <div data-language="Pascal">${Pascal.input}</div>
      <div data-language="Python">${Python.input}</div>
      <div data-language="TypeScript">${TypeScript.input}</div>
    </div>
  </div>
</>
