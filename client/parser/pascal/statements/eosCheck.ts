import { CompilerError } from "../../../tools/error.ts";
import type { Lexemes } from "../../definitions/lexemes.ts";

const eosCheck = (lexemes: Lexemes): void => {
  const noSemiAfter = ["begin", "do", ".", "repeat", ";", "then"];
  const noSemiBefore = ["else", "end", ";", "until"];
  if (lexemes.get()) {
    if (lexemes.get()?.content !== ";") {
      if (noSemiAfter.indexOf(lexemes.get(-1)?.content?.toLowerCase() as string) === -1) {
        if (noSemiBefore.indexOf(lexemes.get()?.content?.toLowerCase() as string) === -1) {
          throw new CompilerError("Semicolon needed after command.", lexemes.get());
        }
      }
    } else {
      while (lexemes.get() && lexemes.get()?.content === ";") {
        lexemes.next();
      }
    }
  }
};

export default eosCheck;
