import { handlePostMessage } from "../../post-message/handlePostMessage";
import { handleNodeClick } from "./click/handleNodeClick";

export const setupEventListener = (
  onNodeSelected: (node: HTMLElement | null) => void,
  nodeProvider: HTMLElement | null,
  getEditableNode: () => HTMLElement | null,
  onEscapePressed?: () => void
): (() => void) => {
  const messageHandler = (event: MessageEvent) => {
    handlePostMessage(event);
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
