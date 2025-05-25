import type { ProjectionType } from "../types/globe.types";

/**
 * Generate PROJ string for the current projection and parameters
 */
export const generateProjString = (
  projectionType: ProjectionType,
  centralMeridian: number,
  centralParallel: number,
  distance?: number
): string => {
  // Round values to 1 decimal place for cleaner output
  const lon = Math.round(centralMeridian * 10) / 10;
  const lat = Math.round(centralParallel * 10) / 10;

  if (projectionType === "orthographic") {
    return `+proj=ortho +lat_0=${lat} +lon_0=${lon} +datum=WGS84 +units=m +no_defs`;
  } else {
    // Satellite projection - convert distance to height in meters
    // Our distance parameter represents distance from Earth's center in Earth radii
    // Earth's radius ≈ 6,378,137 meters
    const earthRadius = 6378137;
    const heightMeters = distance
      ? Math.round((distance - 1) * earthRadius)
      : 1276000;

    return `+proj=nsper +lat_0=${lat} +lon_0=${lon} +h=${heightMeters} +datum=WGS84 +units=m +no_defs`;
  }
};
