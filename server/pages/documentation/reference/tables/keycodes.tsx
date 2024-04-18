import React from "react";
import inputs, { type Input } from "../../../../../client/constants/inputs.ts";

export default (): JSX.Element => (
  <>
    <table>
      <thead>
        <tr>
          <th>Number</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>{inputs.map(keycodeTableRow)}</tbody>
    </table>
  </>
);

const keycodeTableRow = (keycode: Input) => (
  <tr>
    <td>
      <code>{keycode.name}</code>
    </td>
    <td>{keycode.value}</td>
  </tr>
);
