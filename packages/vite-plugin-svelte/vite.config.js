import { defineConfig } from "vitest/config";
import { brefer } from "./src/index.js";

export default defineConfig({
	plugins: [brefer()],
	test: {
		include: ["src/**/*"],
	},
});
