import { sendPostMessage } from "@/lib/post-message/sendPostMessage";

export const handleTextChange = (node: HTMLElement, mutations: MutationRecord[], final: boolean = false): void => {
  // Check if any mutation is a text content change
  const hasTextChange = mutations.some((mutation) => {
    return (
      mutation.type === "characterData" ||
      (mutation.type === "childList" && (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0))
    );
  });

  if (!hasTextChange && !final) {
    return;
  }

  // Get the text content of the node
  const textContent = node.textContent ?? "";

  // Get the node ID
  const nodeId = node.getAttribute("data-node-id");

  console.log("textContentChanged", textContent, final);

  // Send postMessage with the text change
  sendPostMessage("textContentChanged", {
    nodeId,
    textContent,
    final,
  });
};
