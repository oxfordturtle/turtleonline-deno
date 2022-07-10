import { build } from "./deps.ts"

await build({
  entryPoints: ['./client/index.ts'],
  outfile: './public/js/index.js',
  bundle: true,
  minify: false,
})
