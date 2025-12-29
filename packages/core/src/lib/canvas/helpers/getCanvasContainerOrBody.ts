import { getCanvasContainer } from "./getCanvasContainer";

export const getCanvasContainerOrBody = (): HTMLElement => {
  return getCanvasContainer() || document.body;
};

