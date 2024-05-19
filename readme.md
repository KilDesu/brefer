# Brefer project for Svelte 5 preprocessing

## What is it?

Brefer is a preprocessor to shorten the new Svelte 5 syntax for handling reactivity (hence the name "Brefer", made from "Bref" which means "Brief" in French and the suffix "er", which means "more").

## Installation

```bash
npm install -D brefer@next
```

For PNPM and YARN, just replace `npm install` with `pnpm add` or `yarn add` in the commands above.

**Warning!** Brefer is not yet ready for production (well, Svelte 5 neither). Expect bugs and breaking changes, as the syntax is not yet entirely decided.

## Usage

### Basic usage

To avoid having Svelte's compiler shout at you for using "illegal variable names" (because Brefer uses `$` and `$$` variables), you have to add the preprocessor to your `svelte.config.js`, even if you want to use the Vite plugin alone:

```js
// svelte.config.js
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { breferPreprocess } from "brefer";

export default {
	preprocess: [vitePreprocess(), breferPreprocess()]
};
```

If you don't want to use a Vite plugin and rather use Svelte's preprocess API, you can stop your configuration here and [skip to the next paragraph](#why).

The Brefer's Vite plugin allows you to preprocess Svelte modules (`.svelte.js` files) as well as standard `.svelte` files.

```js
// vite.config.js
import { defineConfig } from "vite";
import { brefer } from "brefer";

export default defineConfig({
	// If you use other preprocessors, put brefer first
	plugins: [brefer()]
});
```

### Options

You can pass options to the plugin. Those options contain 2 properties: `include` and `exclude`. You might already be familiar with them as a lot of other frameworks also use it.

You can check the [documentation](https://rollupjs.org/configuration-options/#watch-exclude) on Rollup's website.

```js
// vite.config.js
import { defineConfig } from "vite";
import { brefer } from "brefer";

export default defineConfig({
	plugins: [
		brefer({
			include: [
				// Files to preprocess
				"src/**/*.svelte",
				"src/**/*.svelte.js"
			],
			exclude: [
				// Files you don't want preprocessed
				"tests/**/*.svelte"
			]
		})
	]
});
```

## Why?

What was your reaction when Rich Harris announced that Svelte 4's reactivity, which was as concise as a JS framework reactivity syntax could be, would be abandoned in favor of ~~Vue~~ Runes syntax?
If you were delighted, Brefer is probably not for you. Personally, I didn't want to write `$state` and `$derived` everytime I defined a new reactive variable. That's the reason I started this project.

## Ok but... What is the Brefer syntax?

With Brefer, I opted for a more straightforward syntax:

> Variables defined with `let` are reactive by default

> Using the rune `$(...)` creates `$derived` values

> Using the rune `$$(() => {...})` creates `$effect` expressions

> All subrunes for `$effect` (like `$effect.root` for example) are usable with `$$`

That is (almost) all you have to know.

### Here are some examples

<table>
<tr>
	<td><b>With Svelte 5</b></td>
	<td><b>With Brefer</b></td>
</tr>
<tr>
<td>
	
```html
<script>
	let count = $state(0);
	let double = $derived($count * 2);
</script>

<button onclick="{() => count++}">
clicks: {count} / double: {double}
</button>

````

</td>
<td>

```html
<script>
let count = 0;
let double = $(count * 2);
</script>

<button onclick="{() => count++}">
	clicks: {count} / double: {double}
</button>
````

</td>
</tr>
<tr>
<td>

```html
<script>
	class Counter {
		count = $state(0);
		double = $derived(this.count * 2);

		increment() {
			this.count++;
		}
	}

	let counter = new Counter();
</script>

<button onclick="{() => counter.increment()}">
	clicks: {counter.count} / double: {counter.double}
</button>
```

</td>
<td>

```html
<script>
	class Counter {
		count = 0;
		double = $(this.count * 2);

		increment() {
			this.count++;
		}
	}

	let counter = new Counter();
</script>

<button onclick="{() => counter.increment()}">
	clicks: {counter.count} / double: {counter.double}
</button>
```

</td>
</tr>
</table>

## Typescript

Brefer supports typescript out of the box as it uses [@babel/parser](https://babeljs.io/docs/babel-parser) to parse the script content of `.svelte` files and `.svelte.[js|ts]` modules.

## Other features

### Defining non-reactive variables

To define non-reactive variables, you have 2 choices:

- Use the `var` or `const` keywords

  > This choice is better for everyday use, e.g for temporary variables or loops

  **NB:** if you use the `var` keyword, Brefer will preprocess it to use `let` instead

- Use the `$static` rune

  > This choice if better for when the first one can't be used, e.g for class properties, which are defined without any keyword

### `$derived.by`

Brefer takes care of figuring out if you're using a function or an expression inside the `$(...)` rune and will preprocess it to `$derived` or `$derived.by` depending on the result.

For very rare edges cases, this could cause bugs, especially with nested callbacks. As an example, if you do that:

```js
function foo() {
	return () => "bar";
}

let fizz = $(foo());
```

Brefer will think you're trying to use an expression and will preprocess it to `let fizz = $derived(foo())` even if `$derived.by` should be used.

Keep that in mind if you don't want to waste hours trying to debug your non-working code.

NB: This bug can also occure with the `$untrack` rune, so watch out.

### The `$untrack` rune

Brefer exposes an `$untrack` rune so you don't have to `import { untrack } from "svelte"` everytime. Brefer takes care of it all.

Moreover, you can pass reactive variables to `$untrack` as a reference, no need to wrap it inside an arrow function. However, keep the problem mentionned in [the previous paragraph](#derivedby) about the potential bugs that it could cause.

<table>
<tr>
<td><b>Svelte 5</b></td>
<td><b>Brefer</b></td>
</tr>
<tr>
<td>

```js
import { untrack } from "svelte";

let count = $state(1);
let double = $derived(count * 2);

const cleanup = $effect.root(() => {
	console.log(
		count,
		untrack(() => double)
	);

	return () => {
		console.log("cleanup");
	};
});
```

</td>
<td>

```js
let count = 1;
let double = $(count * 2);

const cleanup = $$.root(() => {
	console.log(count, $untrack(double));

	return () => {
		console.log("cleanup");
	};
});
```

</td>
</tr>
</table>

### The `$frozen` rune

To be able to define variables with `$state.frozen` given the shorten syntax for `$state`'s, Brefer exposes a `$frozen` rune.

Use it just as you would use `$state.frozen`.

## Pros and cons

### Pros

- More concise than Svelte 5's syntax
- Works with Typescript
- Easy to integrate
- It's a preprocessor, so you can still use Svelte 5's syntax if you want to
- Can preprocess svelte modules (`.svelte.[js|ts]`)

### Cons

- You have to use a preprocessor
- Some rare edge cases might induce bugs, especially when deep nested functions are involved
- Even if you want to use the Vite plugin alone, you still have to put `breferPreprocess` in your Svelte config for the linter to understand

## Contribute

If you like the concept and want to contribute, feel free to open an issue or a pull request.
Also, if you have any idea to improve or extend the syntax, I'm all ears!
