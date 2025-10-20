import { getHighlightFrameElement } from "./helpers/getHighlightFrameElement";

export const updateHighlightFrameBorder = (node: HTMLElement, nodeProvider: HTMLElement, zoom: number) => {
  const frame = getHighlightFrameElement(nodeProvider);

  if (!frame) return;

  nodeProvider.style.setProperty("--zoom", zoom.toString());
};