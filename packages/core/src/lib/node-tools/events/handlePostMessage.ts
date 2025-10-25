export const handlePostMessage = (event: MessageEvent) => {
  if (event.data.source === "markup-canvas" && event.data.canvasName === "canvas") {
    if (event.data.action === "zoom") {
      const zoom = event.data.data;
      // (window as any).nodeEditUtils?.updateHighlightFrameBorder(zoom);
    }
  }
};
