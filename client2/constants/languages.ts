export type Language = (typeof languages)[number];

const languages = [
  "BASIC",
  "C",
  "Java",
  "Pascal",
  "Python",
  "TypeScript",
] as const;

export default languages;

export const extensions: Record<Language, string> = {
  BASIC: "tbas",
  C: "tc",
  Java: "tjav",
  Pascal: "tpas",
  Python: "tpy",
  TypeScript: "tts",
};
