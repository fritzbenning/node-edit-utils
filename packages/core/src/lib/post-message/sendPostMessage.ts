export function sendPostMessage(action: string, data: unknown): void {
  window.parent.postMessage(
    {
      source: "node-edit-utils",
      action,
      data,
      timestamp: Date.now(),
    },
    "*"
  );
}
