import { createTagLabel } from "./createTagLabel";

export const createToolsContainer = (node: HTMLElement, highlightFrame: HTMLElement, isInstance: boolean = false, isTextEdit: boolean = false): void => {
  const nodeTools = document.createElement("div");

  nodeTools.className = "node-tools";
  if (isInstance) {
    nodeTools.classList.add("is-instance");
  }
  if (isTextEdit) {
    nodeTools.classList.add("is-text-edit");
  }
  highlightFrame.appendChild(nodeTools);

  createTagLabel(node, nodeTools);
};
