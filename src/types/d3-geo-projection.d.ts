declare module "d3-geo-projection" {
  import { GeoProjection } from "d3-geo";

  export interface SatelliteProjection extends GeoProjection {
    distance(): number;
    distance(distance: number): this;
  }

  export function geoSatellite(): SatelliteProjection;
}
