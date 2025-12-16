// Global flag to prevent refreshViewportLabels during drag
let globalIsDragging = false;

export const isViewportLabelDragging = (): boolean => globalIsDragging;

export const setViewportLabelDragging = (isDragging: boolean): void => {
  globalIsDragging = isDragging;
};

