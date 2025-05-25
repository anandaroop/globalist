import { geoOrthographic, geoPath } from "d3-geo";
import { geoSatellite } from "d3-geo-projection";
import type { GeoProjection } from "d3-geo";
import type { ProjectionType } from "../types/globe.types";
import { PROJECTION_CONFIG } from "./constants";

export const createProjection = (
  projectionType: ProjectionType,
  scale: number,
  width: number,
  height: number,
  centralMeridian: number,
  centralParallel: number,
  zRotation: number,
  distance?: number
): GeoProjection => {
  if (projectionType === "satellite") {
    const config = PROJECTION_CONFIG.satellite;
    const satelliteDistance = distance || config.distance;
    return geoSatellite()
      .scale(scale)
      .translate([width / 2, height / 2])
      .rotate([-centralMeridian, -centralParallel, zRotation])
      .distance(satelliteDistance)
      .clipAngle((Math.acos(1 / satelliteDistance) * 180) / Math.PI);
  } else {
    const config = PROJECTION_CONFIG.orthographic;
    return geoOrthographic()
      .scale(scale)
      .translate([width / 2, height / 2])
      .rotate([-centralMeridian, -centralParallel, zRotation])
      .clipAngle(config.clipAngle);
  }
};

export const calculateScale = (
  projectionType: ProjectionType,
  baseSize: number,
  zoom: number
): number => {
  const config = PROJECTION_CONFIG[projectionType];
  const baseScale = baseSize / config.scaleRatio;
  return baseScale * zoom;
};

export const createGeoPath = (projection: GeoProjection) => {
  return geoPath().projection(projection);
};
