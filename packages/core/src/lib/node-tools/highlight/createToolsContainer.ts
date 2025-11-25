import { createTagLabel } from "./createTagLabel";

export const createToolsContainer = (node: HTMLElement, highlightFrame: HTMLElement, isInstance: boolean = false): void => {
  const nodeTools = document.createElement("div");

  nodeTools.className = "node-tools";
  if (isInstance) {
    nodeTools.classList.add("is-instance");
  }
  highlightFrame.appendChild(nodeTools);

  createTagLabel(node, nodeTools);
};
