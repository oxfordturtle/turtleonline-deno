import React from "react";
import type { RequestParams } from "../../types.ts";
import page from "../_layout/page.tsx";
import { htmlResponse } from "../../utils/response.ts";

export default (requestParams: RequestParams): Promise<Response> =>
  htmlResponse(page(requestParams, header, main));

const header = <h1>Turtle Language Specifications</h1>;

const main = (
  <p>
    Updated specifications for the Turtle languages are currently being
    prepared. Please check back here soon.
  </p>
);
