import type { BlurEditModeState } from "./blurEditMode";

export const isEditing = (state: BlurEditModeState) => {
  return (): boolean => {
    return state.currentEditableNode !== null;
  };
};

