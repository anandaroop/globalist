import { Flex, IconButton } from "@radix-ui/themes";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";
import type { DarkModeToggleProps } from "../../types/controls.types";

export const DarkModeToggle = ({
  isDarkMode,
  onToggle,
}: DarkModeToggleProps) => {
  return (
    <Flex align="center">
      <IconButton color="gray" variant="soft" onClick={onToggle}>
        {isDarkMode ? (
          <MoonIcon width={24} height={24} />
        ) : (
          <SunIcon width={24} height={24} />
        )}
      </IconButton>
    </Flex>
  );
};
