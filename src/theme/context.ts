/**
 * Theme Context
 * Separated to avoid Fast Refresh warning
 */

import { createContext } from "react";
import { ThemeContextType } from "./types";

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);
