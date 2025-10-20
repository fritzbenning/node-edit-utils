declare global {
  interface Window {
    canvas?: {
      zoom: {
        current: number;
      };
    };
  }
}

export {};
