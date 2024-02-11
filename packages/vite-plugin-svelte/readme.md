# Brefer Vite plugin for preprocessing Svelte 5

## Installation

```bash
npm install -D @brefer/vite-plugin-svelte@next
```

For PNPM and YARN, just replace `npm install` with `pnpm add` or `yarn add` in the command above.

**Warning!** Brefer is not yet ready for production (well, Svelte 5 neither). Expect bugs and breaking changes, as the syntax is not yet entirely decided.

## Usage

### Basic usage

```js
// vite.config.js
import { defineConfig } from "vite";
import { brefer } from "@brefer/vite-plugin-svelte";

export default defineConfig({
	plugins: [brefer()],
});
```

### Options

You can pass options to the plugin. Those options contain 2 properties: `include` and `exclude`. You might already be familiar with them as a lot of other frameworks also use it.

You can check the [documentation](https://rollupjs.org/configuration-options/#watch-exclude) on Rollup's website.

```js
// vite.config.js
import { defineConfig } from "vite";
import { brefer } from "@brefer/vite-plugin-svelte";

export default defineConfig({
	plugins: [
		brefer({
			include: [
				// Files to preprocess
				"src/**/*.svelte",
				"src/**/*.svelte.js",
			],
			exclude: [
				// Files you don't want preprocessed
				"tests/**/*.svelte",
			],
		}),
	],
});
```

## Why use the Vite plugin?

If you plan to use Svelte modules (`.svlete.[js|ts]` files), using the Vite plugin is the way to go as [@brefer/preprocessor](../preprocessor/readme.md) can't preprocess them.

If you don't plan to use them, you might want to use the more basic Svelte preprocessor, which is shipped with the same functionalities but works for `.svelte` files only.

Want to use the preprocessor? [See the documentation.](../preprocessor/readme.md)
