export interface EditModeManager {
  enableEditMode: (
    node: HTMLElement,
    nodeProvider: HTMLElement | null,
    onEditEnabled?: (node: HTMLElement) => void,
    onEditBlurred?: () => void
  ) => () => void;
  blurEditMode: () => void;
  getCurrentEditableNode: () => HTMLElement | null;
  isEditing: () => boolean;
}
