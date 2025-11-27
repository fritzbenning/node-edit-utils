import { getCanvasWindowValue } from "./getCanvasWindowValue";

export const applyCanvasState = (canvasName: string = "canvas") => {
  const zoom: number = getCanvasWindowValue(["zoom", "current"], canvasName) ?? 1;

  document.body.style.setProperty("--zoom", zoom.toFixed(5));
  document.body.style.setProperty("--stroke-width", (2 / zoom).toFixed(3));

  document.body.dataset.zoom = zoom.toFixed(5);
  document.body.dataset.strokeWidth = (2 / zoom).toFixed(3);
};
