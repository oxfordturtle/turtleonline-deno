import React from "react";

export default (): JSX.Element => (
  <>
    <div className="filename">
      <select
        aria-label="Current file"
        data-bind="currentFileIndex"
      ></select>
      <input
        type="text"
        placeholder="filename"
        aria-label="Filename"
        data-bind="filename"
      />
      <button title="Close current file" data-send="closeProgram">
        <i className="fa fa-times" aria-hidden="true"></i>
      </button>
    </div>
  </>
);
