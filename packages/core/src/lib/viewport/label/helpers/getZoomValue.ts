export const getZoomValue = (): number => {
  const zoomValue = getComputedStyle(document.body).getPropertyValue("--zoom").trim();
  return zoomValue ? parseFloat(zoomValue) : 1;
};
