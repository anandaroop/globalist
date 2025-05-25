import { useState, useEffect, useRef, useCallback } from "react";
import type { DimensionsHook } from "../types/globe.types";
import { RESPONSIVE_CONFIG } from "../utils/constants";

export const useDimensions = (): DimensionsHook => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const containerElementRef = useRef<HTMLDivElement | null>(null);

  const updateDimensions = useCallback((container: HTMLDivElement) => {
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Only update if we have valid dimensions
    if (containerWidth > 0 && containerHeight > 0) {
      // Use configured ratio of the smaller dimension to ensure the globe fits
      const size =
        Math.min(containerWidth, containerHeight) *
        RESPONSIVE_CONFIG.containerSizeRatio;

      setDimensions({ width: size, height: size });
    }
  }, []);

  // Callback ref that measures dimensions when container is attached
  const containerRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node !== null) {
        containerElementRef.current = node;

        // Measure immediately when ref is attached
        updateDimensions(node);

        // Set up ResizeObserver
        if (!resizeObserverRef.current) {
          resizeObserverRef.current = new ResizeObserver((entries) => {
            for (const entry of entries) {
              updateDimensions(entry.target as HTMLDivElement);
            }
          });
        }

        resizeObserverRef.current.observe(node);
      } else if (containerElementRef.current && resizeObserverRef.current) {
        // Clean up when ref is detached
        resizeObserverRef.current.unobserve(containerElementRef.current);
        containerElementRef.current = null;
      }
    },
    [updateDimensions]
  );

  useEffect(() => {
    // Window resize fallback
    const handleResize = () => {
      if (containerElementRef.current) {
        updateDimensions(containerElementRef.current);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [updateDimensions]);

  return { dimensions, containerRef };
};
