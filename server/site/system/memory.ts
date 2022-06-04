export default `
<div class="system-tab-pane" data-tab="memory" data-mode="expert,machine">
  <div class="system-buttons"><button data-action="dumpMemory">Show Current State</button></div>
    <div class="memory-container">
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
  <div class="memory-container">
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
`
