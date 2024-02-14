import { STATUS_CODE } from "http";
import { Imp, RequestParams } from "../types.ts";
import { fileResponse } from "../utils/response.ts";
import error from "./error.tsx";

export default (requestParams: RequestParams, imp: Imp): Promise<Response> =>
  ["14", "15"].includes(requestParams.sections[1])
    ? downloadResponse(requestParams, requestParams.sections[1], imp)
    : error(requestParams, STATUS_CODE.NotFound);

const downloadResponse = async (
  requestParams: RequestParams,
  version: string,
  imp: Imp
): Promise<Response> => {
  const path = `./public/turtle/TurtleSystem_${version}.exe`;
  const fileInfo = await imp.readFile(path);
  return fileInfo === undefined
    ? error(requestParams, STATUS_CODE.NotFound)
    : fileResponse(fileInfo, path);
};
