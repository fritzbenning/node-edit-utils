import { clickHandler } from "./clickHandler";
import { handlePostMessage } from "./handlePostMessage";

export const setupEventListener = (onNodeSelected: (node: HTMLElement | null) => void, nodeProvider: HTMLElement | null): (() => void) => {
  window.addEventListener("message", (event) => {
    handlePostMessage(event);
  });

  document.addEventListener("click", (event) => {
    clickHandler(event, onNodeSelected, nodeProvider);
  });

  return () => {
    window.removeEventListener("message", (event) => {
      handlePostMessage(event);
    });

    document.removeEventListener("click", (event) => {
      clickHandler(event, onNodeSelected, nodeProvider);
    });
  };
};
