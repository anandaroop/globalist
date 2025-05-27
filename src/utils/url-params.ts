import type {
  ProjectionType,
  GlobeState,
  ResolutionType,
} from "../types/globe.types";
import { ROTATION_LIMITS, ZOOM_LIMITS, DISTANCE_LIMITS } from "./constants";

let urlUpdateTimeout: NodeJS.Timeout | null = null;

interface URLParams {
  lng?: number;
  lat?: number;
  proj?: ProjectionType;
  zoom?: number;
  rot?: number;
  res?: ResolutionType;
  dist?: number;
}

export const parseURLParams = (): URLParams => {
  if (typeof window === "undefined") {
    return {};
  }

  const params = new URLSearchParams(window.location.search);
  const result: URLParams = {};

  // Parse longitude (central meridian)
  const lngStr = params.get("lng");
  if (lngStr !== null) {
    const lng = parseFloat(lngStr);
    if (
      !isNaN(lng) &&
      lng >= ROTATION_LIMITS.meridian.min &&
      lng <= ROTATION_LIMITS.meridian.max
    ) {
      result.lng = lng;
    }
  }

  // Parse latitude (central parallel)
  const latStr = params.get("lat");
  if (latStr !== null) {
    const lat = parseFloat(latStr);
    if (
      !isNaN(lat) &&
      lat >= ROTATION_LIMITS.parallel.min &&
      lat <= ROTATION_LIMITS.parallel.max
    ) {
      result.lat = lat;
    }
  }

  // Parse projection type
  const projStr = params.get("proj");
  if (projStr === "orthographic" || projStr === "satellite") {
    result.proj = projStr;
  }

  // Parse zoom level
  const zoomStr = params.get("zoom");
  if (zoomStr !== null) {
    const zoom = parseFloat(zoomStr);
    if (!isNaN(zoom) && zoom >= ZOOM_LIMITS.min && zoom <= ZOOM_LIMITS.max) {
      result.zoom = zoom;
    }
  }

  // Parse z-axis rotation
  const rotStr = params.get("rot");
  if (rotStr !== null) {
    const rot = parseFloat(rotStr);
    if (
      !isNaN(rot) &&
      rot >= ROTATION_LIMITS.z.min &&
      rot <= ROTATION_LIMITS.z.max
    ) {
      result.rot = rot;
    }
  }

  // Parse resolution
  const resStr = params.get("res");
  if (resStr === "low" || resStr === "medium") {
    result.res = resStr;
  }

  // Parse distance (only for satellite projection)
  const distStr = params.get("dist");
  if (distStr !== null) {
    const dist = parseFloat(distStr);
    if (
      !isNaN(dist) &&
      dist >= DISTANCE_LIMITS.min &&
      dist <= DISTANCE_LIMITS.max
    ) {
      result.dist = dist;
    }
  }

  return result;
};

export const getInitialStateFromURL = (
  defaultState: GlobeState
): GlobeState => {
  const urlParams = parseURLParams();

  return {
    ...defaultState,
    centralMeridian: urlParams.lng ?? defaultState.centralMeridian,
    centralParallel: urlParams.lat ?? defaultState.centralParallel,
    projectionType: urlParams.proj ?? defaultState.projectionType,
    zoom: urlParams.zoom ?? defaultState.zoom,
    zRotation: urlParams.rot ?? defaultState.zRotation,
    resolution: urlParams.res ?? defaultState.resolution,
    distance: urlParams.dist ?? defaultState.distance,
  };
};

const updateURLImmediate = (state: Partial<GlobeState>): void => {
  if (typeof window === "undefined") {
    return;
  }

  const params = new URLSearchParams(window.location.search);

  // Remove distance parameter if switching away from satellite projection
  if (
    state.projectionType !== undefined &&
    state.projectionType !== "satellite"
  ) {
    params.delete("dist");
  }

  if (state.centralMeridian !== undefined) {
    const roundedMeridian = Math.round(state.centralMeridian * 10) / 10;
    if (roundedMeridian === 0) {
      params.delete("lng");
    } else {
      params.set("lng", roundedMeridian.toString());
    }
  }

  if (state.centralParallel !== undefined) {
    const roundedParallel = Math.round(state.centralParallel * 10) / 10;
    if (roundedParallel === 0) {
      params.delete("lat");
    } else {
      params.set("lat", roundedParallel.toString());
    }
  }

  if (state.projectionType !== undefined) {
    if (state.projectionType === "orthographic") {
      params.delete("proj");
    } else {
      params.set("proj", state.projectionType);
    }
  }

  if (state.zoom !== undefined) {
    const roundedZoom = Math.round(state.zoom * 10) / 10;
    if (roundedZoom === 1.0) {
      params.delete("zoom");
    } else {
      params.set("zoom", roundedZoom.toString());
    }
  }

  if (state.zRotation !== undefined) {
    const roundedRotation = Math.round(state.zRotation * 10) / 10;
    if (roundedRotation === 0) {
      params.delete("rot");
    } else {
      params.set("rot", roundedRotation.toString());
    }
  }

  if (state.resolution !== undefined) {
    if (state.resolution === "low") {
      params.delete("res");
    } else {
      params.set("res", state.resolution);
    }
  }

  if (state.distance !== undefined && state.projectionType !== "orthographic") {
    const roundedDistance = Math.round(state.distance * 10) / 10;
    if (roundedDistance === DISTANCE_LIMITS.default) {
      params.delete("dist");
    } else {
      params.set("dist", roundedDistance.toString());
    }
  }

  const newURL = `${window.location.pathname}${params.toString() ? "?" + params.toString() : ""}`;
  window.history.replaceState({}, "", newURL);
};

export const updateURL = (state: Partial<GlobeState>): void => {
  if (urlUpdateTimeout) {
    clearTimeout(urlUpdateTimeout);
  }

  urlUpdateTimeout = setTimeout(() => {
    updateURLImmediate(state);
    urlUpdateTimeout = null;
  }, 300);
};
