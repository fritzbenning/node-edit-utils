import type { BlurEditModeState } from "./blurEditMode";
import { blurEditMode as createBlurEditMode } from "./blurEditMode";
import { enableEditMode as createEnableEditMode } from "./enableEditMode";
import { getCurrentEditableNode as createGetCurrentEditableNode } from "./getCurrentEditableNode";
import { isEditing as createIsEditing } from "./isEditing";
import type { EditModeManager } from "./types";

export const createEditModeManager = (): EditModeManager => {
  const state: BlurEditModeState = {
    currentEditableNode: null,
    blurHandler: null,
    mutationCleanup: null,
    onBlurCallback: null,
    isBlurring: false,
  };

  const blurEditMode = createBlurEditMode(state);
  const enableEditMode = createEnableEditMode(state, blurEditMode);
  const getCurrentEditableNode = createGetCurrentEditableNode(state);
  const isEditing = createIsEditing(state);

  return {
    enableEditMode,
    blurEditMode,
    getCurrentEditableNode,
    isEditing,
  };
};
