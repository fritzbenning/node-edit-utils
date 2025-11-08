import { disableCanvasTextMode } from "../../canvas/disableCanvasTextMode";
import { enableCanvasTextMode } from "../../canvas/enableCanvasTextMode";
import { setupNodeListeners } from "./events/setupNodeListeners";
import { hasTextContent } from "./helpers/hasTextContent";
import { makeNodeEditable } from "./helpers/makeNodeEditable";
import { makeNodeNonEditable } from "./helpers/makeNodeNonEditable";
import type { NodeText } from "./types";

export const nodeText = (): NodeText => {
  let editableNode: HTMLElement | null = null;
  let blurInProgress: boolean = false;
  let cleanup: (() => void) | null = null;

  const enableEditMode = (node: HTMLElement, nodeProvider: HTMLElement | null) => {
    if (editableNode === node) {
      return;
    }

    if (editableNode && editableNode !== node) {
      blurEditMode();
    }

    const editable = hasTextContent(node);

    if (editable) {
      editableNode = node;

      makeNodeEditable(node);
      enableCanvasTextMode();

      cleanup = setupNodeListeners(node, nodeProvider, blurEditMode);
    }
  };

  const getEditableNode = () => {
    return editableNode;
  };

  const isEditing = () => {
    return editableNode !== null;
  };

  const blurEditMode = () => {
    if (blurInProgress || !editableNode) {
      return;
    }

    blurInProgress = true;

    const nodeToCleanup = editableNode;

    makeNodeNonEditable(nodeToCleanup);
    disableCanvasTextMode();
    cleanup?.();

    editableNode = null;
    blurInProgress = false;
  };

  return {
    enableEditMode,
    blurEditMode,
    getEditableNode,
    isEditing,
  };
};
