import { disableCanvasTextMode } from "@/lib/canvas/disableCanvasTextMode";
import { enableCanvasTextMode } from "@/lib/canvas/enableCanvasTextMode";
import { setupNodeListeners } from "./events/setupNodeListeners";
import { handleTextChange } from "./helpers/handleTextChange";
import { hasTextContent } from "./helpers/hasTextContent";
import { makeNodeEditable } from "./helpers/makeNodeEditable";
import { makeNodeNonEditable } from "./helpers/makeNodeNonEditable";
import type { NodeText } from "./types";

export const nodeText = (canvasName: string = "canvas"): NodeText => {
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
      enableCanvasTextMode(canvasName);

      cleanup = setupNodeListeners(node, nodeProvider, blurEditMode, canvasName);
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

    // Send final textContentChanged message before cleanup
    handleTextChange(nodeToCleanup, [], true);

    makeNodeNonEditable(nodeToCleanup);
    disableCanvasTextMode(canvasName);
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
