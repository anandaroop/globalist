export interface SliderControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  className?: string;
}

export interface ProjectionToggleProps {
  value: "orthographic" | "satellite";
  onChange: (value: "orthographic" | "satellite") => void;
}

export interface DarkModeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

export interface ActionButtonsProps {
  onDownload: () => void;
  onReset: () => void;
}
