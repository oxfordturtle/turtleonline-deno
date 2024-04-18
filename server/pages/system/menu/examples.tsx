import React from "react";

export default (): JSX.Element => (
  <>
    <div className="system-sub-menu">
      <a data-send="toggleSystemMenu" data-value="examples">
        <i className="fa fa-life-ring" title="Examples"></i>
        <span>Examples</span>
        <i className="fa fa-caret-right"></i>
      </a>
      <div className="system-sub-menu" data-system-menu="examples">
        <div data-component="examplesMenu"></div>
        <hr />
        <label>
          <input type="checkbox" data-bind="includeCommentsInExamples" />
          <span>Include comments within example programs</span>
        </label>
        <label>
          <input type="checkbox" data-bind="loadCorrespondingExample" />
          <span>Load corresponding example on language switch</span>
        </label>
      </div>
    </div>
  </>
);
