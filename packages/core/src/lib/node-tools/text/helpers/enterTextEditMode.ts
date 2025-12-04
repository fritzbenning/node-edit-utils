import type { NodeText } from "../types";

export const enterTextEditMode = (
  node: HTMLElement,
  nodeProvider: HTMLElement | null,
  text: NodeText
): void => {
  if (!node || !nodeProvider) {
    return;
  }

  text.enableEditMode(node, nodeProvider);
};

