import { getCanvasWindowValue } from "@/lib/canvas/helpers/getCanvasWindowValue";

export const disableCanvasKeyboard = (canvasName: string = "canvas") => {
  const disable = getCanvasWindowValue(["keyboard", "disable"], canvasName) as (() => void) | undefined;

  disable?.();
};
