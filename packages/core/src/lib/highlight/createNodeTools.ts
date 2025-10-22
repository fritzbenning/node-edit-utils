export const createNodeTools = (node: HTMLElement): void => {   
    const nodeTools = document.createElement("div");

    nodeTools.className = "node-tools";
    nodeTools.textContent = node.tagName;

    node.appendChild(nodeTools);
}