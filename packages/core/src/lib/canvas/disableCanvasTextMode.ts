import { getCanvasWindowValue } from "@/lib/canvas/helpers/getCanvasWindowValue";

export const disableCanvasTextMode = (canvasName: string = "canvas") => {
  const disableTextEditMode = getCanvasWindowValue(["keyboard", "disableTextEditMode"], canvasName);

  disableTextEditMode?.();
};
