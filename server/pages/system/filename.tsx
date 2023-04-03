import React from "https://esm.sh/react@18.2.0"

export default (): JSX.Element => <>
  <div className="filename">
    <select aria-label="Current file" data-binding="currentFileIndex"></select>
    <input type="text" placeholder="filename" aria-label="Filename" data-binding="filename" />
    <button title="Close current file" data-action="closeProgram"><i className="fa fa-times" aria-hidden="true"></i></button>
  </div>
</>
