import { connectMutationObserver } from "../../../helpers/observer/connectMutationObserver";
import { refreshHighlightFrame } from "../../highlight/refreshHighlightFrame";

export const setupMutationObserver = (node: HTMLElement, nodeProvider: HTMLElement): (() => void) | undefined => {
  const mutationObserver = connectMutationObserver(node, () => {
    refreshHighlightFrame(node, nodeProvider);
  });

  return () => mutationObserver.disconnect();
};
