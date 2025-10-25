/**
 * Saves the original content of a node before entering edit mode
 * This allows reverting changes if needed
 */
export const saveOriginalContent = (node: HTMLElement): string => {
  return node.textContent || "";
};
