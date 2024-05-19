import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { brefer } from "../src/index";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [brefer(), svelte()]
});
