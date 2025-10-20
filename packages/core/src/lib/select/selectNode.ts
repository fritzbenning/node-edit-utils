import { getElementsFromPoint } from "./helpers/getElementsFromPoint";
import { targetSameCandidates } from "./helpers/targetSameCandidates";

let candidateCache: Element[] = [];
let attempt = 0;

export const selectNode = (event: MouseEvent): HTMLElement | null => {
  let selectedNode: HTMLElement | null = null;

  const clickX = event.clientX;
  const clickY = event.clientY;

  const clickThrough = event.metaKey || event.ctrlKey;

  const candidates = getElementsFromPoint(clickX, clickY);

  if (clickThrough) {
    candidateCache = [];

    selectedNode = candidates[0] as HTMLElement;
    return selectedNode;
  }

  if (targetSameCandidates(candidateCache, candidates)) {
    attempt <= candidates.length && attempt++;
  } else {
    attempt = 0;
  }

  const nodeIndex = candidates.length - 1 - attempt;

  selectedNode = candidates[nodeIndex] as HTMLElement;

  candidateCache = candidates;

  return selectedNode;
};
