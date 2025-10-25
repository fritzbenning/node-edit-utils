import { createTagLabel } from "./createTagLabel";

export const createNodeTools = (node: HTMLElement, highlightFrame: HTMLElement): void => {
  const nodeTools = document.createElement("div");

  nodeTools.className = "node-tools";
  highlightFrame.appendChild(nodeTools);

  createTagLabel(node, nodeTools);
};
