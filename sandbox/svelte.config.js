import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { breferPreprocess } from "../src/index.js";

export default {
	// Consult https://svelte.dev/docs#compile-time-svelte-preprocess
	// for more information about preprocessors
	preprocess: [vitePreprocess(), breferPreprocess()],
	compilerOptions: {
		runes: true
	}
};
