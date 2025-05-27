import { Box, Flex, IconButton, Text } from "@radix-ui/themes";
import { DarkModeToggle } from "../Controls/DarkModeToggle";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

interface HeaderProps {
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
}

export const Header = ({ isDarkMode, onDarkModeToggle }: HeaderProps) => {
  return (
    <Flex justify="between" align="center" px="3" width="100%" height="100%">
      <Text weight="bold" size="4" style={{ cursor: "pointer" }}>
        Globalist
        <Text weight="light" color="gray">
          &nbsp;v1&nbsp;
        </Text>
        <Text weight="medium" style={{ color: "var(--accent-8)" }}>
          Create a custom globe view. Download vector art.
        </Text>
      </Text>
      <Flex gap="4">
        <Box>
          <a
            href="https://github.com/anandaroop/globalist"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconButton color="gray" variant="soft" title="GitHub">
              <GitHubLogoIcon width={24} height={24} />
            </IconButton>
          </a>
        </Box>
        <Box>
          <DarkModeToggle isDarkMode={isDarkMode} onToggle={onDarkModeToggle} />
        </Box>
      </Flex>
    </Flex>
  );
};
