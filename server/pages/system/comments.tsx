import React from "react";

export default (): JSX.Element => (
  <>
    <div
      className="system-tab-pane"
      data-tab="comments"
      data-mode="expert,machine"
    >
      <table>
        <thead>
          <th>Line</th>
          <th>Comment</th>
        </thead>
        <tbody data-component="commentsTableBody"></tbody>
      </table>
    </div>
  </>
);
