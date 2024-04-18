import React from "react";

export default (): JSX.Element => (
  <>
    <div
      className="system-tab-pane"
      data-tab="pcode"
      data-mode="expert,machine"
    >
      <div className="system-checkboxes">
        <label>
          <input
            type="radio"
            name="pcodeDisplayType"
            value="assembler"
            data-bind="pcodeDisplayType"
          />
          Assembler Code
        </label>
        <label>
          <input
            type="radio"
            name="pcodeDisplayType"
            value="machine"
            data-bind="pcodeDisplayType"
          />
          Machine Code
        </label>
        <label>
          <input
            type="radio"
            name="pcodeDisplayRadix"
            value="decimal"
            data-bind="pcodeDisplayRadix"
          />
          Decimal
        </label>
        <label>
          <input
            type="radio"
            name="pcodeDisplayRadix"
            value="hexadecimal"
            data-bind="pcodeDisplayRadix"
          />
          Hexadecimal
        </label>
      </div>
      <ol className="pcode" data-component="pcodeList"></ol>
    </div>
  </>
);
