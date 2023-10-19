import React from "react";
import type { RequestParams } from "../../types.ts";
import page from "../_layout/page.tsx";
import { htmlResponse } from "../../utils/response.ts";
import BASICBasics from "./help/BASIC/basics.tsx";
import BASICStructures from "./help/BASIC/structures.tsx";
import BASICOperators from "./help/BASIC/operators.tsx";
import BASICInput from "./help/BASIC/input.tsx";
import CBasics from "./help/C/basics.tsx";
import CStructures from "./help/C/structures.tsx";
import COperators from "./help/C/operators.tsx";
import CInput from "./help/C/input.tsx";
import JavaBasics from "./help/Java/basics.tsx";
import JavaStructures from "./help/Java/structures.tsx";
import JavaOperators from "./help/Java/operators.tsx";
import JavaInput from "./help/Java/input.tsx";
import PascalBasics from "./help/Pascal/basics.tsx";
import PascalStructures from "./help/Pascal/structures.tsx";
import PascalOperators from "./help/Pascal/operators.tsx";
import PascalInput from "./help/Pascal/input.tsx";
import PythonBasics from "./help/Python/basics.tsx";
import PythonStructures from "./help/Python/structures.tsx";
import PythonOperators from "./help/Python/operators.tsx";
import PythonInput from "./help/Python/input.tsx";
import TypeScriptBasics from "./help/TypeScript/basics.tsx";
import TypeScriptStructures from "./help/TypeScript/structures.tsx";
import TypeScriptOperators from "./help/TypeScript/operators.tsx";
import TypeScriptInput from "./help/TypeScript/input.tsx";

export default (requestParams: RequestParams): Promise<Response> =>
  htmlResponse(page(requestParams, header(tab(requestParams)), main(tab(requestParams))));

const tab = (requestParams: RequestParams): string =>
  requestParams.url.searchParams.get("tab") ?? "basics";

const header = (tab: string): JSX.Element => (
  <>
    <div className="title">
      <h1>Turtle Languages Help</h1>
      <select data-action="selectTab">
        <option value="basics" selected={tab === "basics"}>
          Programs &amp; Procedures
        </option>
        <option value="structures" selected={tab === "structures"}>
          Command Structures
        </option>
        <option value="operators" selected={tab === "operators"}>
          Operators
        </option>
        <option value="input" selected={tab === "input"}>
          User Input
        </option>
      </select>
      <select data-binding="language"></select>
    </div>
    <p>
      The <em>Turtle System</em> supports programming in several specially designed languages. These
      languages all mimic an existing language, but incorporate native Turtle Graphics support, and
      are pared down to facilitate teaching and learning in a simpler and less daunting environment
      (and to enable the compilers to produce much more precise and detailed error messages). The
      guides on this page, together with the{" "}
      <a href="/documentation/reference">Commands &amp; Constants Reference</a>, cover the
      essentials for programming in the <em>Turtle System</em>. For a more complete description of
      the languages, see the <a href="/documentation/languages">Turtle Language Specifications</a>.
    </p>
  </>
);

const main = (tab: string): JSX.Element => (
  <>
    <div className="tab-panes">
      <div className={`tab-pane${tab === "basics" ? " active" : ""}`} data-tab="basics">
        <div data-language="BASIC">
          <BASICBasics />
        </div>
        <div data-language="C">
          <CBasics />
        </div>
        <div data-language="Java">
          <JavaBasics />
        </div>
        <div data-language="Pascal">
          <PascalBasics />
        </div>
        <div data-language="Python">
          <PythonBasics />
        </div>
        <div data-language="TypeScript">
          <TypeScriptBasics />
        </div>
      </div>
      <div className={`tab-pane${tab === "structures" ? " active" : ""}`} data-tab="structures">
        <div data-language="BASIC">
          <BASICStructures />
        </div>
        <div data-language="C">
          <CStructures />
        </div>
        <div data-language="Java">
          <JavaStructures />
        </div>
        <div data-language="Pascal">
          <PascalStructures />
        </div>
        <div data-language="Python">
          <PythonStructures />
        </div>
        <div data-language="TypeScript">
          <TypeScriptStructures />
        </div>
      </div>
      <div className={`tab-pane${tab === "operators" ? " active" : ""}`} data-tab="operators">
        <div data-language="BASIC">
          <BASICOperators />
        </div>
        <div data-language="C">
          <COperators />
        </div>
        <div data-language="Java">
          <JavaOperators />
        </div>
        <div data-language="Pascal">
          <PascalOperators />
        </div>
        <div data-language="Python">
          <PythonOperators />
        </div>
        <div data-language="TypeScript">
          <TypeScriptOperators />
        </div>
      </div>
      <div className={`tab-pane${tab === "input" ? " active" : ""}`} data-tab="input">
        <div data-language="BASIC">
          <BASICInput />
        </div>
        <div data-language="C">
          <CInput />
        </div>
        <div data-language="Java">
          <JavaInput />
        </div>
        <div data-language="Pascal">
          <PascalInput />
        </div>
        <div data-language="Python">
          <PythonInput />
        </div>
        <div data-language="TypeScript">
          <TypeScriptInput />
        </div>
      </div>
    </div>
  </>
);
