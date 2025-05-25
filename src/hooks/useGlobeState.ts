import { useState } from "react";
import type { GlobeState, ProjectionType } from "../types/globe.types";
import { DISTANCE_LIMITS } from "../utils/constants";

const getInitialDarkMode = (): boolean => {
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  return false;
};

export const useGlobeState = () => {
  const [state, setState] = useState<GlobeState>({
    centralMeridian: 0,
    centralParallel: 0,
    zRotation: 0,
    zoom: 1.0,
    projectionType: "orthographic",
    isDarkMode: getInitialDarkMode(),
    distance: DISTANCE_LIMITS.default,
  });

  const updateMeridian = (value: number) => {
    setState((prev) => ({ ...prev, centralMeridian: value }));
  };

  const updateParallel = (value: number) => {
    setState((prev) => ({ ...prev, centralParallel: value }));
  };

  const updateZRotation = (value: number) => {
    setState((prev) => ({ ...prev, zRotation: value }));
  };

  const updateZoom = (value: number) => {
    setState((prev) => ({ ...prev, zoom: value }));
  };

  const updateProjectionType = (value: ProjectionType) => {
    setState((prev) => ({ ...prev, projectionType: value }));
  };

  const updateDistance = (value: number) => {
    setState((prev) => ({ ...prev, distance: value }));
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
    }));
  };

  return {
    state,
    updateMeridian,
    updateParallel,
    updateZRotation,
    updateZoom,
    updateProjectionType,
    updateDistance,
    toggleDarkMode,
    reset,
  };
};
