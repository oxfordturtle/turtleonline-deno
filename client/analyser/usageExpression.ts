import type { Expression } from "../constants/categories.ts";
import type { Language } from "../constants/languages.ts";
import type { Lexeme } from "../lexer/lexeme.ts";

export type UsageExpression<Exp extends Expression = Expression> = ReturnType<
  typeof usageExpression<Exp>
>;

const usageExpression = <Exp extends Expression>(
  language: Language,
  lexemes: Lexeme[],
  expression: Exp
) => {
  const name = expression.__ === "command" ? expression.names[language]! : expression.name;

  const uses =
    language === "Pascal"
      ? lexemes.filter((lexeme) => lexeme.content?.toLowerCase() === name.toLowerCase())
      : lexemes.filter((lexeme) => lexeme.content === name);
  uses.sort((a, b) => a.line - b.line);

  return {
    name: language === "Pascal" ? name.toLowerCase() : name,
    level: expression.level + 1,
    count: uses.length,
    lines: uses.reduce((x, y) => `${x} ${y.line.toString(10)}`, "").trim(),
  } as const;
};

export default usageExpression;
