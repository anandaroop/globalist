import { useEffect, useRef } from "react";
import { select } from "d3-selection";
import { geoOrthographic, geoPath } from "d3-geo";
import type { GeoPermissibleObjects } from "d3-geo";
import type { FeatureCollection } from "geojson";

export const Globe = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 600;
    const scale = 200;

    svg.attr("width", width).attr("height", height);

    const projection = geoOrthographic()
      .scale(scale)
      .translate([width / 2, height / 2])
      .clipAngle(90);

    const path = geoPath().projection(projection);

    // Load and render the countries GeoJSON
    fetch("/data/countries.geojson")
      .then((response) => response.json())
      .then((data: FeatureCollection) => {
        svg
          .selectAll("path")
          .data(data.features)
          .enter()
          .append("path")
          .attr("d", path as (object: GeoPermissibleObjects) => string | null)
          .attr("fill", "#d3d3d3")
          .attr("stroke", "#333")
          .attr("stroke-width", 0.5);

        // Add graticule (grid lines)
        const graticule = { type: "Sphere" };
        svg
          .append("path")
          .datum(graticule)
          .attr("d", path as (object: GeoPermissibleObjects) => string | null)
          .attr("fill", "none")
          .attr("stroke", "#ccc")
          .attr("stroke-width", 1);
      })
      .catch((error) => {
        console.error("Error loading GeoJSON:", error);
      });
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};
