import { build } from "esbuild"
import sass from "denosass"

console.log("Building client/index.ts...")

await build({
  entryPoints: ["./client/index.ts"],
  outfile: "./public/js/index.js",
  bundle: true,
  minify: false,
})

console.log("done!")

console.log("Building style/screen.scss...")

const compiler = sass("./style/screen.scss", { style: "compressed" })
const css = compiler.to_string()
if (typeof css === "string") {
  await Deno.writeTextFile("./public/css/screen.css", css)
  console.log("done!")
} else {
  console.log("failed :(")
}

Deno.exit()
