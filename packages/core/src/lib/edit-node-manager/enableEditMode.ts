import type { BlurEditModeState } from "./blurEditMode";
import { disableCanvasKeyboard } from "./disableCanvasKeyboard";
import { hasTextContent } from "./hasTextContent";
import { saveOriginalContent } from "./saveOriginalContent";
import { setNodeEditable } from "./setNodeEditable";
import { setupKeydownHandler } from "./setupKeydownHandler";
import { setupMutationObserver } from "./setupMutationObserver";

export const enableEditMode = (
  state: BlurEditModeState,
  blur: () => void,
  node: HTMLElement,
  nodeProvider: HTMLElement | null,
  onEditEnabled?: (node: HTMLElement) => void,
  onEditBlurred?: () => void
): (() => void) => {
  // If already editing another node, blur it first
  if (state.editableNode && state.editableNode !== node) {
    blur();
  }

  // Check if node has text content
  if (!hasTextContent(node)) {
    return () => {};
  }

  // Store references
  state.editableNode = node;
  state.onBlurCallback = onEditBlurred || null;

  // Save original content before editing
  state.originalContent = saveOriginalContent(node);

  // Enable contentEditable
  setNodeEditable(node);
  disableCanvasKeyboard();

  // Call enabled callback
  onEditEnabled?.(node);

  // Setup blur handler
  state.blurHandler = () => blur();
  node.addEventListener("blur", state.blurHandler);

  state.keydownCleanup = setupKeydownHandler(node, blur);

  // Setup mutation observer for highlight frame updates
  if (nodeProvider) {
    state.mutationCleanup = setupMutationObserver(node, nodeProvider);
  }

  // Return cleanup function
  return () => blur();
};
