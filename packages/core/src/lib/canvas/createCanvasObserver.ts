import { refreshViewportLabels } from "../viewport/label/refreshViewportLabels";
import { applyCanvasState } from "./helpers/applyCanvasState";
import type { CanvasObserver } from "./types";

export function createCanvasObserver(canvasName: string = "canvas"): CanvasObserver {
  const transformLayer = document.querySelector(".transform-layer");

  if (!transformLayer) {
    return {
      disconnect: () => {},
    };
  }

  const observer = new MutationObserver(() => {
    applyCanvasState(canvasName);

    // Refresh highlight frame (throttled via withRAFThrottle)
    // biome-ignore lint/suspicious/noExplicitAny: global window extension
    const nodeTools = (window as any).nodeTools;

    if (nodeTools?.refreshHighlightFrame) {
      nodeTools.refreshHighlightFrame();
    }

    // Refresh viewport labels
    refreshViewportLabels();
  });

  observer.observe(transformLayer, {
    attributes: true,
    attributeOldValue: true,
    subtree: true,
    childList: true,
  });

  // Handle window resize for viewport labels
  const handleResize = (): void => {
    refreshViewportLabels();
  };
  window.addEventListener("resize", handleResize);

  // Initial refresh of viewport labels
  refreshViewportLabels();

  function disconnect(): void {
    observer.disconnect();
    window.removeEventListener("resize", handleResize);
  }

  return {
    disconnect,
  };
}
