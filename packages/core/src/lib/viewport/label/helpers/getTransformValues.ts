import { parseTransform3d } from "../../../helpers/parseTransform";

export const getTransformValues = (element: HTMLElement): { x: number; y: number } => {
  const style = element.style.transform;
  return parseTransform3d(style);
};
