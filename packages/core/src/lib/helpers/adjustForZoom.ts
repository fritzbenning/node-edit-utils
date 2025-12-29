export const adjustForZoom = (value: number, zoom: number, precision: number = 5): number => {
  return parseFloat((value / zoom).toFixed(precision));
};

