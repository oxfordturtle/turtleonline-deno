export type Input = ReturnType<typeof input>;

const input = (name: string, value: number) => ({
  __: "Input",
  name,
  value,
}) as const;

export default [
  input("mousekey", -11),
  input("kshift", -10),
  input("key", -9),
  input("mousey", -8),
  input("mousex", -7),
  input("clicky", -6),
  input("clickx", -5),
  input("click", -4),
  input("mmouse", -3),
  input("rmouse", -2),
  input("lmouse", -1),
  input("keybuffer", 0),
  input("backspace", 8),
  input("tab", 9),
  input("enter", 13),
  input("return", 13),
  input("shift", 16),
  input("ctrl", 17),
  input("alt", 18),
  input("pause", 19),
  input("capslock", 20),
  input("escape", 27),
  input("space", 32),
  input("pgup", 33),
  input("pgdn", 34),
  input("end", 35),
  input("home", 36),
  input("left", 37),
  input("up", 38),
  input("right", 39),
  input("down", 40),
  input("insert", 45),
  input("delete", 46),
  input("0", 48),
  input("1", 49),
  input("2", 50),
  input("3", 51),
  input("4", 52),
  input("5", 53),
  input("6", 54),
  input("7", 55),
  input("8", 56),
  input("9", 57),
  input("a", 65),
  input("b", 66),
  input("c", 67),
  input("d", 68),
  input("e", 69),
  input("f", 70),
  input("g", 71),
  input("h", 72),
  input("i", 73),
  input("j", 74),
  input("k", 75),
  input("l", 76),
  input("m", 77),
  input("n", 78),
  input("o", 79),
  input("p", 80),
  input("q", 81),
  input("r", 82),
  input("s", 83),
  input("t", 84),
  input("u", 85),
  input("v", 86),
  input("w", 87),
  input("x", 88),
  input("y", 89),
  input("z", 90),
  input("lwin", 91),
  input("rwin", 92),
  input("#0", 96),
  input("#1", 97),
  input("#2", 98),
  input("#3", 99),
  input("#4", 100),
  input("#5", 101),
  input("#6", 102),
  input("#7", 103),
  input("#8", 104),
  input("#9", 105),
  input("multiply", 106),
  input("add", 107),
  input("subtract", 109),
  input("decimal", 110),
  input("divide", 111),
  input("f1", 112),
  input("f2", 113),
  input("f3", 114),
  input("f4", 115),
  input("f5", 116),
  input("f6", 117),
  input("f7", 118),
  input("f8", 119),
  input("f9", 120),
  input("f10", 121),
  input("f11", 122),
  input("f12", 123),
  input("numlock", 144),
  input("scrolllock", 145),
  input("semicolon", 186),
  input("equals", 187),
  input("comma", 188),
  input("dash", 189),
  input("fullstop", 190),
  input("forwardslash", 191),
  input("singlequote", 192),
  input("openbracket", 219),
  input("backslash", 220),
  input("closebracket", 221),
  input("hash", 222),
  input("backtick", 223),
  input("all", 256),
] as const;
