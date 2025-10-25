import type { BlurEditModeState } from "./blurEditMode";
import { blurEditMode } from "./blurEditMode";
import { enableEditMode } from "./enableEditMode";
import type { EditModeManager } from "./types";

export const createEditTextManager = (): EditModeManager => {
  const state: BlurEditModeState = {
    editableNode: null,
    originalContent: null,
    isBlurring: false,
    onBlurCallback: null,
    blurHandler: null,
    mutationCleanup: null,
    keydownCleanup: null,
  };

  const edit = (
    node: HTMLElement,
    nodeProvider: HTMLElement | null,
    onEditEnabled?: (node: HTMLElement) => void,
    onEditBlurred?: () => void
  ) => {
    return enableEditMode(state, blur, node, nodeProvider, onEditEnabled, onEditBlurred);
  };

  const getEditableNode = () => {
    return state.editableNode;
  };

  const isEditing = () => {
    return state.editableNode !== null;
  };

  const blur = () => {
    blurEditMode(state);
  };

  return {
    edit,
    blur,
    getEditableNode,
    isEditing,
  };
};
