import { processPostMessage } from "@/lib/post-message/processPostMessage";
import { handleNodeClick } from "./click/handleNodeClick";

export const setupEventListener = (
  nodeProvider: HTMLElement | null,
  onNodeSelected: (node: HTMLElement | null) => void,
  onEscapePressed: () => void,
  getEditableNode: () => HTMLElement | null
): (() => void) => {
  const messageHandler = (event: MessageEvent) => {
    processPostMessage(event, onNodeSelected);
  };

  const documentClickHandler = (event: MouseEvent) => {
    handleNodeClick(event, nodeProvider, getEditableNode(), onNodeSelected);
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
  document.addEventListener("keydown", documentKeydownHandler);

  return () => {
    window.removeEventListener("message", messageHandler);
    document.removeEventListener("click", documentClickHandler);
    document.removeEventListener("keydown", documentKeydownHandler);
  };
};
