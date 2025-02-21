import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  preview: {
    port: process.env.PORT || 10000, // שימוש בפורט המתאים ל-Render
    host: "0.0.0.0", // מאפשר חיבור חיצוני
    allowedHosts: ["prj-node.onrender.com"], // מאפשר ל-Render לגשת לאפליקציה
  },
  server: {
    port: process.env.PORT || 3000, // גם בסביבת פיתוח
    host: "0.0.0.0",
  },
});
