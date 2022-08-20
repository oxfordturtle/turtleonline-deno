import React from "react"

export default (): JSX.Element => <>
  <div className="system-tab-pane" data-tab="usage" data-mode="normal,expert,machine">
    <div className="usage">
      <table className="usage-table">
        <thead>
          <tr>
            <th>Expression</th>
            <th>Level</th>
            <th>Count</th>
            <th>Program Lines</th>
          </tr>
        </thead>
        <tbody data-component="usageTableBody"></tbody>
      </table>
    </div>
  </div>
</>
