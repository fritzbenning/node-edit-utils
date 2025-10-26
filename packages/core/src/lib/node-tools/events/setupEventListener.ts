import { clickHandler } from "./clickHandler";
import { handlePostMessage } from "./handlePostMessage";

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
    clickHandler(event, nodeProvider, getEditableNode(), onNodeSelected);
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
