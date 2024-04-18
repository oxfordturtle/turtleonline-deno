import { createHub } from "../elementary/index.ts";

const hub = createHub<{ version: string }>();

export default hub;

hub.on("version", (version) => {
  const downloadLink = document.querySelector<HTMLAnchorElement>("a[data-component='downloadLink']");
  if (downloadLink) {
    const bits = downloadLink.href.split("/");
    bits.pop();
    bits.push(version);
    downloadLink.href = bits.join("/");
  }
});
