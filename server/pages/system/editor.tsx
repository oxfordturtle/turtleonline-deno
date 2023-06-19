import React from "react";

export default (): JSX.Element => (
  <>
    <div className="editor" data-component="editor">
      <ol className="line-numbers"></ol>
      <div className="code-wrapper">
        <textarea
          wrap="off"
          spellCheck="false"
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          autoFocus={true}
        ></textarea>
        <pre>
          <code></code>
        </pre>
      </div>
    </div>
  </>
);
