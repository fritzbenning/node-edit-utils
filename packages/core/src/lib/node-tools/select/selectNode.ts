import { enterTextEditMode } from "../text/helpers/enterTextEditMode";
import type { NodeText } from "../text/types";
import { IGNORED_DOM_ELEMENTS } from "./constants";
import { getElementsFromPoint } from "./helpers/getElementsFromPoint";
import { isInsideComponent } from "./helpers/isInsideComponent";
import { targetSameCandidates } from "./helpers/targetSameCandidates";

let candidateCache: Element[] = [];
let attempt = 0;

let lastSelectedNode: HTMLElement | null = null;

export const selectNode = (
  event: MouseEvent,
  nodeProvider: HTMLElement | null,
  editableNode: HTMLElement | null,
  text: NodeText
): HTMLElement | null => {
  let selectedNode: HTMLElement | null = null;

  const clickX = event.clientX;
  const clickY = event.clientY;

  const clickThrough = event.metaKey || event.ctrlKey;

  const candidates = getElementsFromPoint(clickX, clickY).filter(
    (element) =>
      !IGNORED_DOM_ELEMENTS.includes(element.tagName.toLowerCase()) &&
      !element.classList.contains("select-none") &&
      !isInsideComponent(element)
  );

  if (editableNode && candidates.includes(editableNode)) {
    return editableNode;
  }

  if (clickThrough) {
    candidateCache = [];
    selectedNode = candidates[0] as HTMLElement;

    if (lastSelectedNode && lastSelectedNode === selectedNode) {
      enterTextEditMode(selectedNode, nodeProvider, text);
    }

    lastSelectedNode = selectedNode;

    return selectedNode;
  }

  if (targetSameCandidates(candidateCache, candidates)) {
    attempt <= candidates.length - 2 && attempt++;
  } else {
    attempt = 0;
  }

  const nodeIndex = candidates.length - 1 - attempt;

  selectedNode = candidates[nodeIndex] as HTMLElement;
  candidateCache = candidates;

  if (lastSelectedNode && lastSelectedNode === selectedNode) {
    enterTextEditMode(selectedNode, nodeProvider, text);
  }

  lastSelectedNode = selectedNode;

  return selectedNode;
};
