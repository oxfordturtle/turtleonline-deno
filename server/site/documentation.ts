import { Status } from "../../deps.ts"
import { type ParsedRequest } from "../request.ts"
import error from "./error.ts"
import csac from "./documentation/csac.ts"
import exercises from "./documentation/exercises.ts"
import help from "./documentation/help.ts"
import languages from "./documentation/languages.ts"
import machine from "./documentation/machine.ts"
import reading from "./documentation/reading.ts"
import reference from "./documentation/reference.ts"
import system from "./documentation/system.ts"

export default (request: ParsedRequest): Response =>
  handler[request.sections[1]] ? handler[request.sections[1]](request) : error(request, Status.NotFound)

const handler: Record<string, (request: ParsedRequest) => Response> = {
  csac,
  exercises,
  help,
  languages,
  machine,
  reading,
  reference,
  system,
}
