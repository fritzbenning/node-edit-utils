export const getLabelPosition = (labelGroup: SVGGElement): { x: number; y: number } => {
  const transform = labelGroup.getAttribute("transform");
  const match = transform?.match(/translate\((-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)\)/);
  if (match) {
    return { x: parseFloat(match[1]), y: parseFloat(match[2]) };
  }
  return { x: 0, y: 0 };
};
