import React from "react";
import File from "./menu/file.tsx";
import Edit from "./menu/edit.tsx";
import View from "./menu/view.tsx";
import Compile from "./menu/compile.tsx";
import Run from "./menu/run.tsx";
import Options from "./menu/options.tsx";
import Examples from "./menu/examples.tsx";

export default (): JSX.Element => (
  <nav className="system-menu" data-menu="system">
    <File />
    <Edit />
    <View />
    <Compile />
    <Run />
    <Options />
    <Examples />
  </nav>
);
