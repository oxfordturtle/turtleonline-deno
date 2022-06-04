export default `
<div class="turtle-properties">
  <button title="RUN" data-action="run" data-component="runButton"><i class="fa fa-play" aria-hidden="true"></i></button>
  <button title="HALT" data-action="halt" disabled="disabled" data-component="haltButton"><i class="fa fa-stop" aria-hidden="true"></i></button>
  <div class="turtle-property">
    <span class="turtle-label">X</span>
    <span class="turtle-value" data-component="turtxDisplay">500</span>
  </div>
  <div class="turtle-property">
    <span class="turtle-label">Y</span>
    <span class="turtle-value" data-component="turtyDisplay">500</span>
  </div>
  <div class="turtle-property">
    <span class="turtle-label"><i class="fa fa-compass" aria-hidden="true"></i></span>
    <span class="turtle-value"><span data-component="turtdDisplay">0</span>/<span data-component="turtaDisplay">360</span></span>
  </div>
  <div class="turtle-property">
    <span class="turtle-label"><i class="fa fa-pen" aria-hidden="true"></i></span>
    <span class="turtle-value turtle-pen" data-component="turttDisplay">2</span>
  </div>
  <div class="turtle-property">
    <span class="turtle-label"><i class="fa fa-palette" aria-hidden="true"></i></span>
    <span class="turtle-value turtle-colour" data-component="turtcDisplay">0</span>
  </div>
</div>
`
