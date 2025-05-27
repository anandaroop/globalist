import { Flex, Heading, RadioGroup, Text } from "@radix-ui/themes";
import type { ResolutionType } from "../../types/globe.types";

interface ResolutionToggleProps {
  value: ResolutionType;
  onChange: (value: ResolutionType) => void;
}

export const ResolutionToggle = ({
  value,
  onChange,
}: ResolutionToggleProps) => {
  return (
    <Flex direction="column">
      <Heading size="3" mb="2">
        Resolution
      </Heading>

      <RadioGroup.Root
        name="resolution"
        onValueChange={(val: ResolutionType) => onChange(val)}
      >
        <Flex direction="column" gap="2">
          <RadioGroup.Item value="low" checked={value === "low"}>
            Low (1:110m)
            <Text ml="1" style={{ color: "var(--gray-10)" }}>
              best default, for zoomed-out views and for adjusting the globe
            </Text>
          </RadioGroup.Item>
          <RadioGroup.Item value="medium" checked={value === "medium"}>
            Medium (1:50m)
            <Text ml="2" style={{ color: "var(--gray-10)" }}>
              best for highly zoomed-in views
            </Text>
          </RadioGroup.Item>
        </Flex>
      </RadioGroup.Root>
    </Flex>
  );
};
