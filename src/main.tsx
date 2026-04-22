import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider, injectThemeStyles } from "@/theme";

// Inject theme CSS custom properties and base styles
// Use requestIdleCallback to defer non-critical work
if ("requestIdleCallback" in window) {
  requestIdleCallback(
    () => {
      injectThemeStyles();
    },
    { timeout: 2000 },
  );
} else {
  // Fallback for browsers without requestIdleCallback
  injectThemeStyles();
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
