import type { GlobeState } from "../../types/globe.types";
import { generateProjString } from "../../utils/proj-string";
import styles from "./ProjectionDisplay.module.css";

interface ProjectionDisplayProps {
  state: GlobeState;
}

export const ProjectionDisplay = ({ state }: ProjectionDisplayProps) => {
  const projString = generateProjString(
    state.projectionType,
    state.centralMeridian,
    state.centralParallel,
    state.distance
  );

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(projString);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = projString;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.label}>PROJ String</div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={projString}
          readOnly
          className={styles.input}
          onClick={handleCopyToClipboard}
          title="Click to copy to clipboard"
        />
        <button
          type="button"
          onClick={handleCopyToClipboard}
          className={styles.copyButton}
          title="Copy to clipboard"
        >
          📋
        </button>
      </div>
    </div>
  );
};
