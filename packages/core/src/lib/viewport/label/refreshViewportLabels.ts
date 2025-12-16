import { getScreenBounds } from "../../node-tools/highlight/helpers/getScreenBounds";
import { getViewportLabelsOverlay } from "./getViewportLabelsOverlay";

export const refreshViewportLabels = (): void => {
  const overlay = getViewportLabelsOverlay();

  // Update SVG dimensions to match current viewport
  const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
  const viewportHeight = document.documentElement.clientHeight || window.innerHeight;
  overlay.setAttribute("width", viewportWidth.toString());
  overlay.setAttribute("height", viewportHeight.toString());

  // Find all viewports with names
  const viewports = document.querySelectorAll(".viewport[data-viewport-name]");

  // Remove existing label groups
  const existingGroups = overlay.querySelectorAll(".viewport-label-group");
  existingGroups.forEach((group) => {
    group.remove();
  });

  // Create/update labels for each viewport
  viewports.forEach((viewport) => {
    const viewportElement = viewport as HTMLElement;
    const viewportName = viewportElement.getAttribute("data-viewport-name");

    if (!viewportName) return;

    const bounds = getScreenBounds(viewportElement);

    // Create group for this viewport label
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.classList.add("viewport-label-group");
    group.setAttribute("data-viewport-name", viewportName);
    group.setAttribute("transform", `translate(${bounds.left}, ${bounds.top})`);

    // Create text element
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.classList.add("viewport-label-text");
    text.setAttribute("x", "0");
    text.setAttribute("y", "-8");
    text.setAttribute("vector-effect", "non-scaling-stroke");
    text.setAttribute("pointer-events", "auto");
    text.textContent = viewportName;

    group.appendChild(text);
    overlay.appendChild(group);
  });
};
