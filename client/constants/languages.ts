export type Language = (typeof languages)[number];

const languages = ["BASIC", "C", "Java", "Pascal", "Python", "TypeScript"] as const;

export default languages;

export const isLanguage = (value: string): value is Language =>
  languages.includes(value as Language);

export const extension: Record<Language, string> = {
  BASIC: "tbas",
  C: "tc",
  Java: "tjav",
  Pascal: "tpas",
  Python: "tpy",
  TypeScript: "tts",
};

export const trueValue: Record<Language, 1 | -1> = {
  BASIC: -1,
  C: -1,
  Java: -1,
  Pascal: -1,
  Python: 1,
  TypeScript: 1,
};
