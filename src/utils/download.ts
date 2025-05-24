export const downloadSVGFromElement = (
  svgElement: SVGSVGElement,
  width: number,
  height: number,
  filename: string
): void => {
  // Create a complete SVG with proper XML declaration and namespace
  const completeSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
${svgElement.innerHTML}
</svg>`;

  // Create download link
  const blob = new Blob([completeSVG], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const generateGlobeFilename = (
  centralMeridian: number,
  centralParallel: number,
  zRotation: number,
  zoom: number
): string => {
  return `globe-${centralMeridian.toFixed(1)}-${centralParallel.toFixed(1)}-${zRotation.toFixed(1)}-${zoom.toFixed(1)}x.svg`;
};
