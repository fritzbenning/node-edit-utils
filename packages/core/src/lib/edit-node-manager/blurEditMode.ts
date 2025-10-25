import { enableCanvasKeyboard } from "./enableCanvasKeyboard";
import { setNodeNonEditable } from "./setNodeNonEditable";

export interface BlurEditModeState {
  editableNode: HTMLElement | null;
  blurHandler: (() => void) | null;
  mutationCleanup: (() => void) | null;
  keydownCleanup: (() => void) | null;
  originalContent: string | null;
  onBlurCallback: (() => void) | null;
  isBlurring: boolean;
}

export const blurEditMode = (state: BlurEditModeState): void => {
  // Prevent double-blur
  if (state.isBlurring || !state.editableNode) {
    return;
  }

  state.isBlurring = true;
  const node = state.editableNode;

  // Restore node state
  setNodeNonEditable(node);
  enableCanvasKeyboard();

  // Cleanup blur event listener
  if (state.blurHandler) {
    node.removeEventListener("blur", state.blurHandler);
    state.blurHandler = null;
  }

  // Cleanup mutation observer
  state.mutationCleanup?.();
  state.mutationCleanup = null;

  // Cleanup keydown handler
  state.keydownCleanup?.();
  state.keydownCleanup = null;

  // Clear original content
  state.originalContent = null;

  // Call blur callback
  const callback = state.onBlurCallback;

  // Clear state before calling callback
  state.editableNode = null;
  state.onBlurCallback = null;
  state.isBlurring = false;

  // Call callback last (in case it triggers other operations)
  callback?.();
};
