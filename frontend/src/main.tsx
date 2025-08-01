import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { CssBaseline } from "@mui/material";
import { ThemeRegistry } from "./ThemeRegistry.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeRegistry>
      <CssBaseline /> {/*ブラウザのスタイルをリセットしMUIのCSSで統一 */}
      <App />
    </ThemeRegistry>
  </StrictMode>
);
