export const setNodeNonEditable = (node: HTMLElement) => {
  node.contentEditable = "false";
  node.classList.remove("is-editable");
  node.style.outline = "none";
};
