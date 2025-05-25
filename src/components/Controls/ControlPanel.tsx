import type { GlobeState } from "../../types/globe.types";
import { SliderControl } from "../common/Slider";
import { ProjectionToggle } from "./ProjectionToggle";
import { DarkModeToggle } from "./DarkModeToggle";
import { ActionButtons } from "./ActionButtons";
import { ROTATION_LIMITS, ZOOM_LIMITS } from "../../utils/constants";
import styles from "./ControlPanel.module.css";

interface ControlPanelProps {
  state: GlobeState;
  onMeridianChange: (value: number) => void;
  onParallelChange: (value: number) => void;
  onZRotationChange: (value: number) => void;
  onZoomChange: (value: number) => void;
  onProjectionTypeChange: (value: "orthographic" | "satellite") => void;
  onDarkModeToggle: () => void;
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
  onDarkModeToggle,
  onDownload,
  onReset,
}: ControlPanelProps) => {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3 className={styles.title}>Settings</h3>
        <DarkModeToggle
          isDarkMode={state.isDarkMode}
          onToggle={onDarkModeToggle}
        />
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

      <ActionButtons onDownload={onDownload} onReset={onReset} />
    </div>
  );
};
