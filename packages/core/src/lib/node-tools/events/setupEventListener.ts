import { processPostMessage } from "@/lib/post-message/processPostMessage";
import type { NodeText } from "../text/types";
import { handleNodeClick } from "./click/handleNodeClick";
import { handleNodeDoubleClick } from "./click/handleNodeDoubleClick";

export const setupEventListener = (
  nodeProvider: HTMLElement | null,
  onNodeSelected: (node: HTMLElement | null) => void,
  onEscapePressed: () => void,
  getEditableNode: () => HTMLElement | null,
  getSelectedNode: () => HTMLElement | null,
  text: NodeText
): (() => void) => {
  const messageHandler = (event: MessageEvent) => {
    processPostMessage(event, onNodeSelected);
  };

  const documentClickHandler = (event: MouseEvent) => {
    handleNodeClick(event, nodeProvider, getEditableNode(), onNodeSelected);
  };

  const documentDoubleClickHandler = (event: MouseEvent) => {
    handleNodeDoubleClick(event, nodeProvider, getSelectedNode(), text);
  };

  const documentKeydownHandler = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      onEscapePressed?.();
    }
  };

  window.addEventListener("message", messageHandler);
  document.addEventListener("click", documentClickHandler);
  document.addEventListener("dblclick", documentDoubleClickHandler);
  document.addEventListener("keydown", documentKeydownHandler);

  return () => {
    window.removeEventListener("message", messageHandler);
    document.removeEventListener("click", documentClickHandler);
    document.removeEventListener("dblclick", documentDoubleClickHandler);
    document.removeEventListener("keydown", documentKeydownHandler);
  };
};
