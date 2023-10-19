import React from "react";
import type { RequestParams } from "../../types.ts";
import page from "../_layout/page.tsx";
import { htmlResponse } from "../../utils/response.ts";

export default (requestParams: RequestParams): Promise<Response> =>
  htmlResponse(page(requestParams, header, main));

const header = (
  <>
    <h1>Turtle System User Guides</h1>
    <p>
      The <i>Turtle System</i> is designed to be as easy to use and
      self-explanatory as possible, and consequently you should have little
      difficulty at least in getting started. However, there are several
      features&mdash;particularly those designed to help teachers&mdash;that
      will not be obvious unless you know to look for them. The following guides
      point these out to you, while going systematically through the various
      menus.
    </p>
  </>
);

const main = (
  <>
    <h2>Python Guides</h2>
    <ul>
      <li>
        <a href="/downloads/docs/Turtle_Python_1_Getting_Started.pdf">
          Turtle Python 1 - Getting Started
        </a>
      </li>
      <li>
        <a href="/downloads/docs/Turtle_Python_2_Spirals_and_Shapes.pdf">
          Turtle Python 2 - Spirals and Shapes
        </a>
      </li>
      <li>
        <a href="/downloads/docs/Turtle_Python_3_Introducing_Recursion.pdf">
          Turtle Python 3 - Introducing Recursion
        </a>
      </li>
      <li>
        <a href="/downloads/docs/Turtle_Python_4_Animation_and_Input.pdf">
          Turtle Python 4 - Animation and Input
        </a>
      </li>
      <li>
        <a href="/downloads/docs/Turtle_Python_5_Cellular_Models.pdf">
          Turtle Python 5 - Cellular Models
        </a>
      </li>
    </ul>
    <h2>General Guides</h2>
    <ul>
      <li>
        <a href="/downloads/docs/Guide_for_Normal_Users.pdf">
          The Turtle System - Guide for Normal Users
        </a>
      </li>
      <li>
        <a href="/downloads/docs/Guide_for_Online_Users.pdf">
          The Turtle System - Guide for Online Users
        </a>
      </li>
      <li>
        <a href="/downloads/docs/Guide_for_Power_Users.pdf">
          The Turtle System - Guide for Power Users
        </a>
      </li>
      <li>
        <a href="/downloads/docs/Guide_for_Teachers.pdf">
          The Turtle System - Guide for Teachers
        </a>
      </li>
    </ul>
  </>
);
