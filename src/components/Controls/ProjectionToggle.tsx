import type { ProjectionToggleProps } from "../../types/controls.types";
import styles from "./ProjectionToggle.module.css";

export const ProjectionToggle = ({
  value,
  onChange,
}: ProjectionToggleProps) => {
  return (
    <div className={styles.container}>
      <h4 className={styles.label}>Projection</h4>
      <div className={styles.controls}>
        <label className={styles.option}>
          <input
            type="radio"
            value="orthographic"
            checked={value === "orthographic"}
            onChange={(e) =>
              onChange(e.target.value as "orthographic" | "satellite")
            }
          />
          Orthographic
        </label>
        <label className={styles.option}>
          <input
            type="radio"
            value="satellite"
            checked={value === "satellite"}
            onChange={(e) =>
              onChange(e.target.value as "orthographic" | "satellite")
            }
          />
          Satellite
        </label>
      </div>
    </div>
  );
};
