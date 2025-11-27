import { connectMutationObserver } from "../../../helpers/observer/connectMutationObserver";
import { refreshHighlightFrame } from "../../highlight/refreshHighlightFrame";

export const setupMutationObserver = (node: HTMLElement, nodeProvider: HTMLElement, canvasName: string = "canvas"): (() => void) | undefined => {
  const mutationObserver = connectMutationObserver(node, () => {
    refreshHighlightFrame(node, nodeProvider, canvasName);
  });

  return () => mutationObserver.disconnect();
};
