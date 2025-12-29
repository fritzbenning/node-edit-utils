import type { NodeTools } from "../../../node-tools/types";

/**
 * Selects the first child node inside a viewport element.
 * Skips the resize-handle element if present.
 */
export const selectFirstViewportNode = (viewportElement: HTMLElement): void => {
  const firstChild = Array.from(viewportElement.children).find(
    (child) => !child.classList.contains("resize-handle")
  ) as HTMLElement | undefined;

  if (firstChild) {
    const nodeTools = (window as Window & { nodeTools?: NodeTools }).nodeTools;
    if (nodeTools?.selectNode) {
      nodeTools.selectNode(firstChild);
    }
  }
};

