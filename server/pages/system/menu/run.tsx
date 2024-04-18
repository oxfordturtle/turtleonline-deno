import React from "react";

export default (): JSX.Element => (
  <>
    <div className="system-sub-menu">
      <a data-send="toggleSystemMenu" data-value="run">
        <i className="fa fa-play" title="Run"></i>
        <span>Run</span>
        <i className="fa fa-caret-right"></i>
      </a>
      <div className="system-sub-menu" data-system-menu="run">
        <a data-send="run">
          <span>Run program</span>
        </a>
        <a data-send="halt">
          <span>Halt program</span>
        </a>
        <a data-send="pause">
          <span>Pause program</span>
        </a>
        <a data-send="resetMachine">
          <span>Reset Canvas, Console and Output</span>
        </a>
        <hr data-mode="normal,expert,machine" />
        <label data-mode="normal,expert,machine">
          <input type="checkbox" data-bind="showCanvasOnRun" />
          <span>Show Canvas on RUN</span>
        </label>
        <label data-mode="normal,expert,machine">
          <input type="checkbox" data-bind="showOutputOnWrite" />
          <span>Show Output tab when text output is generated</span>
        </label>
        <label data-mode="machine">
          <input type="checkbox" data-bind="showMemoryOnDump" />
          <span>Show memory tab when dumping memory</span>
        </label>
        <hr data-mode="expert,machine" />
        <label data-mode="machine">
          <input type="checkbox" data-bind="traceOnRun" />
          <span>Trace on run</span>
        </label>
        <a data-send="viewMachineOptions" data-mode="machine">
          <span>Run Options (screen updating / trace display / memory)</span>
        </a>
        <a data-send="loadAndRunPCode" data-mode="expert,machine">
          <span>Load and Run PCode file (ignoring source code)</span>
        </a>
        <hr data-mode="machine" />
        <label data-mode="machine">
          <input type="checkbox" data-bind="activateHCLR" />
          <span>Auto-delete temporary heap strings (by activating HCLR)</span>
        </label>
        <label data-mode="machine">
          <input type="checkbox" data-bind="preventStackCollision" />
          <span>Prevent memory stack collision with Heap</span>
        </label>
        <label data-mode="machine">
          <input type="checkbox" data-bind="rangeCheckArrays" />
          <span>Range-check all references to array elements</span>
        </label>
      </div>
    </div>
  </>
);
