import { getCanvasWindowValue } from "@/lib/canvas/helpers/getCanvasWindowValue";

export const disableCanvasTextMode = () => {
  const disableTextEditMode = getCanvasWindowValue(["keyboard", "disableTextEditMode"]);

  disableTextEditMode?.();
};
