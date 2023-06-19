import { assert, assertEquals } from "testing";
import { readFile } from "./file.ts";

Deno.test({
  name: "imp: read file",
  fn: async () => {
    const nothing = await readFile("./path/to/nowhere");
    const screen = await readFile("./server/imp/file.test.ts");
    assertEquals(nothing, undefined);
    assert(screen instanceof Uint8Array);
  },
});
