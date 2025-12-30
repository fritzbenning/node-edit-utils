// Global flag to prevent refreshViewportLabels during drag
let globalIsDragging = false;

export const isViewportDragging = (): boolean => globalIsDragging;

export const setViewportDragging = (isDragging: boolean): void => {
  globalIsDragging = isDragging;
};

