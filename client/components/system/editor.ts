// module imports
import highlight from "../../lexer/highlight.ts"
import { state } from "../../state/index.ts"
import { fill, li } from "../../tools/elements.ts"
import { on } from "../../tools/hub.ts"

// get the editor element
const editor = document.querySelector('[data-component="editor"]') as HTMLElement

// define the update code display function
function updateCodeDisplay(lineNumbers: HTMLOListElement, code: HTMLElement, textarea: HTMLTextAreaElement, pre: HTMLPreElement): void {
  const lines = state.code.split("\n")
  fill(
    lineNumbers,
    lines.map((_x, y) => li({ content: (y + 1).toString(10) }))
  )
  fill(code, highlight(state.tokens, state.language))
  requestAnimationFrame(function (): void {
    textarea.value = state.code
    textarea.style.height = `${lines.length * 1.5}em`
    textarea.style.width = `${pre.scrollWidth.toString(10)}px`
    pre.style.height = `${lines.length * 1.5}em`
    lineNumbers.style.height = `${lines.length * 1.5}em`
  })
}

if (editor) {
  // get relevant sub elements
  const lineNumbers = editor.querySelector(".line-numbers") as HTMLOListElement
  const codeWrapper = editor.querySelector(".code-wrapper") as HTMLDivElement
  const textarea = editor.querySelector("textarea") as HTMLTextAreaElement
  const pre = editor.querySelector("pre") as HTMLPreElement
  const code = editor.querySelector("code") as HTMLElement

  // add event listeners to interactive elements
  textarea.addEventListener("keydown", function (event: KeyboardEvent): void {
    // catch tab press and insert two spaces at the cursor
    if (event.keyCode === 9) {
      const pos = textarea.selectionStart
      const left = textarea.value.slice(0, pos)
      const right = textarea.value.slice(pos)
      event.preventDefault()
      textarea.value = [left, right].join("  ")
      state.code = textarea.value
      textarea.selectionStart = pos + 2
      textarea.selectionEnd = pos + 2
    }

    // if return was pressed, scroll the code wrapper all the way to the left
    if (event.keyCode === 13) {
      codeWrapper.scrollLeft = 0
    }
  })

  textarea.addEventListener("input", () => {
    state.code = textarea.value
  })

  // register to keep in sync with the application state
  on("codeChanged", () => updateCodeDisplay(lineNumbers, code, textarea, pre))

  on("editorFontFamilyChanged", () => {
    editor.style.fontFamily = state.editorFontFamily
    updateCodeDisplay(lineNumbers, code, textarea, pre)
  })

  on("editorFontSizeChanged", () => {
    editor.style.fontSize = `${state.editorFontSize.toString(10)}px`
    updateCodeDisplay(lineNumbers, code, textarea, pre)
  })

  on("selectAll", () => {
    textarea.select()
  })

  // keep line numbers scrolling in sync with the code
  codeWrapper.addEventListener("scroll", () => {
    lineNumbers.scrollTop = codeWrapper.scrollTop
    if (codeWrapper.scrollLeft <= 8) {
      codeWrapper.scrollLeft = 0
    }
  })
}
