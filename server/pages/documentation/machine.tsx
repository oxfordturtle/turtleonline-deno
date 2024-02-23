import React from "react";
import type { RequestParams } from "../../types.ts";
import page from "../_layout/page.tsx";
import { htmlResponse } from "../../utils/response.ts";

export default (requestParams: RequestParams): Promise<Response> =>
  htmlResponse(page(requestParams, header, main));

const header = <h1>Turtle Machine Guides</h1>;

const main = (
  <ul>
    <li>
      <a href="/downloads/docs/Turtle_Machine_1_Pcode_and_Stack.pdf">
        Turtle Machine 1 - PCode and Stack
      </a>
    </li>
    <li>
      <a href="/downloads/docs/Turtle_Machine_2_Looping_Structures.pdf">
        Turtle Machine 2 - Looping Structures
      </a>
    </li>
    <li>
      <a href="/downloads/docs/Turtle_Machine_3_Subroutines_and_Recursion.pdf">
        Turtle Machine 3 - Subroutines and Recursion
      </a>
    </li>
  </ul>
);
