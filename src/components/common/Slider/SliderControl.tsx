import { Box, Flex, Heading, Slider, Text, TextField } from "@radix-ui/themes";
import type { SliderControlProps } from "../../../types/controls.types";

export const SliderControl = ({
  label,
  description,
  value,
  onChange,
  min,
  max,
  step,
}: SliderControlProps) => {
  return (
    <Flex direction="column" gap="1">
      <Heading size="3">{label}</Heading>
      <Text as="p" mb="1" style={{ color: "var(--gray-10)" }}>
        {description}
      </Text>
      <Flex align="center" gap="3">
        <Box width="4rem">
          <TextField.Root
            type="number"
            value={parseFloat(value.toFixed(1))}
            onChange={(e) => onChange(Number(e.target.value))}
            min={min}
            max={max}
            step={step}
          />
        </Box>
        <Box flexGrow="1">
          <Slider
            value={[value]}
            onValueChange={(val) => onChange(val[0])}
            min={min}
            max={max}
            step={step}
          />
        </Box>
      </Flex>
    </Flex>
  );
};
