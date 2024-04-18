import React from "react";
import cursors, { type Cursor } from "../../../../../client/constants/cursors.ts";

export default (): JSX.Element => (
  <>
    <table>
      <thead>
        <tr>
          <th>No.</th>
          <th>Name</th>
          <th>No.</th>
          <th>Name</th>
          <th>No.</th>
          <th>Name</th>
          <th>No.</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        <tr>{cursors.slice(0, 4).map(cursorTableCells)}</tr>
        <tr>{cursors.slice(4, 8).map(cursorTableCells)}</tr>
        <tr>{cursors.slice(8, 12).map(cursorTableCells)}</tr>
        <tr>{cursors.slice(12, 16).map(cursorTableCells)}</tr>
      </tbody>
    </table>
  </>
);

const cursorTableCells = (cursor: Cursor) => (
  <>
    <td>{cursor.index}</td>
    <td style={{ cursor: cursor.css }}>{cursor.name}</td>
  </>
);
