export const ZOOM_LIMITS = {
  min: 1.0,
  max: 8.0,
  step: 0.1,
  wheelSensitivity: 0.001,
} as const;

export const ROTATION_LIMITS = {
  meridian: { min: -180, max: 180 },
  parallel: { min: -90, max: 90 },
  z: { min: -180, max: 180 },
} as const;

export const PROJECTION_CONFIG = {
  orthographic: {
    scaleRatio: 2.15,
    clipAngle: 90,
  },
  satellite: {
    scaleRatio: 1.95,
    distance: 2.0,
    clipAngleMultiplier: Math.PI,
  },
} as const;

export const DISTANCE_LIMITS = {
  min: 2.0,
  max: 22.0,
  step: 0.1,
  default: 12.0,
} as const;

export const RESPONSIVE_CONFIG = {
  containerSizeRatio: 0.8,
} as const;
