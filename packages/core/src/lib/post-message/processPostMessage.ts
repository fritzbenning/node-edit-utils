export const processPostMessage = (event: MessageEvent, onNodeSelected?: (node: HTMLElement | null) => void) => {
  if (event.data.source === "markup-canvas" && event.data.canvasName === "canvas") {
    if (event.data.action === "zoom") {
      const zoom = event.data.data;
      console.log("zoom", zoom);
    }
  }

  if (event.data.source === "application") {
    if (event.data.action === "selectedNodeChanged") {
      const nodeId = event.data.data;
      console.log("selectedNodeChanged in node-edit-utils", nodeId);
      const selectedNode = document.querySelector(`[data-node-id="${nodeId}"]`);

      if (selectedNode) {
        console.log("selectedNode", selectedNode);
        onNodeSelected?.(selectedNode as HTMLElement);
      }
    }
  }
};
