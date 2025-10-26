export const makeNodeEditable = (node: HTMLElement) => {
  node.contentEditable = "true";
  node.classList.add("is-editable");
  node.style.outline = "none";
};
