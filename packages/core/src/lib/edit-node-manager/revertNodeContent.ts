/**
 * Reverts a node's content to its original saved state
 */
export const revertNodeContent = (node: HTMLElement, originalContent: string): void => {
  node.textContent = originalContent;
};
