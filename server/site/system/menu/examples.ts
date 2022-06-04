export default `
<div class="system-sub-menu">
  <a data-action="toggleSystemMenu" data-arg="examples">
    <i class="fa fa-life-ring" title="Examples"></i>
    <span>Examples</span>
    <i class="fa fa-caret-right"></i>
  </a>
  <div class="system-sub-menu" data-system-menu="examples">
    <div data-component="examplesMenu"></div>
    <hr>
    <label>
      <input type="checkbox" data-binding="includeCommentsInExamples">
      <span>Include comments within example programs</span>
    </label>
    <label>
      <input type="checkbox" data-binding="loadCorrespondingExample">
      <span>Load corresponding example on language switch</span>
    </label>
  </div>
</div>
`
