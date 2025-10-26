import { connectMutationObserver } from "../../highlight/observer/connectMutationObserver";
import { refreshHighlightFrame } from "../../highlight/refreshHighlightFrame";

export const setupMutationObserver = (node: HTMLElement, nodeProvider: HTMLElement): (() => void) | undefined => {
  const cleanup = connectMutationObserver(node, () => {
    refreshHighlightFrame(node, nodeProvider, window.canvas?.zoom.current ?? 1);
  });

  return cleanup;
};
