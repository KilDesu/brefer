declare module '@brefer/preprocessor' {
	/// <reference types="@brefer/shared" />
	/**
	 *
	 * Preprocesses the content of the script tag in .svelte files.
	 *
	 * */
	export function preprocessScript(config: Partial<import("@brefer/shared").BreferConfig>, content: string, filename?: string | undefined): {
		code: string;
		map: import("magic-string").SourceMap;
		filename: string | undefined;
	};
	/**
	 * Preprocessor for Brefer syntax, using variable prefixes to handle reactivity.
	 * It avoids the need to call `$state`, `$derived` or `$effect` runes every time.
	 *
	 * If you also want to preprocess .svelte.js files, use `@brefer/vite-plugin-svelte` instead.
	 *
	 * */
	export function breferPreprocess(config?: Partial<import("@brefer/shared").BreferConfig> | undefined): import("svelte/compiler").PreprocessorGroup;
}

//# sourceMappingURL=index.d.ts.map