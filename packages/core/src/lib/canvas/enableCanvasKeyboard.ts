import { getCanvasWindowValue } from "@/lib/canvas/helpers/getCanvasWindowValue";

export const enableCanvasKeyboard = (canvasName: string = "canvas") => {
  const enable = getCanvasWindowValue(["keyboard", "enable"], canvasName) as (() => void) | undefined;

  enable?.();
};
