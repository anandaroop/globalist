import { useRef, useCallback } from "react";
import { select } from "d3-selection";
import type { GeoProjection } from "d3-geo";
import type { FeatureCollection } from "geojson";
import type { D3ProjectionHook, ProjectionType } from "../types/globe.types";
import {
  createProjection,
  calculateScale,
  createGeoPath,
} from "../utils/d3-helpers";
import { getThemeColors } from "../utils/theme";
import type { GeoPath, GeoPermissibleObjects } from "d3-geo";

export const useD3Projection = (): D3ProjectionHook & {
  renderGlobe: (params: {
    geoData: FeatureCollection;
    dimensions: { width: number; height: number };
    centralMeridian: number;
    centralParallel: number;
    zRotation: number;
    zoom: number;
    projectionType: ProjectionType;
    distance: number;
    isDarkMode: boolean;
  }) => void;
  updateProjection: (params: {
    centralMeridian: number;
    centralParallel: number;
    zRotation: number;
  }) => void;
} => {
  const svgRef = useRef<SVGSVGElement>(null);
  const projectionRef = useRef<GeoProjection | null>(null);
  const pathRef = useRef<GeoPath<
    GeoPermissibleObjects,
    GeoPermissibleObjects
  > | null>(null);

  const renderGlobe = useCallback(
    (params: {
      geoData: FeatureCollection;
      dimensions: { width: number; height: number };
      centralMeridian: number;
      centralParallel: number;
      zRotation: number;
      zoom: number;
      projectionType: ProjectionType;
      distance: number;
      isDarkMode: boolean;
    }) => {
      const {
        geoData,
        dimensions,
        centralMeridian,
        centralParallel,
        zRotation,
        zoom,
        projectionType,
        distance,
        isDarkMode,
      } = params;

      const { width, height } = dimensions;
      const baseSize = Math.min(width, height);
      const scale = calculateScale(projectionType, baseSize, zoom);
      const colors = getThemeColors(isDarkMode);

      const svg = select(svgRef.current);
      svg.selectAll("*").remove();
      svg.attr("width", width).attr("height", height);

      const projection = createProjection(
        projectionType,
        scale,
        width,
        height,
        centralMeridian,
        centralParallel,
        zRotation,
        distance
      );

      const path = createGeoPath(projection);

      projectionRef.current = projection;
      pathRef.current = path;

      // Add ocean sphere (water background) first
      const graticule = { type: "Sphere" } as { type: "Sphere" };
      svg
        .append("path")
        .attr("class", "graticule")
        .datum(graticule)
        .attr("d", path!)
        .attr("fill", colors.ocean)
        .attr("stroke", colors.oceanStroke)
        .attr("stroke-width", 1);

      // Render countries on top of ocean
      svg
        .selectAll(".country")
        .data(geoData.features)
        .enter()
        .append("path")
        .attr("class", "country")
        .attr("d", path!)
        .attr("fill", colors.countries)
        .attr("stroke", colors.countryStroke)
        .attr("stroke-width", 0.5);
    },
    []
  );

  const updateProjection = useCallback(
    (params: {
      centralMeridian: number;
      centralParallel: number;
      zRotation: number;
    }) => {
      const { centralMeridian, centralParallel, zRotation } = params;

      if (!projectionRef.current || !pathRef.current) return;

      const svg = select(svgRef.current);

      // Update projection rotation
      projectionRef.current.rotate([
        -centralMeridian,
        -centralParallel,
        zRotation,
      ]);

      // Update all paths with new projection
      // Helper to safely call the path generator
      function safePathCall(
        path: GeoPath<GeoPermissibleObjects, GeoPermissibleObjects> | null,
        d: unknown
      ): string {
        if (!path) return "";
        const result = path.call(
          {} as GeoPermissibleObjects,
          d as GeoPermissibleObjects
        );
        return typeof result === "string" ? result : "";
      }

      svg.selectAll(".country").each(function (d) {
        const el = this as SVGPathElement;
        el.setAttribute("d", safePathCall(pathRef.current, d));
      });
      svg.select(".graticule").each(function (d) {
        const el = this as SVGPathElement;
        el.setAttribute("d", safePathCall(pathRef.current, d));
      });
    },
    []
  );

  return {
    projection: projectionRef.current,
    path: pathRef.current,
    svgRef: svgRef as React.RefObject<SVGSVGElement>,
    renderGlobe,
    updateProjection,
  };
};
