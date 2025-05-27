import { Button, Flex } from "@radix-ui/themes";
import type { ActionButtonsProps } from "../../types/controls.types";

export const ActionButtons = ({ onDownload, onReset }: ActionButtonsProps) => {
  return (
    <Flex direction="row" gap="3" p="5">
      <Button
        size="4"
        onClick={onReset}
        variant="surface"
        style={{ width: "50%" }}
      >
        Reset
      </Button>
      <Button size="4" onClick={onDownload} style={{ width: "50%" }}>
        Download SVG
      </Button>
    </Flex>
  );
};
