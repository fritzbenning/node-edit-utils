import { getCanvasWindowValue } from "@/lib/canvas/helpers/getCanvasWindowValue";

export const enableCanvasTextMode = (canvasName: string = "canvas") => {
  const enableTextEditMode = getCanvasWindowValue(["keyboard", "enableTextEditMode"], canvasName);

  enableTextEditMode?.();
};
