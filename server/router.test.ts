import { Status } from "https://deno.land/std@0.161.0/http/mod.ts"
import { assertEquals } from "https://deno.land/std@0.161.0/testing/asserts.ts"
import { testImpSucceed } from "./imp.ts"
import router from "./router.ts"

Deno.test({
  name: "smoke test all pages",
  fn: async () => {
    const pages = [
      "",
      "run",
      "documentation/system",
      "documentation/help",
      "documentation/reference",
      "documentation/exercises",
      "documentation/machine",
      "documentation/languages",
      "documentation/csac",
      "documentation/reading",
      "about",
      "contact",
      "register",
      "login",
    ]
    for (const page of pages) {
      const request = new Request(`http://localhost/${page}`)
      const response = await router(request, testImpSucceed)
      assertEquals(response.status, Status.OK)
    }
    const request = new Request("http://localhost/documentation")
    const response = await router(request, testImpSucceed)
    assertEquals(response.status, Status.Found)
  }
})
