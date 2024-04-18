import React from "react";
import fonts, { type Font } from "../../../../../client/constants/fonts.ts";

export default (): JSX.Element => (
  <>
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
      <tbody>
        {fonts.map(fontTableRow)}
      </tbody>
    </table>
  </>
);

const fontTableRow = (font: Font) => (
  <tr style={{ fontFamily: font.css }}>
    <td>{font.name}</td>
    <td>{font.index}</td>
    <td style={{ fontStyle: "italic" }}>{font.index + 16}</td>
    <td style={{ fontWeight: "bold" }}>{font.index + 32}</td>
    <td style={{ fontStyle: "italic", fontWeight: "bold" }}>{font.index + 48}</td>
    <td style={{ textDecoration: "underline" }}>{font.index + 64}</td>
    <td style={{ textDecoration: "line-through" }}>{font.index + 128}</td>
  </tr>
);
