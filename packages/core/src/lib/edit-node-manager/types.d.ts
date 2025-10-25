export interface EditModeManager {
  edit: (
    node: HTMLElement,
    nodeProvider: HTMLElement | null,
    onEditEnabled?: (node: HTMLElement) => void,
    onEditBlurred?: () => void
  ) => () => void;
  blur: () => void;
  getEditableNode: () => HTMLElement | null;
  isEditing: () => boolean;
}
