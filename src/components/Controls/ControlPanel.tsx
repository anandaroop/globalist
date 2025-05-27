import type { GlobeState, ResolutionType } from "../../types/globe.types";
import { SliderControl } from "../common/Slider";
import { ProjectionToggle } from "./ProjectionToggle";
import { ResolutionToggle } from "./ResolutionToggle";
import { ProjectionDisplay } from "./ProjectionDisplay";
import {
  ROTATION_LIMITS,
  ZOOM_LIMITS,
  DISTANCE_LIMITS,
} from "../../utils/constants";
import { Flex } from "@radix-ui/themes";

interface ControlPanelProps {
  state: GlobeState;
  onMeridianChange: (value: number) => void;
  onParallelChange: (value: number) => void;
  onZRotationChange: (value: number) => void;
  onZoomChange: (value: number) => void;
  onProjectionTypeChange: (value: "orthographic" | "satellite") => void;
  onDistanceChange: (value: number) => void;
  onResolutionChange: (value: ResolutionType) => void;
  onDownload: () => void;
  onReset: () => void;
}

export const ControlPanel = ({
  state,
  onMeridianChange,
  onParallelChange,
  onZRotationChange,
  onZoomChange,
  onProjectionTypeChange,
  onDistanceChange,
  onResolutionChange,
}: ControlPanelProps) => {
  return (
    <Flex direction="column" gap="6" p="5">
      <ProjectionToggle
        value={state.projectionType}
        onChange={onProjectionTypeChange}
      />

      <SliderControl
        label="Longitude"
        description="Center the globe on this meridian of longitude"
        value={state.centralMeridian}
        onChange={onMeridianChange}
        min={ROTATION_LIMITS.meridian.min}
        max={ROTATION_LIMITS.meridian.max}
        step={0.1}
      />

      <SliderControl
        label="Latitude"
        description="Center the globe on this parallel of latitude"
        value={state.centralParallel}
        onChange={onParallelChange}
        min={ROTATION_LIMITS.parallel.min}
        max={ROTATION_LIMITS.parallel.max}
        step={0.1}
      />

      <SliderControl
        label="Zoom"
        description="Enlarge the globe by this factor"
        value={state.zoom}
        onChange={onZoomChange}
        min={ZOOM_LIMITS.min}
        max={ZOOM_LIMITS.max}
        step={ZOOM_LIMITS.step}
      />

      <SliderControl
        label="Roll"
        description="Rotate the globe around the z-axis, perpendicular to the screen"
        value={state.zRotation}
        onChange={onZRotationChange}
        min={ROTATION_LIMITS.z.min}
        max={ROTATION_LIMITS.z.max}
        step={0.1}
      />

      {state.projectionType === "satellite" && (
        <SliderControl
          label="Perspective"
          description="Adjust how much of the Earth remains in view"
          value={state.distance}
          onChange={onDistanceChange}
          min={DISTANCE_LIMITS.min}
          max={DISTANCE_LIMITS.max}
          step={DISTANCE_LIMITS.step}
        />
      )}

      <ResolutionToggle
        value={state.resolution}
        onChange={onResolutionChange}
      />

      <ProjectionDisplay state={state} />
    </Flex>
  );
};
