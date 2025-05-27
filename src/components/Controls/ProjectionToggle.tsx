import { Flex, Heading, RadioCards, Text } from "@radix-ui/themes";
import type { ProjectionToggleProps } from "../../types/controls.types";

export const ProjectionToggle = ({
  value,
  onChange,
}: ProjectionToggleProps) => {
  return (
    <Flex direction="column">
      <Heading size="3" mb="2">
        Projection
      </Heading>

      <RadioCards.Root
        defaultValue="orthographic"
        onChange={() => onChange("orthographic")}
      >
        <RadioCards.Item
          value="orthographic"
          checked={value === "orthographic"}
          onClick={() => onChange("orthographic")}
        >
          <Flex direction="column" width="100%">
            <Text weight="bold">Orthographic</Text>
            <Text>Earth as viewed from infinite distance</Text>
          </Flex>
        </RadioCards.Item>

        <RadioCards.Item
          value="satellite"
          checked={value === "satellite"}
          onClick={() => onChange("satellite")}
        >
          <Flex direction="column" width="100%">
            <Text weight="bold">Satellite</Text>
            <Text>Earth as viewed from perspective</Text>
          </Flex>
        </RadioCards.Item>
      </RadioCards.Root>
    </Flex>
  );
};
