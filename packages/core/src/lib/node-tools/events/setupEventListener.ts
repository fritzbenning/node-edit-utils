import { clickHandler } from "./clickHandler";
import { handlePostMessage } from "./handlePostMessage";

export const setupEventListener = (
  onNodeSelected: (node: HTMLElement | null) => void,
  nodeProvider: HTMLElement | null,
  getEditableNode: () => HTMLElement | null
): (() => void) => {
  const messageHandler = (event: MessageEvent) => {
    handlePostMessage(event);
  };

  const documentClickHandler = (event: MouseEvent) => {
    clickHandler(event, nodeProvider, getEditableNode(), onNodeSelected);
  };

  window.addEventListener("message", messageHandler);
  document.addEventListener("click", documentClickHandler);

  return () => {
    window.removeEventListener("message", messageHandler);
    document.removeEventListener("click", documentClickHandler);
  };
};
