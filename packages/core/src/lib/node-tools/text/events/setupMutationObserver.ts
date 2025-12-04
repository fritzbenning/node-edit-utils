import { connectMutationObserver } from "../../../helpers/observer/connectMutationObserver";
import { withRAFThrottle } from "../../../helpers/withRAF";
import { refreshHighlightFrame } from "../../highlight/refreshHighlightFrame";
import { handleTextChange } from "../helpers/handleTextChange";

export const setupMutationObserver = (
  node: HTMLElement,
  nodeProvider: HTMLElement,
  canvasName: string = "canvas"
): (() => void) | undefined => {
  const throttledHandleTextChange = withRAFThrottle((mutations: MutationRecord[]) => {
    handleTextChange(node, mutations);
  });

  const mutationObserver = connectMutationObserver(node, (mutations) => {
    throttledHandleTextChange(mutations);
    refreshHighlightFrame(node, nodeProvider, canvasName);
  });

  return () => {
    mutationObserver.disconnect();
    throttledHandleTextChange.cleanup();
  };
};
