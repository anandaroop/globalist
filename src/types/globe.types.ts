import type { FeatureCollection } from "geojson";
import type { GeoProjection } from "d3-geo";

export type ProjectionType = "orthographic" | "satellite";

export interface GlobeState {
  centralMeridian: number;
  centralParallel: number;
  zRotation: number;
  zoom: number;
  projectionType: ProjectionType;
  isDarkMode: boolean;
  distance: number;
}

export interface GlobeProps {
  centralMeridian: number;
  centralParallel: number;
  zRotation: number;
  zoom: number;
  projectionType: ProjectionType;
  distance: number;
  onMeridianChange: (value: number) => void;
  onParallelChange: (value: number) => void;
  onZoomChange: (value: number) => void;
  isDarkMode: boolean;
}

export interface GlobeRef {
  downloadSVG: () => void;
}

export interface GeoDataHook {
  geoData: FeatureCollection | null;
  loading: boolean;
  error: string | null;
}

export interface DimensionsHook {
  dimensions: { width: number; height: number };
  containerRef: React.RefCallback<HTMLDivElement>;
}

export interface D3ProjectionHook {
  projection: GeoProjection | null;
  path: d3.GeoPath<d3.GeoPermissibleObjects, d3.GeoPermissibleObjects> | null;
  svgRef: React.RefObject<SVGSVGElement>;
}

export interface DragState {
  isDragging: boolean;
  dragStart: {
    mouse: [number, number];
    rotation: [number, number, number];
  } | null;
}
