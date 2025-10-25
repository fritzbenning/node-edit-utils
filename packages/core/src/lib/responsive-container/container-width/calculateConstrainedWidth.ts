import { RESIZE_CONFIG } from "../constants";

export const calculateConstrainedWidth = (startWidth: number, deltaX: number): number => {
  const newWidth = startWidth + Math.round(deltaX * 1.5);
  return Math.max(RESIZE_CONFIG.minWidth, Math.min(RESIZE_CONFIG.maxWidth, newWidth));
};
