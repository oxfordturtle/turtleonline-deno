import React from "react";

export default (): JSX.Element => (
  <>
    <div className="system-sub-menu">
      <a data-send="toggleSystemMenu" data-value="edit">
        <i className="fa fa-edit" title="Edit"></i>
        <span>Edit</span>
        <i className="fa fa-caret-right"></i>
      </a>
      <div className="system-sub-menu" data-system-menu="edit">
        <a data-send="undo">
          <span>Undo</span>
        </a>
        <a data-send="redo">
          <span>Redo</span>
        </a>
        <hr />
        <a data-send="cut">
          <span>Cut</span>
        </a>
        <a data-send="copy">
          <span>Copy</span>
        </a>
        <a data-send="paste">
          <span>Paste</span>
        </a>
        <hr />
        <a data-send="selectAll" data-mode="normal,expert,machine">
          <span>Select All</span>
        </a>
        <a data-send="findAndReplace">
          <span>Find and replace</span>
        </a>
        <hr />
        <a data-send="autoFormat">
          <span>Auto-format program</span>
        </a>
        <hr data-mode="normal,expert,machine" />
        <a data-send="storeCopy" data-mode="normal,expert,machine">
          <span>Store copy of program</span>
        </a>
        <a data-send="restoreCopy" data-mode="normal,expert,machine">
          <span>Restore previous version</span>
        </a>
      </div>
    </div>
  </>
);
