import { connectResizeObserver } from "../helpers/observer/connectResizeObserver";
import { withRAFThrottle } from "../helpers/withRAF";
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

  // Combined throttled function for refresh + visibility update
  const throttledRefreshAndVisibility = withRAFThrottle((node: HTMLElement, nodeProvider: HTMLElement) => {
    refreshHighlightFrame(node, nodeProvider);
    updateHighlightFrameVisibility(node);
  });

  const handleEscape = (): void => {
    if (text.isEditing()) {
      text.blurEditMode();
    }

    if (selectedNode) {
      if (nodeProvider) {
        clearHighlightFrame();
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

      mutationObserver = new MutationObserver(() => {
        throttledRefreshAndVisibility(node, nodeProvider);
      });

      mutationObserver.observe(node, {
        attributes: true,
        characterData: true,
      });

      resizeObserver = connectResizeObserver(node, () => {
        throttledRefreshAndVisibility(node, nodeProvider);
      });
    }

    selectedNode = node;
    sendPostMessage("selectedNodeChanged", node?.getAttribute("data-node-id") ?? null);
    highlightNode(node) ?? null;

    if (node && nodeProvider) {
      updateHighlightFrameVisibility(node);
    }
  };

  // Setup event listener
  const removeListeners = setupEventListener(nodeProvider, selectNode, handleEscape, text.getEditableNode);

  const cleanup = (): void => {
    removeListeners();
    resizeObserver?.disconnect();
    mutationObserver?.disconnect();

    text.blurEditMode();
    throttledRefreshAndVisibility.cleanup();
  };

  const nodeTools: NodeTools = {
    selectNode,
    getSelectedNode: () => selectedNode,
    refreshHighlightFrame: () => {
      if (selectedNode && nodeProvider) {
        // Call directly (not throttled) since this is typically called from already-throttled contexts
        // to avoid double RAF
        refreshHighlightFrame(selectedNode, nodeProvider);
        updateHighlightFrameVisibility(selectedNode);
      }
    },
    clearSelectedNode: () => {
      clearHighlightFrame();
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
