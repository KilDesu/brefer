# Brefer preprocessor for Svelte 5

## Installation

```bash
npm install -D @brefer/preprocessor@next
```

For PNPM and YARN, just replace `npm install` with `pnpm add` or `yarn add` in the command above.

**Warning!** Brefer is not yet ready for production (well, Svelte 5 neither). Expect bugs and breaking changes, as the syntax is not yet entirely decided.

## Usage

```js
// svelte.config.js
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { breferPreprocess } from "@brefer/preprocessor";

export default {
	preprocess: [vitePreprocess(), breferPreprocess()],
};
```

## Why not use the Vite plugin?

If you don't plan to use Svelte modules (`.svlete.[js|ts]` files), using the Vite plugin might be a bit over the top.

In that case, you might want to use the more basic Svelte preprocessor, which is shipped with the same functionalities but doesn't work for Svelte modules.

Still want to use the Vite plugin? [See the documentation.](../vite-plugin-svelte/readme.md)
