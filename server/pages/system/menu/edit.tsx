import { React } from "../../../../deps.ts"

export default (): JSX.Element => <>
  <div className="system-sub-menu">
    <a data-action="toggleSystemMenu" data-arg="edit">
      <i className="fa fa-edit" title="Edit"></i>
      <span>Edit</span>
      <i className="fa fa-caret-right"></i>
    </a>
    <div className="system-sub-menu" data-system-menu="edit">
      <a data-action="undo"><span>Undo</span></a>
      <a data-action="redo"><span>Redo</span></a>
      <hr />
      <a data-action="cut"><span>Cut</span></a>
      <a data-action="copy"><span>Copy</span></a>
      <a data-action="paste"><span>Paste</span></a>
      <hr />
      <a data-action="selectAll" data-mode="normal,expert,machine"><span>Select All</span></a>
      <a data-action="findAndReplace"><span>Find and replace</span></a>
      <hr />
      <a data-action="autoFormat"><span>Auto-format program</span></a>
      <hr data-mode="normal,expert,machine" />
      <a data-action="storeCopy" data-mode="normal,expert,machine"><span>Store copy of program</span></a>
      <a data-action="restoreCopy" data-mode="normal,expert,machine"><span>Restore previous version</span></a>
    </div>
  </div>
</>
