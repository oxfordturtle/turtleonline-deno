import React from "react";
import type { RequestParams } from "../types.ts";
import page from "./_layout/page.tsx";
import { htmlResponse } from "../utils/response.ts";

export default (requestParams: RequestParams): Promise<Response> =>
  htmlResponse(page(requestParams, header, main));

const header = (
  <>
    <h1>The Turtle System</h1>
    <p>
      The <i>Turtle System</i> is a free educational program developed at the University of Oxford,
      designed to support the new Computer Science component of the National Curriculum, and to
      bridge the &ldquo;Post-
      <i>Scratch</i> Gap&rdquo; between visual programming systems like <i>Scratch</i> and
      text-based programming. It supports several languages, all of which are compiled to portable
      code for a virtual <i>Turtle Machine</i>. The workings of the compilers and of the{" "}
      <i>Turtle Machine</i> are all open to inspection, providing many additional learning
      opportunities for advanced students.
    </p>
  </>
);

const main = (
  <>
    <div className="download">
      <h2>Download for Windows</h2>
      <select id="version-select">
        <option value="14">v14</option>
        <option value="15" selected>
          v15
        </option>
      </select>
      <a href="/download/15" className="button" id="download-link">
        <span className="icon">
          <i className="fa fa-download"></i>
        </span>
        <span className="text">The Turtle System</span>
      </a>
    </div>
    <p>
      The <i>Turtle System</i> is available as a traditional desktop app for Windows, downloadable
      from the button above. No installation is required; simply double-click the file to run it.
      The first time you run the program, Windows may warn you that it is of unknown origin, and
      therefore potentially unsafe. To run it, click ‘More Information’ and then ‘Run Anyway’.
    </p>
    <p>
      Version 15, which includes Turtle Python, is significantly more powerful than earlier
      versions, but currently (Autumn 2023) at a "beta" stage of development, and undergoing
      thorough testing. For this reason, version 14 (which includes Turtle BASIC and Turtle Pascal,
      but not Turtle Python) remains available.
    </p>
    <h2>Run Online and on other Platforms</h2>
    <p>
      The <i>Turtle System</i> is also available as a progressive web app, which can be run directly
      in your browser (click on <a href="/run">Run</a> in the main site menu), and installed for
      offline use (look for the ‘+’ icon in your address bar or the ‘Add to Home Screen’ prompt on
      your phone’s browser). This version currently supports more languages than the desktop
      application, but does not yet support file handling. When file handling is implemented, it
      will enable reading and writing files to your personal space on our server, which is created
      for you when you register for an account on this site.
    </p>
    <h2>Further Information</h2>
    <p>
      Please see the <a href="/documentation">Documentation</a> section for programming guides and
      information about how to use the <i>Turtle System</i>. For a discussion of the principles
      behind the System, see the <a href="/about">About</a> page, or Peter Millican’s articles in{" "}
      <a href="http://www.computingatschool.org.uk/">Computing at School</a>’s{" "}
      <a href="/documentation/reading">SwitchedOn</a> magazine.
    </p>
    <p>
      For any additional information, or to make suggestions for future developments, please{" "}
      <a href="/contact">contact us</a>.
    </p>
  </>
);
