import { getCanvasWindowValue } from "@/lib/canvas/helpers/getCanvasWindowValue";

export const enableCanvasTextMode = () => {
  const enableTextEditMode = getCanvasWindowValue(["keyboard", "enableTextEditMode"]);

  enableTextEditMode?.();
};
