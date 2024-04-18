import React from "react";
import type { RequestParams } from "../../types.ts";
import page from "../_layout/page.tsx";
import { htmlResponse } from "../../utils/response.ts";
import ColoursNotes from "./reference/notes/colours.tsx";
import CommandsNotes from "./reference/notes/commands.tsx";
import CursorsNotes from "./reference/notes/cursors.tsx";
import FontsNotes from "./reference/notes/fonts.tsx";
import KeycodesNotes from "./reference/notes/keycodes.tsx";
import ColoursTable from "./reference/tables/colours.tsx";
import CommandsTable from "./reference/tables/commands.tsx";
import CursorsTable from "./reference/tables/cursors.tsx";
import FontsTable from "./reference/tables/fonts.tsx";
import KeycodesTable from "./reference/tables/keycodes.tsx";
import languages from "../../../client/constants/languages.ts";

export default (requestParams: RequestParams): Promise<Response> =>
  htmlResponse(page(requestParams, header(tab(requestParams)), main(tab(requestParams))));

const tab = (requestParams: RequestParams): string =>
  requestParams.url.searchParams.get("tab") ?? "commands";

const header = (tab: string): JSX.Element => (
  <>
    <div className="title">
      <h1>Commands &amp; Constants Reference</h1>
      <select data-send="selectTab">
        <option value="commands" selected={tab === "commands"}>
          Native Commands
        </option>
        <option value="colours" selected={tab === "colours"}>
          Colour Constants
        </option>
        <option value="fonts" selected={tab === "fonts"}>
          Fonts
        </option>
        <option value="cursors" selected={tab === "cursors"}>
          Cursors
        </option>
        <option value="keycodes" selected={tab === "keycodes"}>
          Input Keycodes
        </option>
      </select>
      <select data-bind="language">
        {languages.map((language) => <option value={language}>{language}</option>)}
      </select>
    </div>
    <div className="tab-panes">
      <div className={`tab-pane${tab === "commands" ? " active" : ""}`} data-tab="commands">
        <CommandsNotes />
      </div>
      <div className={`tab-pane${tab === "colours" ? " active" : ""}`} data-tab="colours">
        <ColoursNotes />
      </div>
      <div className={`tab-pane${tab === "fonts" ? " active" : ""}`} data-tab="fonts">
        <FontsNotes />
      </div>
      <div className={`tab-pane${tab === "cursors" ? " active" : ""}`} data-tab="cursors">
        <CursorsNotes />
      </div>
      <div className={`tab-pane${tab === "keycodes" ? " active" : ""}`} data-tab="keycodes">
        <KeycodesNotes />
      </div>
    </div>
  </>
);

const main = (tab: string): JSX.Element => (
  <>
    <div className="tab-panes">
      <div className={`tab-pane${tab === "commands" ? " active" : ""}`} data-tab="commands">
        <CommandsTable />
      </div>
      <div className={`tab-pane${tab === "colours" ? " active" : ""}`} data-tab="colours">
        <ColoursTable />
      </div>
      <div className={`tab-pane${tab === "fonts" ? " active" : ""}`} data-tab="fonts">
        <FontsTable />
      </div>
      <div className={`tab-pane${tab === "cursors" ? " active" : ""}`} data-tab="cursors">
        <CursorsTable />
      </div>
      <div className={`tab-pane${tab === "keycodes" ? " active" : ""}`} data-tab="keycodes">
        <KeycodesTable />
      </div>
    </div>
  </>
);
