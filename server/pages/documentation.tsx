import { STATUS_CODE } from "http";
import type { Imp, RequestParams } from "../types.ts";
import { redirectResponse } from "../utils/response.ts";
import error from "./error.tsx";
import csac from "./documentation/csac.tsx";
import exercises from "./documentation/exercises.tsx";
import help from "./documentation/help.tsx";
import languages from "./documentation/languages.tsx";
import machine from "./documentation/machine.tsx";
import programming from "./documentation/programming.tsx";
import reading from "./documentation/reading.tsx";
import reference from "./documentation/reference.tsx";
import system from "./documentation/system.tsx";

export default (requestParams: RequestParams, imp: Imp): Promise<Response> => {
  return requestParams.sections[1] === undefined
    ? redirectResponse(`${requestParams.url.origin}/documentation/programming`)
    : handler[requestParams.sections[1]]
    ? handler[requestParams.sections[1]](requestParams, imp)
    : error(requestParams, STATUS_CODE.NotFound);
};

const handler: Record<
  string,
  (requestParams: RequestParams, imp: Imp) => Promise<Response>
> = {
  csac,
  exercises,
  help,
  languages,
  machine,
  programming,
  reading,
  reference,
  system,
};
