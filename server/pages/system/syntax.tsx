import { React } from "../../../deps.ts"

export default (): JSX.Element => <>
  <div className="system-tab-pane" data-tab="syntax" data-mode="expert,machine">
    <div className="syntax">
      <table className="syntax-table">
        <thead>
          <tr>
            <th>Lex</th>
            <th>Line</th>
            <th>String</th>
            <th className="wide">Type</th>
          </tr>
        </thead>
        <tbody data-component="syntaxTableBody"></tbody>
      </table>
    </div>
  </div>
</>
