import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	base: "/iosdc-japan/2025/code-battle-archive/",
	appType: "mpa",
	plugins: [tailwindcss(), react()],
});
