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

export const createNodeTools = (element: HTMLElement | null, canvasName: string = "canvas"): NodeTools => {
  const nodeProvider = element;

  let resizeObserver: ResizeObserver | null = null;
  let mutationObserver: MutationObserver | null = null;
  let parentMutationObserver: MutationObserver | null = null;
  let selectedNode: HTMLElement | null = null;

  const text = nodeText(canvasName);

  // Combined throttled function for refresh + visibility update
  const throttledRefreshAndVisibility = withRAFThrottle((node: HTMLElement, nodeProvider: HTMLElement) => {
    refreshHighlightFrame(node, nodeProvider, canvasName);
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
        parentMutationObserver?.disconnect();
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
    parentMutationObserver?.disconnect();

    if (node && nodeProvider) {
      // Check if node is still in DOM and handle cleanup if removed
      const checkNodeExists = (): void => {
        if (!document.contains(node)) {
          // Node was removed from DOM, clear highlight and cleanup
          clearHighlightFrame();
          selectedNode = null;
          resizeObserver?.disconnect();
          mutationObserver?.disconnect();
          parentMutationObserver?.disconnect();
          sendPostMessage("selectedNodeChanged", null);
          return;
        }
      };

      mutationObserver = new MutationObserver(() => {
        checkNodeExists();
        if (!document.contains(node)) return; // Exit early if node was removed

        // throttledRefreshAndVisibility(node, nodeProvider);
        console.log("mutationObserver", node);
        refreshHighlightFrame(node, nodeProvider, canvasName);
        updateHighlightFrameVisibility(node);
      });

      mutationObserver.observe(node, {
        attributes: true,
        characterData: true,
        childList: true,
        subtree: true,
      });

      // Also observe parent node to catch when this node is removed
      const parentNode = node.parentElement;
      if (parentNode) {
        parentMutationObserver = new MutationObserver((mutations) => {
          // Check if the selected node was removed
          for (const mutation of mutations) {
            if (mutation.type === "childList") {
              for (const removedNode of Array.from(mutation.removedNodes)) {
                // Check if the removed node is the selected node, or if the selected node is contained within the removed subtree
                if (removedNode === node || (removedNode instanceof Node && removedNode.contains(node))) {
                  checkNodeExists();
                  return;
                }
              }
            }
          }
        });

        parentMutationObserver.observe(parentNode, {
          childList: true,
          subtree: false, // Only direct children to avoid too many callbacks
        });
      }

      resizeObserver = connectResizeObserver(node, () => {
        checkNodeExists();
        if (!document.contains(node)) return; // Exit early if node was removed

        // throttledRefreshAndVisibility(node, nodeProvider);
        console.log("resizeObserver", node);
        refreshHighlightFrame(node, nodeProvider, canvasName);
        updateHighlightFrameVisibility(node);
      });
    }

    selectedNode = node;
    sendPostMessage("selectedNodeChanged", node?.getAttribute("data-node-id") ?? null);
    highlightNode(node) ?? null;

    if (node && nodeProvider) {
      updateHighlightFrameVisibility(node);
      updateHighlightFrameVisibility(node);
    }
  };

  // Setup event listener
  const removeListeners = setupEventListener(nodeProvider, selectNode, handleEscape, text.getEditableNode, () => selectedNode, text);

  const cleanup = (): void => {
    removeListeners();
    resizeObserver?.disconnect();
    mutationObserver?.disconnect();
    parentMutationObserver?.disconnect();

    text.blurEditMode();
    throttledRefreshAndVisibility.cleanup();

    // Clear highlight frame and reset selected node
    clearHighlightFrame();
    selectedNode = null;
    sendPostMessage("selectedNodeChanged", null);
  };

  const nodeTools: NodeTools = {
    selectNode,
    getSelectedNode: () => selectedNode,
    refreshHighlightFrame: () => {
      if (selectedNode && nodeProvider) {
        refreshHighlightFrame(selectedNode, nodeProvider, canvasName);
        updateHighlightFrameVisibility(selectedNode);
      }
    },
    clearSelectedNode: () => {
      clearHighlightFrame();
      selectedNode = null;
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
      parentMutationObserver?.disconnect();
    },
    getEditableNode: () => text.getEditableNode(),
    cleanup,
  };

  bindToWindow("nodeTools", nodeTools);

  return nodeTools;
};
