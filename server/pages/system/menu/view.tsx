import React from "react";

export default (): JSX.Element => (
  <>
    <div className="system-sub-menu">
      <a data-send="toggleSystemMenu" data-value="view">
        <i className="fa fa-glasses" title="View"></i>
        <span>View</span>
        <i className="fa fa-caret-right"></i>
      </a>
      <div className="system-sub-menu" data-system-menu="view">
        <label>
          <span>Font family for editor:</span>
          <select data-bind="editorFontFamily">
            <option value="Consolas">Consolas</option>
            <option value="Courier">Courier</option>
            <option value="Lucida Sans Typewriter">Lucida Sans Typewriter</option>
            <option value="Monospace">Monospace</option>
          </select>
        </label>
        <label>
          <span>Font size for editor (px):</span>
          <input type="number" data-bind="editorFontSize" />
        </label>
        <hr />
        <label>
          <span>Font family for output:</span>
          <select data-bind="outputFontFamily">
          <option value="Consolas">Consolas</option>
            <option value="Courier">Courier</option>
            <option value="Lucida Sans Typewriter">Lucida Sans Typewriter</option>
            <option value="Monospace">Monospace</option>
          </select>
        </label>
        <label>
          <span>Font size for output (px):</span>
          <input type="number" data-bind="outputFontSize" />
        </label>
        <hr />
        <label>
          <input type="radio" name="mode" data-bind="mode" value="simple" />
          <span>Simple Mode</span>
        </label>
        <label>
          <input type="radio" name="mode" data-bind="mode" value="normal" />
          <span>Normal Mode</span>
        </label>
        <label>
          <input type="radio" name="mode" data-bind="mode" value="expert" />
          <span>Expert Mode</span>
        </label>
        <label>
          <input type="radio" name="mode" data-bind="mode" value="machine" />
          <span>Machine Mode</span>
        </label>
      </div>
    </div>
  </>
);
