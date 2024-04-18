/*
 * The program lexemes component.
 */
import highlight from "../../tokenizer/highlight.ts";
import { type Lexeme } from "../../lexer/lexeme.ts";
import { state } from "../../state/index.ts";
import { fill, tr, td, code } from "../../tools/elements.ts";
import { on } from "../../tools/hub.ts";

// the lexemes table body
const syntaxTableBody = document.querySelector('[data-component="syntaxTableBody"]') as HTMLElement;

if (syntaxTableBody) {
  // register to keep in sync with the application state
  on("lexemesChanged", function () {
    fill(syntaxTableBody, state.lexemes.map(tableBodyRow));
  });
}

// function to create a table body row from a lexeme
function tableBodyRow(lexeme: Lexeme, index: number): HTMLTableRowElement {
  return tr({
    content: [
      td({ content: `${index + 1}` }),
      td({ content: lexeme.line.toString(10) }),
      td({
        className: "wide",
        content: [
          code({
            content: lexeme.content ? highlight(lexeme.content, state.language) : "",
          }),
        ],
      }),
      td({
        className: "wide",
        content: `${lexeme.type}${"subtype" in lexeme ? ` (${lexeme.subtype})` : ""}`,
      }),
    ],
  });
}
