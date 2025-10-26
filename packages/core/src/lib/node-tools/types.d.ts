export interface NodeTools {
  selectNode(node: HTMLElement | null): void;
  getSelectedNode(): HTMLElement | null;
  getEditableNode(): HTMLElement | null;
  refreshHighlightFrame(): void;
  clearSelectedNode(): void;
  cleanup(): void;
}
