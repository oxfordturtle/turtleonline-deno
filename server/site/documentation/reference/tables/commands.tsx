import { React } from "../../../../../deps.ts"

export default <>
  <div className="commands-table-options">
    <select data-binding="commandsCategoryIndex"></select>
    <div className="checkboxes">
      <label><input type="checkbox" data-binding="showSimpleCommands" /> Simple</label>
      <label><input type="checkbox" data-binding="showIntermediateCommands" /> Intermediate</label>
      <label><input type="checkbox" data-binding="showAdvancedCommands" /> Advanced</label>
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
