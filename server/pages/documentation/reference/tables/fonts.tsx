import React from "https://esm.sh/react@18.2.0"

export default (): JSX.Element => <>
  <table>
    <thead>
      <tr>
        <th>Font Family Name</th>
        <th>Plain</th>
        <th>Italic</th>
        <th>Bold</th>
        <th>Italic+Bold</th>
        <th>Underlined</th>
        <th>Strikethrough</th>
      </tr>
    </thead>
    <tbody data-component="fontsTableBody"></tbody>
  </table>
</>
