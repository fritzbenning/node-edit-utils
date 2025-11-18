export function getHighlightFrameElement(): SVGSVGElement | null {
  return document.body.querySelector(".highlight-frame-overlay") as SVGSVGElement | null;
}
