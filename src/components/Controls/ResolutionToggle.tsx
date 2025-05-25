import type { ResolutionType } from "../../types/globe.types";
import styles from "./ResolutionToggle.module.css";

interface ResolutionToggleProps {
  value: ResolutionType;
  onChange: (value: ResolutionType) => void;
}

export const ResolutionToggle = ({
  value,
  onChange,
}: ResolutionToggleProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.label}>Resolution</div>
      <div className={styles.radioGroup}>
        <label className={styles.radioItem}>
          <input
            type="radio"
            name="resolution"
            value="low"
            checked={value === "low"}
            onChange={() => onChange("low")}
            className={styles.radioInput}
          />
          <span className={styles.radioLabel}>Low (110m)</span>
        </label>
        <label className={styles.radioItem}>
          <input
            type="radio"
            name="resolution"
            value="medium"
            checked={value === "medium"}
            onChange={() => onChange("medium")}
            className={styles.radioInput}
          />
          <span className={styles.radioLabel}>Medium (50m)</span>
        </label>
      </div>
    </div>
  );
};
