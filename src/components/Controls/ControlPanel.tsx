import type { GlobeState, ResolutionType } from "../../types/globe.types";
import { SliderControl } from "../common/Slider";
import { ProjectionToggle } from "./ProjectionToggle";
import { ResolutionToggle } from "./ResolutionToggle";
import { ProjectionDisplay } from "./ProjectionDisplay";
import { ActionButtons } from "./ActionButtons";
import {
  ROTATION_LIMITS,
  ZOOM_LIMITS,
  DISTANCE_LIMITS,
} from "../../utils/constants";
import styles from "./ControlPanel.module.css";

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
  onDownload,
  onReset,
}: ControlPanelProps) => {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3 className={styles.title}>Settings</h3>
      </div>

      <ProjectionToggle
        value={state.projectionType}
        onChange={onProjectionTypeChange}
      />

      <SliderControl
        label="Central meridian"
        value={state.centralMeridian}
        onChange={onMeridianChange}
        min={ROTATION_LIMITS.meridian.min}
        max={ROTATION_LIMITS.meridian.max}
        step={0.1}
      />

      <SliderControl
        label="Central parallel"
        value={state.centralParallel}
        onChange={onParallelChange}
        min={ROTATION_LIMITS.parallel.min}
        max={ROTATION_LIMITS.parallel.max}
        step={0.1}
      />

      <SliderControl
        label="Zoom"
        value={state.zoom}
        onChange={onZoomChange}
        min={ZOOM_LIMITS.min}
        max={ZOOM_LIMITS.max}
        step={ZOOM_LIMITS.step}
      />

      <SliderControl
        label="Z-axis rotation"
        value={state.zRotation}
        onChange={onZRotationChange}
        min={ROTATION_LIMITS.z.min}
        max={ROTATION_LIMITS.z.max}
        step={0.1}
      />

      {state.projectionType === "satellite" && (
        <SliderControl
          label="Distance"
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

      <ActionButtons onDownload={onDownload} onReset={onReset} />
    </div>
  );
};
