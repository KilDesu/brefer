# Brefer preprocessor for Svelte 5

## Installation

```bash
npm install -D brefer
```

For PNPM and YARN, just replace `npm install` with `pnpm add` or `yarn add` in the command above.

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

> Prefixing your variables with `r$` makes them reactive.

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
  let r$count = 0;
  let r$double = r$count * 2;
</script>

<button on:click={() => r$count++}>
  clicks: {r$count}
  double: {r$double}
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
    r$count = 0;
    r$double = this.r$count * 2;

    increment() {
      this.r$count++;
    }
  }

  let counter = new Counter();
</script>

<button on:click={() => counter.increment()}>
  clicks: {counter.r$count}
  double: {counter.r$double}
</button>
```

> I somewhat have JQuery flashbacks... I don't want to see `$` everywhere again (not that it wasn't the case with Svelte already)! 😭

### About that...

If you really hate the `r$` prefix, you can change it to something else (like `reactive_` for example) by passing the `prefix` option to the preprocessor:

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
- Svelte's checker will complain about the `$` prefix being reserved so `r$` is the default option for now (any possibility to disable it?)

## Additional features

### `untrack`

Brefer exports an `untrack` function that wraps Svelte's one. The difference between the two is that Brefer's `untrack` function also accepts a value as an argument, not only a callback.

```js
import { untrack } from "brefer";

let r$count = 0;
let r$double = r$count * 2;

$effect(() => {
	console.log(r$count, untrack(r$double)); // Will rerun when r$count changes but not when r$double changes
});
```

## Contribute

If you like the concept and want to contribute, feel free to open an issue or a pull request.
Also, if you have any idea to improve or extend the syntax, I'm all ears!
