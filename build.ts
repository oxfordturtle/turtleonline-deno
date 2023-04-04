import { build, sass } from "./deps.ts"

// build javascript
console.log("Building client/index.ts...")
await build({
  entryPoints: ["./client/index.ts"],
  outfile: "./public/js/index.js",
  bundle: true,
  minify: false,
})
console.log("done!")

// build screen.css
console.log("Building style/screen.scss...")
const compiler1 = sass("./style/screen.scss", { style: "compressed" })
const css1 = compiler1.to_string()
if (typeof css1 === "string") {
  await Deno.writeTextFile("./public/css/screen.css", css1)
  console.log("done!")
} else {
  console.log("failed :(")
}

// build email.css
console.log("Building style/email.scss...")
const compiler2 = sass("./style/email.scss", { style: "compressed" })
const css2 = compiler2.to_string()
if (typeof css2 === "string") {
  await Deno.writeTextFile("./public/css/email.css", css2)
  console.log("done!")
} else {
  console.log("failed :(")
}

Deno.exit()
