import { getCanvasWindowValue } from "@/lib/canvas/helpers/getCanvasWindowValue";

export const enableCanvasKeyboard = () => {
  const enable = getCanvasWindowValue(["keyboard", "enable"]);

  enable?.();
};
