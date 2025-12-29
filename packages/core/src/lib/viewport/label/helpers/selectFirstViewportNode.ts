import { getNodeTools } from "../../../helpers/getNodeTools";

/**
 * Selects the first child node inside a viewport element.
 * Skips the resize-handle element if present.
 */
export const selectFirstViewportNode = (viewportElement: HTMLElement): void => {
  const firstChild = Array.from(viewportElement.children).find((child) => !child.classList.contains("resize-handle")) as
    | HTMLElement
    | undefined;

  if (firstChild) {
    const nodeTools = getNodeTools();
    if (nodeTools?.selectNode) {
      nodeTools.selectNode(firstChild);
    }
  }
};
