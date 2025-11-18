import { isLocked } from "../node-tools/select/helpers/isLocked";

export const processPostMessage = (event: MessageEvent, onNodeSelected?: (node: HTMLElement | null) => void) => {
  if (event.data.source === "application") {
    if (event.data.action === "selectedNodeChanged") {
      const nodeId = event.data.data;
      const selectedNode = document.querySelector(`[data-node-id="${nodeId}"]`) as HTMLElement | null;

      console.log("selectedNode", selectedNode);

      if (isLocked(selectedNode)) {
        onNodeSelected?.(null);
        return;
      }

      if (selectedNode) {
        onNodeSelected?.(selectedNode);
      }
    }
  }
};
