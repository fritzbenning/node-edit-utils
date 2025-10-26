export const hasTextContent = (node: HTMLElement): boolean => {
  return Array.from(node.childNodes).some((child) => child.nodeType === Node.TEXT_NODE && child.textContent?.trim());
};
