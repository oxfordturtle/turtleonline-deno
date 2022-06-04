import file from "./menu/file.ts"
import edit from "./menu/edit.ts"
import view from "./menu/view.ts"
import compile from "./menu/compile.ts"
import run from "./menu/run.ts"
import options from "./menu/options.ts"
import examples from "./menu/examples.ts"

export default `
<nav class="system-menu" data-menu="system">
  ${file}
  ${edit}
  ${view}
  ${compile}
  ${run}
  ${options}
  ${examples}
</nav>
`
