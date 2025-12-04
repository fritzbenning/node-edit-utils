import { connectMutationObserver } from "../../../helpers/observer/connectMutationObserver";
import { refreshHighlightFrame } from "../../highlight/refreshHighlightFrame";
import { handleTextChange } from "../helpers/handleTextChange";

export const setupMutationObserver = (
  node: HTMLElement,
  nodeProvider: HTMLElement,
  canvasName: string = "canvas"
): (() => void) | undefined => {
  // Accumulate mutations instead of replacing them
  let pendingMutations: MutationRecord[] = [];
  let rafId1: number | null = null;
  let rafId2: number | null = null;

  const processMutations = () => {
    if (pendingMutations.length > 0) {
      const mutationsToProcess = [...pendingMutations];
      pendingMutations = [];
      handleTextChange(node, mutationsToProcess);
    }
  };

  const scheduleProcess = () => {
    if (rafId1 === null) {
      rafId1 = requestAnimationFrame(() => {
        // First RAF: let browser complete layout
        rafId2 = requestAnimationFrame(() => {
          // Second RAF: read textContent after layout is complete
          processMutations();
          rafId1 = null;
          rafId2 = null;
        });
      });
    }
  };

  const cleanup = () => {
    if (rafId1 !== null) {
      cancelAnimationFrame(rafId1);
      rafId1 = null;
    }
    if (rafId2 !== null) {
      cancelAnimationFrame(rafId2);
      rafId2 = null;
    }
    pendingMutations = [];
  };

  const mutationObserver = connectMutationObserver(node, (mutations) => {
    // Accumulate mutations instead of replacing
    pendingMutations.push(...mutations);
    scheduleProcess();
    refreshHighlightFrame(node, nodeProvider, canvasName);
  });

  return () => {
    mutationObserver.disconnect();
    cleanup();
  };
};
