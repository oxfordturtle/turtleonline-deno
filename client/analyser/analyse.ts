import {
  category,
  commandCategories,
  keywordCategories,
  type Category,
} from "../constants/categories.ts";
import type { Command } from "../constants/commands.ts";
import type { Keyword } from "../constants/keywords.ts";
import type { Lexeme } from "../lexer/lexeme.ts";
import { getAllSubroutines, type Program } from "../parser/definitions/routine.ts";
import usageCategory, { type UsageCategory } from "./usageCategory.ts";

export default (lexemes: Lexeme[], program: Program): UsageCategory[] => {
  const categories: ReadonlyArray<Category<Command | Keyword>> = [
    ...commandCategories,
    ...keywordCategories[program.language],
  ];

  const usageCategories = categories.map((category) =>
    usageCategory(program.language, lexemes, category)
  );

  const subroutineCategory = category(30, "Subroutine calls", getAllSubroutines(program).slice(1));

  // TODO: don't count subroutine definitions as subroutine calls

  const subroutineUsageCategory = usageCategory(program.language, lexemes, subroutineCategory);

  return usageCategories
    .concat(subroutineUsageCategory)
    .filter((category) => category.expressions.length > 0);
};
