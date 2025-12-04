import { IGNORED_DOM_ELEMENTS } from "../../select/constants";
import { getElementsFromPoint } from "../../select/helpers/getElementsFromPoint";
import { isInsideComponent } from "../../select/helpers/isInsideComponent";
import { enterTextEditMode } from "../../text/helpers/enterTextEditMode";
import { shouldEnterTextEditMode } from "../../text/helpers/shouldEnterTextEditMode";
import type { NodeText } from "../../text/types";

export const handleNodeDoubleClick = (
  event: MouseEvent,
  nodeProvider: HTMLElement | null,
  selectedNode: HTMLElement | null,
  text: NodeText
): void => {
  event.preventDefault();
  event.stopPropagation();

  if (!nodeProvider || !nodeProvider.contains(event.target as Node)) {
    return;
  }

  if (!selectedNode) {
    return;
  }

  // Verify that the double-clicked element is related to the selected node
  const clickX = event.clientX;
  const clickY = event.clientY;
  const candidates = getElementsFromPoint(clickX, clickY).filter(
    (element) =>
      !IGNORED_DOM_ELEMENTS.includes(element.tagName.toLowerCase()) &&
      !element.classList.contains("select-none") &&
      !isInsideComponent(element)
  );

  // Check if the selected node or any of its children was clicked
  const clickedOnSelectedNode = candidates.some(
    (element) => selectedNode === element || selectedNode.contains(element) || element.contains(selectedNode)
  );

  if (!clickedOnSelectedNode) {
    return;
  }

  if (!shouldEnterTextEditMode(selectedNode)) {
    return;
  }

  enterTextEditMode(selectedNode, nodeProvider, text);
};
