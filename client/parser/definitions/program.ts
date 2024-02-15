import type { Language } from "../../constants/languages.ts";
import Routine from "./routine.ts";
import { Variable } from "./variable.ts";

/** program */
export default class Program extends Routine {
  readonly __ = "program";

  /** constructor */
  constructor(language: Language, name?: string) {
    super(language, name);
  }

  /** creates a built-in turtle variable */
  turt(name: "x" | "y" | "d" | "a" | "t" | "c"): Variable {
    const fullName = this.language === "BASIC" ? `turt${name}%` : `turt${name}`;
    const variable = new Variable(fullName, this);
    variable.type = "integer";
    variable.typeIsCertain = true;
    variable.turtle = ["x", "y", "d", "a", "t", "c"].indexOf(name) + 1;
    return variable;
  }

  /** gets all built-in turtle variables */
  get turtleVariables(): Variable[] {
    return [
      this.turt("x"),
      this.turt("y"),
      this.turt("d"),
      this.turt("a"),
      this.turt("t"),
      this.turt("c"),
    ];
  }
}
