import { preprocess as sveltePreprocess } from "svelte/compiler";
import { breferPreprocess, preprocessScript } from "@brefer/preprocessor";
import { createFilter } from "vite";

/**
 * Brefer vite plugin for svelte. It allows to preprocess .svelte.js files as well as .svelte files.
 *
 * Prefer the use of `@brefer/preprocessor` if you want to preprocess .svelte files only.
 *
 * @export
 * @param {import("./public.js").BreferConfig} config
 * @returns {import("vite").Plugin}
 */
export function brefer(config = {}) {
	const shouldProcess = createFilter(config.include, config.exclude);

	return {
		name: "vite-plugin-svelte-brefer",
		async transform(code, id) {
			if (!shouldProcess(id)) {
				return;
			}

			if (id.endsWith(".svelte")) {
				const preprocessed = await sveltePreprocess(code, breferPreprocess(), {
					filename: id,
				});

				return {
					code: preprocessed.code,
					map: /** @type {string} */ (preprocessed.map),
					id,
				};
			}
			if (id.endsWith(".svelte.js") || id.endsWith(".svelte.ts")) {
				const preprocessed = await preprocessScript(code, id, id.slice(-2));

				return {
					code: preprocessed.code,
					map: preprocessed.map,
					id,
				};
			}
		},
	};
}
