/**
 * Theme Hook
 * Use this hook to access theme context in any component
 */

import { useContext } from "react";
import { ThemeContext } from "../context";
import { ThemeContextType } from "../types";

/**
 * Hook to access theme context
 * Must be used inside ThemeProvider
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
