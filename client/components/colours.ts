import colours, { type Colour } from "../constants/colours.ts";
import type { Language } from "../constants/languages.ts";
import systemState from "../state/systemState.ts";
import { create, setChildren } from "../elementary/index.ts";

const coloursTableBody = document.querySelector<HTMLElement>('[data-component="coloursTableBody"]');

if (coloursTableBody) {
  systemState.on("language", (language) => {
    setChildren(coloursTableBody, coloursTableRows(language));
  });
}

const coloursTableRows = (language: Language) =>
  Array.from({ length: 10 }, (_, i) =>
    create.tr(
      {},
      ...colours.slice(i * 5, i * 5 + 5).map((colour) => colourTableCells(language, colour))
    )
  );

const colourTableCells = (language: Language, colour: Colour) => [
  create.th({}, colour.index.toString()),
  create.td({ style: `background:#${colour.hex};color:${colour.dark ? "white" : "black"}` }, [
    colour.names[language],
    create.br(),
    hex(language, colour.hex),
  ]),
];

const hex = (language: Language, hex: string) =>
  language === "BASIC" ? `&${hex}` : language === "Pascal" ? `$${hex}` : `0x${hex}`;
