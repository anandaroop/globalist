/**
 * Convert screen coordinates to trackball sphere coordinates
 */
export const mouseToSphere = (
  x: number,
  y: number,
  width: number,
  height: number
): [number, number, number] => {
  // Normalize coordinates to [-1, 1] range
  const nx = (x - width / 2) / (Math.min(width, height) / 2);
  const ny = -(y - height / 2) / (Math.min(width, height) / 2); // Invert y

  const r2 = nx * nx + ny * ny;
  if (r2 <= 1) {
    // Inside sphere - project to sphere surface
    return [nx, ny, Math.sqrt(1 - r2)];
  } else {
    // Outside sphere - project to edge
    const r = Math.sqrt(r2);
    return [nx / r, ny / r, 0];
  }
};

/**
 * Calculate rotation from two sphere points
 */
export const rotationFromVectors = (
  v0: [number, number, number],
  v1: [number, number, number]
): [number, number, number] => {
  // Calculate rotation axis (cross product)
  const axis = [
    v0[1] * v1[2] - v0[2] * v1[1],
    v0[2] * v1[0] - v0[0] * v1[2],
    v0[0] * v1[1] - v0[1] * v1[0],
  ];

  // Calculate rotation angle
  const dot = v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2];
  const angle = Math.acos(Math.max(-1, Math.min(1, dot)));

  // Convert to Euler angles (approximation for small rotations)
  const k = angle / Math.sin(angle) || 0;
  return [
    (-axis[1] * k * 180) / Math.PI, // longitude (yaw)
    (axis[0] * k * 180) / Math.PI, // latitude (pitch)
    0, // roll (not used)
  ];
};

/**
 * Clamp a value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};
