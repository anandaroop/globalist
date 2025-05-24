import { useEffect, useRef, useState } from "react";
import { select } from "d3-selection";
import { geoOrthographic, geoPath } from "d3-geo";
import type { GeoPermissibleObjects } from "d3-geo";
import type { FeatureCollection } from "geojson";

interface GlobeProps {
  centralMeridian: number;
}

export const Globe = ({ centralMeridian }: GlobeProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const projectionRef = useRef<d3.GeoProjection | null>(null);
  const pathRef = useRef<d3.GeoPath | null>(null);

  const width = 800;
  const height = 600;
  const scale = 200;

  // Load GeoJSON data once on mount
  useEffect(() => {
    fetch("/data/countries.geojson")
      .then((response) => response.json())
      .then((data: FeatureCollection) => {
        setGeoData(data);
      })
      .catch((error) => {
        console.error("Error loading GeoJSON:", error);
      });
  }, []);

  // Initialize the globe once when data is loaded
  useEffect(() => {
    if (!geoData) return;

    const svg = select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    const projection = geoOrthographic()
      .scale(scale)
      .translate([width / 2, height / 2])
      .rotate([-centralMeridian, 0])
      .clipAngle(90);

    const path = geoPath().projection(projection);

    projectionRef.current = projection;
    pathRef.current = path;

    // Render countries
    svg
      .selectAll(".country")
      .data(geoData.features)
      .enter()
      .append("path")
      .attr("class", "country")
      .attr("d", path as (object: GeoPermissibleObjects) => string | null)
      .attr("fill", "#d3d3d3")
      .attr("stroke", "#333")
      .attr("stroke-width", 0.5);

    // Add graticule (grid lines)
    const graticule = { type: "Sphere" };
    svg
      .append("path")
      .attr("class", "graticule")
      .datum(graticule)
      .attr("d", path as (object: GeoPermissibleObjects) => string | null)
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 1);
  }, [geoData]);

  // Update only the projection when centralMeridian changes
  useEffect(() => {
    if (!geoData || !projectionRef.current || !pathRef.current) return;

    const svg = select(svgRef.current);

    // Update projection rotation
    projectionRef.current.rotate([-centralMeridian, 0]);

    // Update all paths with new projection
    svg
      .selectAll(".country")
      .attr(
        "d",
        pathRef.current as (object: GeoPermissibleObjects) => string | null
      );

    svg
      .select(".graticule")
      .attr(
        "d",
        pathRef.current as (object: GeoPermissibleObjects) => string | null
      );
  }, [centralMeridian, geoData]);

  return <svg ref={svgRef}></svg>;
};
