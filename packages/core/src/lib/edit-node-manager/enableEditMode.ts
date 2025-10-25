import type { BlurEditModeState } from "./blurEditMode";
import { disableCanvasKeyboard } from "./disableCanvasKeyboard";
import { hasTextContent } from "./hasTextContent";
import { setNodeEditable } from "./setNodeEditable";
import { setupMutationObserver } from "./setupMutationObserver";

export const enableEditMode = (
  state: BlurEditModeState,
  blurEditModeFn: () => void,
  node: HTMLElement,
  nodeProvider: HTMLElement | null,
  onEditEnabled?: (node: HTMLElement) => void,
  onEditBlurred?: () => void
): (() => void) => {
  // If already editing another node, blur it first
  if (state.currentEditableNode && state.currentEditableNode !== node) {
    blurEditModeFn();
  }

  // Check if node has text content
  if (!hasTextContent(node)) {
    return () => {};
  }

  // Store references
  state.currentEditableNode = node;
  state.onBlurCallback = onEditBlurred || null;

  // Enable contentEditable
  setNodeEditable(node);
  disableCanvasKeyboard();

  // Call enabled callback
  onEditEnabled?.(node);

  // Setup blur handler
  state.blurHandler = () => blurEditModeFn();
  node.addEventListener("blur", state.blurHandler);

  // Setup mutation observer for highlight frame updates
  if (nodeProvider) {
    state.mutationCleanup = setupMutationObserver(node, nodeProvider);
  }

  // Return cleanup function
  return () => blurEditModeFn();
};
