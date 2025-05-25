import { useState } from "react";
import type {
  GlobeState,
  ProjectionType,
  ResolutionType,
} from "../types/globe.types";
import { DISTANCE_LIMITS } from "../utils/constants";
import { getInitialStateFromURL, updateURL } from "../utils/url-params";

const getInitialDarkMode = (): boolean => {
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  return false;
};

export const useGlobeState = () => {
  const getInitialState = (): GlobeState => {
    const defaultState: GlobeState = {
      centralMeridian: 0,
      centralParallel: 0,
      zRotation: 0,
      zoom: 1.0,
      projectionType: "orthographic",
      isDarkMode: getInitialDarkMode(),
      distance: DISTANCE_LIMITS.default,
      resolution: "low",
    };
    return getInitialStateFromURL(defaultState);
  };

  const [state, setState] = useState<GlobeState>(getInitialState);

  const updateMeridian = (value: number) => {
    setState((prev) => ({ ...prev, centralMeridian: value }));
    updateURL({ centralMeridian: value });
  };

  const updateParallel = (value: number) => {
    setState((prev) => ({ ...prev, centralParallel: value }));
    updateURL({ centralParallel: value });
  };

  const updateZRotation = (value: number) => {
    setState((prev) => ({ ...prev, zRotation: value }));
    updateURL({ zRotation: value });
  };

  const updateZoom = (value: number) => {
    setState((prev) => ({ ...prev, zoom: value }));
    updateURL({ zoom: value });
  };

  const updateProjectionType = (value: ProjectionType) => {
    setState((prev) => ({ ...prev, projectionType: value }));
    updateURL({ projectionType: value });
  };

  const updateDistance = (value: number) => {
    setState((prev) => ({ ...prev, distance: value }));
  };

  const updateResolution = (value: ResolutionType) => {
    setState((prev) => ({ ...prev, resolution: value }));
    updateURL({ resolution: value });
  };

  const toggleDarkMode = () => {
    setState((prev) => ({ ...prev, isDarkMode: !prev.isDarkMode }));
  };

  const reset = () => {
    setState((prev) => ({
      ...prev,
      centralMeridian: 0,
      centralParallel: 0,
      zRotation: 0,
      zoom: 1.0,
      projectionType: "orthographic",
      distance: DISTANCE_LIMITS.default,
      resolution: "low",
    }));

    // Clear all URL parameters
    if (typeof window !== "undefined") {
      const newURL = window.location.pathname;
      window.history.replaceState({}, "", newURL);
    }
  };

  return {
    state,
    updateMeridian,
    updateParallel,
    updateZRotation,
    updateZoom,
    updateProjectionType,
    updateDistance,
    updateResolution,
    toggleDarkMode,
    reset,
  };
};
