export type Type = (typeof types)[number];

const types = ["boolint", "boolean", "integer", "character", "string"] as const;

export default types;
