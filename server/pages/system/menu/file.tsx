import React from "react";

export default (): JSX.Element => (
  <>
    <div className="system-sub-menu">
      <a data-send="toggleSystemMenu" data-value="file">
        <i className="fa fa-folder-open" title="File"></i>
        <span>File</span>
        <i className="fa fa-caret-right"></i>
      </a>
      <div className="system-sub-menu" data-system-menu="file">
        <a data-send="newProgram">
          <span>New program</span>
        </a>
        <a data-send="newSkeletonProgram">
          <span>Skeleton program</span>
        </a>
        <a data-send="openProgram">
          <span>Open program</span>
        </a>
        <a data-send="saveProgram">
          <span>Save program as ...</span>
        </a>
        <a data-send="saveExportFile" data-mode="expert,machine">
          <span>Save Export/Upload file</span>
        </a>
        <a data-send="closeProgram">
          <span>Close program</span>
        </a>
        <hr data-mode="normal,expert,machine" />
        <a data-send="copyCanvasGraphic" data-mode="normal,expert,machine">
          <span>Copy canvas graphic to clipboard</span>
        </a>
        <a data-send="saveCanvasGraphic" data-mode="normal,expert,machine">
          <span>Save canvas graphic to file</span>
        </a>
        <hr data-mode="expert,machine" />
        <a data-send="printProgram" data-mode="expert,machine">
          <span>Print program</span>
        </a>
        <a data-send="printOutputText" data-mode="expert,machine">
          <span>Print text in Output tab</span>
        </a>
        <a data-send="printConsoleText" data-mode="expert,machine">
          <span>Print text in Console</span>
        </a>
      </div>
    </div>
  </>
);
