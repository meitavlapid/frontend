import { useContext } from "react";
import ThemeContext from "../components/themeContext";

export const useTheme = () => {
  return useContext(ThemeContext);
};
