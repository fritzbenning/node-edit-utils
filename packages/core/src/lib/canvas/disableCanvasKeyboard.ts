import { getCanvasWindowValue } from "@/lib/canvas/helpers/getCanvasWindowValue";

export const disableCanvasKeyboard = () => {
  const disable = getCanvasWindowValue(["keyboard", "disable"]);

  disable?.();
};
