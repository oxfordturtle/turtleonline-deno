import { CompilerError } from "../../tools/error.ts";
import type { Lexemes } from "../definitions/lexemes.ts";
import type { Routine } from "../definitions/routine.ts";
import identifier from "./identifier.ts";

type Context = "global" | "nonlocal";

const identifiers = (lexemes: Lexemes, routine: Routine, context: Context): string[] => {
  const names: string[] = [];

  // expecting identifier
  const name = identifier(lexemes, routine, false);
  names.push(name);

  // expecting semicolon or new line, or a comma
  if (lexemes.get()?.content === ",") {
    lexemes.next();
    // push more identifiers recursively
    names.push(...identifiers(lexemes, routine, context));
  } else if (lexemes.get()?.type === "identifier") {
    throw new CompilerError(
      `Comma missing between ${context} variable declarations.`,
      lexemes.get(-1)
    );
  }

  return names;
};

export default identifiers;
