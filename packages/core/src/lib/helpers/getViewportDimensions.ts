export const getViewportDimensions = (): { width: number; height: number } => {
  return {
    width: document.documentElement.clientWidth || window.innerWidth,
    height: document.documentElement.clientHeight || window.innerHeight,
  };
};

