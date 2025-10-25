import type { BlurEditModeState } from "./blurEditMode";
import { blurEditMode } from "./blurEditMode";
import { enableEditMode } from "./enableEditMode";
import type { EditModeManager } from "./types";

export const createEditModeManager = (): EditModeManager => {
  const state: BlurEditModeState = {
    currentEditableNode: null,
    blurHandler: null,
    mutationCleanup: null,
    onBlurCallback: null,
    isBlurring: false,
  };

  const edit = (
    node: HTMLElement,
    nodeProvider: HTMLElement | null,
    onEditEnabled?: (node: HTMLElement) => void,
    onEditBlurred?: () => void
  ) => {
    return enableEditMode(state, blur, node, nodeProvider, onEditEnabled, onEditBlurred);
  };

  const getCurrentEditableNode = () => {
    return state.currentEditableNode;
  };

  const isEditing = () => {
    return state.currentEditableNode !== null;
  };

  const blur = () => {
    blurEditMode(state);
  };

  return {
    edit,
    blur,
    getCurrentEditableNode,
    isEditing,
  };
};
