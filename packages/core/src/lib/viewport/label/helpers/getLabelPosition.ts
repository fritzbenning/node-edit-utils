import { parseTransform2d } from "../../../helpers/parseTransform";

export const getLabelPosition = (labelGroup: SVGGElement): { x: number; y: number } => {
  const transform = labelGroup.getAttribute("transform");
  return parseTransform2d(transform);
};
