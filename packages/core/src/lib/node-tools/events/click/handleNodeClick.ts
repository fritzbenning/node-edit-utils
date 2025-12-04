import { clearHighlightFrame } from "../../highlight/clearHighlightFrame";
import { selectNode } from "../../select/selectNode";
import type { NodeText } from "../../text/types";

export const handleNodeClick = (
  event: MouseEvent,
  nodeProvider: HTMLElement | null,
  editableNode: HTMLElement | null,
  text: NodeText,
  onNodeSelected: (node: HTMLElement | null) => void
): void => {
  event.preventDefault();
  event.stopPropagation();

  if (nodeProvider && !nodeProvider.contains(event.target as Node)) {
    clearHighlightFrame();
    onNodeSelected(null);
    return;
  }

  const selectedNode = selectNode(event, nodeProvider, editableNode, text);
  onNodeSelected(selectedNode);
};
