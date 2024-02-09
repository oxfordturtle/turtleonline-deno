import type { Constant, Type } from "./types.ts";

export const constantType = (constant: Constant): Type =>
    typeof constant.value === "number" ? "boolint" : "string";
