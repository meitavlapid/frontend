import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    port: process.env.PORT || 10000, // שימוש בפורט ש-Render מקצה
    host: "0.0.0.0", // מאזין לכל החיבורים
  },
  server: {
    port: process.env.PORT || 3000, // גם בסביבת פיתוח
    host: "0.0.0.0",
  },
});
