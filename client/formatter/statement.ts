import expression from "./expression.ts";
import { Language } from "../constants/languages.ts";
import { Statement } from "../parser/definitions/statement.ts";
import { Command } from "../constants/commands.ts";

/** formats a statement as a code string */
export default function statement(stmt: Statement, language: Language): string {
  switch (stmt.statementType) {
    case "variableAssignment":
      return `${stmt.variable.name} ${stmt.lexeme.content} ${expression(stmt.value, language)}`;

    case "procedureCall": {
      const name =
        stmt.command instanceof Command
          ? (stmt.command.names[language] as string)
          : stmt.command.name;
      if ((language === "BASIC" || language === "Pascal") && stmt.arguments.length === 0) {
        return name;
      }
      return `${name}(${stmt.arguments.map((x) => expression(x, language)).join(", ")})`;
    }

    case "returnStatement":
      return `${stmt.lexeme.content} ${expression(stmt.value, language)}`;

    case "ifStatement":
      return "TODO";

    case "forStatement":
      return "TODO";

    case "repeatStatement":
      return "TODO";

    case "whileStatement":
      return "TODO";

    case "passStatement":
      return "TODO";
  }
}
