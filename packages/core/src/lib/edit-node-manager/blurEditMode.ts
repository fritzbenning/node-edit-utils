import { enableCanvasKeyboard } from "./enableCanvasKeyboard";
import { setNodeNonEditable } from "./setNodeNonEditable";

export interface BlurEditModeState {
  currentEditableNode: HTMLElement | null;
  blurHandler: (() => void) | null;
  mutationCleanup: (() => void) | null;
  onBlurCallback: (() => void) | null;
  isBlurring: boolean;
}

export const blurEditMode = (state: BlurEditModeState): void => {
  // Prevent double-blur
  if (state.isBlurring || !state.currentEditableNode) {
    return;
  }

  state.isBlurring = true;
  const node = state.currentEditableNode;

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

  // Call blur callback
  const callback = state.onBlurCallback;

  // Clear state before calling callback
  state.currentEditableNode = null;
  state.onBlurCallback = null;
  state.isBlurring = false;

  // Call callback last (in case it triggers other operations)
  callback?.();
};
