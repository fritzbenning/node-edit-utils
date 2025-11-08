import { isLocked } from "../node-tools/select/helpers/isLocked";

export const processPostMessage = (event: MessageEvent, onNodeSelected?: (node: HTMLElement | null) => void) => {
  // if (event.data.source === "markup-canvas" && event.data.canvasName === "canvas") {
  //   if (event.data.action === "zoom") {
  //     // Zoom handling can be implemented here if needed
  //   }
  // }

  if (event.data.source === "application") {
    if (event.data.action === "selectedNodeChanged") {
      const nodeId = event.data.data;
      const selectedNode = document.querySelector(`[data-node-id="${nodeId}"]`) as HTMLElement | null;

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
