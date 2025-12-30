import { getNodeTools } from "../../../helpers/getNodeTools";
import { sendPostMessage } from "../../../post-message/sendPostMessage";

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
      const wasAlreadySelected = nodeTools.getSelectedNode() === firstChild;
      nodeTools.selectNode(firstChild);

      // Always emit postMessage when selecting via viewport label click,
      // even if the node was already selected (to match behavior of direct node clicks)
      if (wasAlreadySelected) {
        sendPostMessage("selectedNodeChanged", firstChild.getAttribute("data-node-id") ?? null);
      }
    }
  }
};
