import { clearHighlightFrame } from "../../highlight/clearHighlightFrame";
import { selectNode } from "../../select/selectNode";

export const handleNodeClick = (
  event: MouseEvent,
  nodeProvider: HTMLElement | null,
  editableNode: HTMLElement | null,
  onNodeSelected: (node: HTMLElement | null) => void
): void => {
  event.preventDefault();
  event.stopPropagation();

  if (nodeProvider && !nodeProvider.contains(event.target as Node)) {
    clearHighlightFrame(nodeProvider);
    onNodeSelected(null);
    return;
  }

  const selectedNode = selectNode(event, editableNode);
  onNodeSelected(selectedNode);
};
