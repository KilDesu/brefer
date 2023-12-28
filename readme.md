# Brefer preprocessor for Svelte 5

## Installation

```bash
npm install -D brefer
```

For PNPM and YARN, just replace `npm install` with `pnpm add` or `yarn add` in the command above.

**Warning!** Brefer is not yet ready for production (as if Svelte 5 was). Expect bugs and a lot of breakings changes, as the syntax is not yet entirely decided.

## Usage

### With only one preprocessor

#### svelte.config.js

```js
import breferPreprocess from "brefer";

const config = {
	preprocess: breferPreprocess(),
};
export default config;
```

### With multiple preprocessors

#### svelte.config.js

```js
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import breferPreprocess from "brefer";

const config = {
	preprocess: [vitePreprocess(), ...breferPreprocess()],
};
export default config;
```

## What is it?

Brefer is a Svelte preprocessor to shorten the new Svelte 5 syntax for handling reactivity (hence the name "Brefer", made from "Bref", meaning "Brief" in French, with the suffix "er", meaning "more" in English).

## Why?

What was your reaction when Rich Harris announced that Svelte 4's reactivity, which was as concise as a JS framework reactivity syntax could be, would be abandoned in favor of ~~Vue~~ Runes syntax?
If you were delighted, Brefer is probably not for you. Personally, I didn't want to write `$state` and `$derived` everytime I defined a new reactive variable. That's the reason I created this preprocessor.

## Ok but... What is the Brefer syntax?

With Brefer, I opted for a more straightforward syntax:

> Prefixing your variables with `$` makes them reactive.

That is really all you have to know (currently).
Is it a `$state`? Is it `$derived`? The preprocessor takes care of it all for you:

> If a reactive variable depends on other reactive variables, it's `$derived`. Otherwise, it's a `$state`.

### Here are some examples

#### With Svelte 5

```svelte
<script>
  let count = $state(0);
  let double = $derived($count * 2)
</script>

<button on:click={() => count++}>
  clicks: {count}
  double: {double}
</button>
```

#### With Brefer

```svelte
<script>
  let $count = 0;
  let $double = $count * 2;
</script>

<button on:click={() => $count++}>
  clicks: {$count}
  double: {$double}
</button>
```

#### With Svelte 5

```svelte
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

<button on:click={() => counter.increment()}>
  clicks: {counter.count}
  double: {counter.double}
</button>
```

#### With Brefer

```svelte
<script>
  class Counter {
    $count = 0;
    $double = this.$count * 2;

    increment() {
      this.$count++;
    }
  }

  let counter = new Counter();
</script>

<button on:click={() => counter.increment()}>
  clicks: {counter.$count}
  double: {counter.$double}
</button>
```

> I somewhat have JQuery flashbacks... I don't want to see `$` everywhere again (not that it wasn't the case with Svelte already)! 😭

### About that...

If you really hate the `$` prefix, you can change it to something else (like `reactive_` for example) by passing the `prefix` option to the preprocessor:

```js
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import breferPreprocess from "brefer";

const config = {
	preprocess: [vitePreprocess(), ...breferPreprocess({ prefix: "reactive_" })],
};
export default config;
```

## Typescript

Brefer also works with Typescript. In fact, it's an array containing svelte's `typescript()` preprocessor before the real Brefer preprocessor.
This is why you have to use the spread operator (`...`) when using Brefer with other preprocessors.

## Pros and cons

### Pros

- More concise than Svelte 5's syntax
- Easier to keep track of reactive variables (they all have the same prefix)
- Works with Typescript
- Easy to integrate
- It's a preprocessor, so you can still use Svelte 5's syntax if you want to

### Cons

- You have to use a preprocessor
- If using the default prefix `$`, it can be confusing if you also use stores (which can be auto-subscribed to with a `$` prefix)
- You can't preprocess js/ts files, as [preprocessors only transform .svelte files](https://kit.svelte.dev/docs/integrations)

## Other features

### $effect

Since Brefer's alpha.5, you can also opt for a shorter way to use `$effect`:

```js
// Svelte 5
let count = $state(1);
$effect(() => {
	console.log(count);
});
// Brefer
let $count = 1;
$: () => {
	console.log($count);
};
```

Even better, you can also specify the values you want to untrack:

```js
// Svelte 5
import { untrack } from "svelte";

let count = $state(1);
let double = $derived(count * 2);
$effect(() => {
	console.log(
		count,
		untrack(() => double)
	);
});
// Brefer
let $count = 1;
let $double = $count * 2;
$: $double, // untracked, values, coma, separated,
	() => {
		console.log($count, $double);
	};
```

## Contribute

If you like the concept and want to contribute, feel free to open an issue or a pull request.
Also, if you have any idea to improve or extend the syntax, I'm all ears!
