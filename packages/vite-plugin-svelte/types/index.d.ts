declare module '@brefer/vite-plugin-svelte' {
	import type { BreferConfig as BreferSharedConfig } from '@brefer/shared';
	export interface BreferConfig extends BreferSharedConfig {
		include?: string[];
		exclude?: string[];
	}
	/**
	 * Brefer vite plugin for svelte. It allows to preprocess .svelte.js files as well as .svelte files.
	 *
	 * Prefer the use of `@brefer/preprocessor` if you want to preprocess .svelte files only.
	 *
	 * */
	export function brefer(config: BreferConfig): import("vite").Plugin;
}

//# sourceMappingURL=index.d.ts.map