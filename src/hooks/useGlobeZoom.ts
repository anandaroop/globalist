import { useRef, useCallback, useEffect } from "react";
import { select } from "d3-selection";
import type { GeoProjection } from "d3-geo";
import type { ProjectionType } from "../types/globe.types";
import { calculateScale } from "../utils/d3-helpers";
import { clamp } from "../utils/math";
import { ZOOM_LIMITS } from "../utils/constants";

interface UseGlobeZoomProps {
  svgRef: React.RefObject<SVGSVGElement>;
  projection: GeoProjection | null;
  path: d3.GeoPath<d3.GeoPermissibleObjects, d3.GeoPermissibleObjects> | null;
  projectionType: ProjectionType;
  dimensions: { width: number; height: number };
  zoom: number;
  onZoomChange: (value: number) => void;
}

export const useGlobeZoom = ({
  svgRef,
  projection,
  path,
  projectionType,
  dimensions,
  zoom,
  onZoomChange,
}: UseGlobeZoomProps) => {
  const currentZoomRef = useRef(zoom);

  // Keep zoom ref in sync with prop
  currentZoomRef.current = zoom;

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      event.preventDefault();

      if (!projection || !path || !svgRef.current) return;

      // Map wheel delta to zoom change (negative because scroll up should zoom in)
      const deltaZoom = -event.deltaY * ZOOM_LIMITS.wheelSensitivity;
      const newZoom = clamp(
        currentZoomRef.current + deltaZoom,
        ZOOM_LIMITS.min,
        ZOOM_LIMITS.max
      );

      // Update ref immediately for next event
      currentZoomRef.current = newZoom;

      // Calculate new scale and update projection directly
      const baseSize = Math.min(dimensions.width, dimensions.height);
      const newScale = calculateScale(projectionType, baseSize, newZoom);

      // Update existing projection scale directly (much faster than recreating)
      projection.scale(newScale);

      // Re-render paths with updated projection
      const svg = select(svgRef.current);
      svg.selectAll(".country").attr("d", path);
      svg.select(".graticule").attr("d", path);

      // Update state for slider sync
      onZoomChange(newZoom);
    },
    [
      projection,
      path,
      projectionType,
      dimensions.width,
      dimensions.height,
      onZoomChange,
      svgRef,
    ]
  );

  // Add wheel event listener to SVG
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    svg.addEventListener("wheel", handleWheel);

    return () => {
      svg.removeEventListener("wheel", handleWheel);
    };
  }, [handleWheel, svgRef]);
};
