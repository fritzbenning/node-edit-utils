import { connectMutationObserver } from "../../node-tools/highlight/observer/connectMutationObserver";
import { refreshHighlightFrame } from "../../node-tools/highlight/refreshHighlightFrame";

export const setupMutationObserver = (node: HTMLElement, nodeProvider: HTMLElement): (() => void) | undefined => {
  const cleanup = connectMutationObserver(node, () => {
    refreshHighlightFrame(node, nodeProvider, window.canvas?.zoom.current ?? 1);
  });

  return cleanup;
};
