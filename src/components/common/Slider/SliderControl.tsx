import type { SliderControlProps } from "../../../types/controls.types";
import styles from "./SliderControl.module.css";

export const SliderControl = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  className,
}: SliderControlProps) => {
  return (
    <div className={`${styles.container} ${className || ""}`}>
      <h4 className={styles.label}>{label}</h4>
      <div className={styles.controls}>
        <input
          type="number"
          value={parseFloat(value.toFixed(1))}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          className={styles.input}
        />
        <input
          type="range"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          className={styles.slider}
        />
      </div>
    </div>
  );
};
