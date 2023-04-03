import { assert, assertEquals } from "https://deno.land/std@0.161.0/testing/asserts.ts"
import { readFile } from "./file.ts"

Deno.test({
  name: "imp: read file",
  fn: async () => {
    const nothing = await readFile("./path/to/nowhere")
    const screen = await readFile("./server/imp/file.test.ts")
    assertEquals(nothing, undefined)
    assert(screen instanceof Uint8Array)
  }
})
