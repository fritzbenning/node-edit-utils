import type { BlurEditModeState } from "./blurEditMode";

export const getCurrentEditableNode = (state: BlurEditModeState) => {
  return (): HTMLElement | null => {
    return state.currentEditableNode;
  };
};

