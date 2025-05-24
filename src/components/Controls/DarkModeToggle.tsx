import type { DarkModeToggleProps } from "../../types/controls.types";
import styles from "./DarkModeToggle.module.css";

export const DarkModeToggle = ({
  isDarkMode,
  onToggle,
}: DarkModeToggleProps) => {
  return (
    <div className={styles.container}>
      <span className={styles.label}>Dark mode</span>
      <label className={styles.switch}>
        <input type="checkbox" checked={isDarkMode} onChange={onToggle} />
        <span className={styles.slider}></span>
      </label>
    </div>
  );
};
