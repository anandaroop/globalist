import { useState, useEffect, useRef } from "react";
import type { DimensionsHook } from "../types/globe.types";
import { RESPONSIVE_CONFIG } from "../utils/constants";

export const useDimensions = (): DimensionsHook => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  const updateDimensions = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Use configured ratio of the smaller dimension to ensure the globe fits
    const size =
      Math.min(containerWidth, containerHeight) *
      RESPONSIVE_CONFIG.containerSizeRatio;

    setDimensions({ width: size, height: size });
  };

  useEffect(() => {
    updateDimensions();

    const handleResize = () => updateDimensions();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { dimensions, containerRef };
};
