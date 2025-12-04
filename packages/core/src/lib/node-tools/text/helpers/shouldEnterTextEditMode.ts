import { hasTextContent } from "./hasTextContent";

export const shouldEnterTextEditMode = (node: HTMLElement | null): boolean => {
  if (!node) {
    return false;
  }

  return hasTextContent(node);
};
