declare global {
  interface Window {
    nodeEditUtils: {
      getSelectedNode(): any;
    };
  }
}

export {};
