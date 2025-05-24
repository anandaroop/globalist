import type { ActionButtonsProps } from "../../types/controls.types";
import { Button } from "../common/Button";
import styles from "./ActionButtons.module.css";

export const ActionButtons = ({ onDownload, onReset }: ActionButtonsProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.buttonGroup}>
        <Button onClick={onReset} variant="secondary">
          Reset
        </Button>
      </div>
      <div className={styles.buttonGroup}>
        <Button onClick={onDownload} variant="primary">
          Download SVG
        </Button>
      </div>
    </div>
  );
};
