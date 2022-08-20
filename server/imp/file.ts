import { type Maybe, asafelyOptional } from "../utils/tools.ts"

export const readFile = async (path: string): Promise<Maybe<Uint8Array>> =>
  await asafelyOptional(async () => await Deno.readFile(path))
