import React from "https://esm.sh/react@18.2.0"

export default (): JSX.Element => <>
  <div className="turtle-properties">
    <button title="RUN" data-action="run" data-component="runButton"><i className="fa fa-play" aria-hidden="true"></i></button>
    <button title="HALT" data-action="halt" disabled={true} data-component="haltButton"><i className="fa fa-stop" aria-hidden="true"></i></button>
    <div className="turtle-property">
      <span className="turtle-label">X</span>
      <span className="turtle-value" data-component="turtxDisplay">500</span>
    </div>
    <div className="turtle-property">
      <span className="turtle-label">Y</span>
      <span className="turtle-value" data-component="turtyDisplay">500</span>
    </div>
    <div className="turtle-property">
      <span className="turtle-label"><i className="fa fa-compass" aria-hidden="true"></i></span>
      <span className="turtle-value"><span data-component="turtdDisplay">0</span>/<span data-component="turtaDisplay">360</span></span>
    </div>
    <div className="turtle-property">
      <span className="turtle-label"><i className="fa fa-pen" aria-hidden="true"></i></span>
      <span className="turtle-value turtle-pen" data-component="turttDisplay">2</span>
    </div>
    <div className="turtle-property">
      <span className="turtle-label"><i className="fa fa-palette" aria-hidden="true"></i></span>
      <span className="turtle-value turtle-colour" data-component="turtcDisplay">0</span>
    </div>
  </div>
</>
