export interface NodeText {
  enableEditMode: (node: HTMLElement, nodeProvider: HTMLElement | null) => void;
  blurEditMode: () => void;
  getEditableNode: () => HTMLElement | null;
  isEditing: () => boolean;
}
