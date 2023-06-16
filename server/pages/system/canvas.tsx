import React from "react"

export default (): JSX.Element => <>
  <div className="system-tab-pane active" data-tab="canvas">
    <div className="canvas">
      <div className="canvas-left">
        <div></div>
        <div className="canvas-coords" data-component="canvasYCoords">
          <span>0</span>
          <span>250</span>
          <span>500</span>
          <span>750</span>
          <span>999</span>
        </div>
      </div>
      <div className="canvas-right">
        <div className="canvas-coords" data-component="canvasXCoords">
          <span>0</span>
          <span>250</span>
          <span>500</span>
          <span>750</span>
          <span>999</span>
        </div>
        <div className="canvas-wrapper">
          <canvas width="1000" height="1000" data-component="canvas"></canvas>
        </div>
      </div>
    </div>
    <pre className="console" data-component="console"></pre>
  </div>
</>
