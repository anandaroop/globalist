export interface ThemeColors {
  ocean: string;
  oceanStroke: string;
  countries: string;
  countryStroke: string;
}

export const lightTheme: ThemeColors = {
  ocean: "#e8e8e8",
  oceanStroke: "#cccccc",
  countries: "#bbbbbb",
  countryStroke: "#ffffff",
};

export const darkTheme: ThemeColors = {
  ocean: "#333333",
  oceanStroke: "#555555",
  countries: "#666666",
  countryStroke: "#888888",
};

export const getThemeColors = (isDarkMode: boolean): ThemeColors => {
  return isDarkMode ? darkTheme : lightTheme;
};
