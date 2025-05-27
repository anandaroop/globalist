import { Flex, Heading, IconButton, TextField } from "@radix-ui/themes";
import { ClipboardCopyIcon } from "@radix-ui/react-icons";
import styles from "./ProjectionDisplay.module.css";
import type { GlobeState } from "../../types/globe.types";
import { generateProjString } from "../../utils/proj-string";

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
    <Flex direction="column">
      <Heading size="3" mb="2">
        PROJ string
      </Heading>

      <Flex width="100%" align="center" gap="3">
        <IconButton>
          <ClipboardCopyIcon
            width="18"
            height="18"
            onClick={handleCopyToClipboard}
            aria-label="Copy to clipboard"
          />
        </IconButton>
        <TextField.Root
          className={styles.projString}
          type="text"
          value={projString}
          readOnly
          onClick={handleCopyToClipboard}
          title="Click to copy to clipboard"
          style={{ flexGrow: 1 }}
        />
      </Flex>
    </Flex>
  );
};
