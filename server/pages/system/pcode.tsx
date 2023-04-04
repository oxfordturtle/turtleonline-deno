import { React } from "../../../deps.ts"

export default (): JSX.Element => <>
  <div className="system-tab-pane" data-tab="pcode" data-mode="expert,machine">
    <div className="system-checkboxes">
      <label><input type="radio" name="pcodeOptions1" value="assembler" data-binding="assembler" />Assembler Code</label>
      <label><input type="radio" name="pcodeOptions1" value="machine" data-binding="assembler" />Machine Code</label>
      <label><input type="radio" name="pcodeOptions2" value="decimal" data-binding="decimal" />Decimal</label>
      <label><input type="radio" name="pcodeOptions2" value="hexadecimal" data-binding="decimal" />Hexadecimal</label>
    </div>
    <ol className="pcode" data-component="pcodeList"></ol>
  </div>
</>
