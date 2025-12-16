import { getCanvasContainer } from "../../canvas/helpers/getCanvasContainer";

export const getViewportLabelsOverlay = (): SVGSVGElement => {
  const canvasContainer = getCanvasContainer();
  const container = canvasContainer || document.body;

  // Check if overlay already exists
  let overlay = container.querySelector(".viewport-labels-overlay") as SVGSVGElement | null;

  if (!overlay) {
    // Create new SVG overlay
    overlay = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    overlay.classList.add("viewport-labels-overlay");

    // Set fixed positioning
    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.pointerEvents = "none";
    overlay.style.zIndex = "500";

    const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
    const viewportHeight = document.documentElement.clientHeight || window.innerHeight;
    overlay.setAttribute("width", viewportWidth.toString());
    overlay.setAttribute("height", viewportHeight.toString());

    container.appendChild(overlay);
  }

  return overlay;
};
