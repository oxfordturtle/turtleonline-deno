import React from "react";
import { commandCategories } from "../../../../../client/constants/categories.ts";

export default (): JSX.Element => (
  <>
    <div className="commands-table-options">
      <select data-bind="commandsCategoryIndex">
        {commandCategories.map((category) => (
          <option value={category.index}>{category.index + 1}. {category.title}</option>
        ))}
      </select>
      <div className="checkboxes">
        <label>
          <input type="checkbox" data-bind="showSimpleCommands" /> Simple
        </label>
        <label>
          <input type="checkbox" data-bind="showIntermediateCommands" />{" "}
          Intermediate
        </label>
        <label>
          <input type="checkbox" data-bind="showAdvancedCommands" /> Advanced
        </label>
      </div>
    </div>
    <table className="commands-table">
      <thead>
        <tr>
          <th>Command</th>
          <th>Parameters</th>
          <th>Returns</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody data-component="commandsTableBody"></tbody>
    </table>
  </>
);
