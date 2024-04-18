import React from "react";

export default (): JSX.Element => (
  <>
    <div
      className="system-tab-pane"
      data-tab="memory"
      data-mode="expert,machine"
    >
      <div className="system-buttons">
        <button data-send="dumpMemory">Show Current State</button>
      </div>
      <div className="memory-container">
        <table>
          <thead>
            <tr>
              <td>Stack</td>
              <th>+0</th>
              <th>+1</th>
              <th>+2</th>
              <th>+3</th>
              <th>+4</th>
              <th>+5</th>
              <th>+6</th>
              <th>+7</th>
              <th>+8</th>
              <th>+9</th>
            </tr>
          </thead>
          <tbody data-component="memoryStackTableBody"></tbody>
        </table>
      </div>
      <div className="memory-container">
        <table>
          <thead>
            <tr>
              <td>Heap</td>
              <th>+0</th>
              <th>+1</th>
              <th>+2</th>
              <th>+3</th>
              <th>+4</th>
              <th>+5</th>
              <th>+6</th>
              <th>+7</th>
              <th>+8</th>
              <th>+9</th>
            </tr>
          </thead>
          <tbody data-component="memoryHeapTableBody"></tbody>
        </table>
      </div>
    </div>
  </>
);
