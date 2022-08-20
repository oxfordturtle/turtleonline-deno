import React from "react"
import type { RequestParams } from "../types.ts"
import page from "./_layout/page.tsx"
import { htmlResponse } from "../utils/response.ts"
import Canvas from "./system/canvas.tsx"
import Comments from "./system/comments.tsx"
import Controls from "./system/controls.tsx"
import Editor from "./system/editor.tsx"
import Filename from "./system/filename.tsx"
import Memory from "./system/memory.tsx"
import Menu from "./system/menu.tsx"
import Options from "./system/options.tsx"
import Output from "./system/output.tsx"
import PCode from "./system/pcode.tsx"
import Properties from "./system/properties.tsx"
import Syntax from "./system/syntax.tsx"
import Usage from "./system/usage.tsx"
import Variables from "./system/variables.tsx"

export default (requestParams: RequestParams): Promise<Response> =>
  htmlResponse(page(requestParams, <></>, main(requestParams.url.searchParams)))

const main = (searchParams: URLSearchParams): JSX.Element => (
  <div
    id="turtle"
    className="system"
    data-language={searchParams.get("l")}
    data-example={searchParams.get("x")}
    data-file={searchParams.get("f")}
    data-fullscreen={searchParams.get("f")}
  >
    <header className="system-header">
      <button aria-label="system menu" data-action="toggleMenu" data-arg="system">
        <i className="fa fa-bars" aria-hidden="true"></i>
      </button>
      <Controls />
    </header>
    <div className="system-body">
      <Menu />
      <main className="system-main" data-action="closeMenu" data-arg="system">
        <section className="system-section left">
          <Filename />
          <Editor />
        </section>
        <section className="system-section right">
          <Properties />
          <div className="system-tabs">
            <Canvas />
            <Output />
            <Usage />
            <Comments />
            <Syntax />
            <Variables />
            <PCode />
            <Memory />
            <Options />
          </div>
        </section>
      </main>
    </div>
  </div>
)
