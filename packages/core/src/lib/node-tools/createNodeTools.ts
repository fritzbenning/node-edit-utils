import { withRAFThrottle } from "../helpers";
import { connectResizeObserver } from "../helpers/observer/connectResizeObserver";
import { sendPostMessage } from "../post-message/sendPostMessage";
import { bindToWindow } from "../window/bindToWindow";
import { setupEventListener } from "./events/setupEventListener";
import { clearHighlightFrame } from "./highlight/clearHighlightFrame";
import { highlightNode } from "./highlight/highlightNode";
import { refreshHighlightFrame } from "./highlight/refreshHighlightFrame";
import { updateHighlightFrameVisibility } from "./highlight/updateHighlightFrameVisibility";
import { nodeText } from "./text/nodeText";
import type { NodeTools } from "./types";

export const createNodeTools = (element: HTMLElement | null): NodeTools => {
  const nodeProvider = element;

  let resizeObserver: ResizeObserver | null = null;
  let mutationObserver: MutationObserver | null = null;
  let selectedNode: HTMLElement | null = null;

  const text = nodeText();
  const throttledFrameRefresh = withRAFThrottle(refreshHighlightFrame);

  const handleEscape = (): void => {
    if (text.isEditing()) {
      text.blurEditMode();
    }

    if (selectedNode) {
      if (nodeProvider) {
        clearHighlightFrame(nodeProvider);
        selectedNode = null;

        resizeObserver?.disconnect();
        mutationObserver?.disconnect();
      }
    }
  };

  const selectNode = (node: HTMLElement | null): void => {
    if (selectedNode === node) {
      return;
    }

    selectedNode = node;

    if (text.isEditing()) {
      const currentEditable = text.getEditableNode();
      if (currentEditable && currentEditable !== node) {
        text.blurEditMode();
      }
    }

    resizeObserver?.disconnect();
    mutationObserver?.disconnect();

    if (node && nodeProvider) {
      text.enableEditMode(node, nodeProvider);

      resizeObserver = connectResizeObserver(nodeProvider, () => {
        throttledFrameRefresh(node, nodeProvider);
      });

      mutationObserver = new MutationObserver(() => {
        throttledFrameRefresh(node, nodeProvider);
        updateHighlightFrameVisibility(node, nodeProvider);
      });

      mutationObserver.observe(node, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }

    sendPostMessage("selectedNodeChanged", node?.getAttribute("data-node-id") ?? null);
    highlightNode(node, nodeProvider as HTMLElement) ?? null;

    if (node && nodeProvider) {
      updateHighlightFrameVisibility(node, nodeProvider);
    }
  };

  // Setup event listener
  const removeListeners = setupEventListener(nodeProvider, selectNode, handleEscape, text.getEditableNode);

  const cleanup = (): void => {
    removeListeners();
    resizeObserver?.disconnect();
    mutationObserver?.disconnect();

    text.blurEditMode();
    throttledFrameRefresh.cleanup();
  };

  const nodeTools: NodeTools = {
    selectNode,
    getSelectedNode: () => selectedNode,
    refreshHighlightFrame: () => {
      throttledFrameRefresh(selectedNode as HTMLElement, nodeProvider as HTMLElement);
    },
    clearSelectedNode: () => {
      clearHighlightFrame(nodeProvider);
      selectedNode = null;
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
    },
    getEditableNode: () => text.getEditableNode(),
    cleanup,
  };

  bindToWindow("nodeTools", nodeTools);

  return nodeTools;
};
