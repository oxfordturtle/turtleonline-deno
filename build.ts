import { build } from "./deps.ts"

console.log("Building client/index.ts...")

await build({
  entryPoints: ["./client/index.ts"],
  outfile: "./public/js/index.js",
  bundle: true,
  minify: false,
})

console.log("done!")

Deno.exit()
