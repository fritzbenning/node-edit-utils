import { setupKeydownHandler } from "./setupKeydownHandler";
import { setupMutationObserver } from "./setupMutationObserver";

export const setupNodeListeners = (node: HTMLElement, nodeProvider: HTMLElement | null, blur: () => void): (() => void) => {
  if (!nodeProvider) {
    return () => {};
  }

  node.addEventListener("blur", blur);

  const keydownCleanup = setupKeydownHandler(node);

  const mutationCleanup = setupMutationObserver(node, nodeProvider);

  return () => {
    node.removeEventListener("blur", blur);
    keydownCleanup();
    mutationCleanup?.();
  };
};
