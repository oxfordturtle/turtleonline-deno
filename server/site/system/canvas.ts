export default `
<div class="system-tab-pane active" data-tab="canvas">
  <div class="canvas">
    <div class="canvas-left">
      <div></div>
      <div class="canvas-coords" data-component="canvasYCoords">
        <span>0</span>
        <span>250</span>
        <span>500</span>
        <span>750</span>
        <span>999</span>
      </div>
    </div>
    <div class="canvas-right">
      <div class="canvas-coords" data-component="canvasXCoords">
        <span>0</span>
        <span>250</span>
        <span>500</span>
        <span>750</span>
        <span>999</span>
      </div>
      <div class="canvas-wrapper">
        <canvas width="1000" height="1000" data-component="canvas"></canvas>
      </div>
    </div>
  </div>
  <pre class="console" data-component="console"></pre>
</div>
`
