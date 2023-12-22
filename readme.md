# Bref preprocessor

## Installation

```bash
npm install -D svelte-bref
```

For PNPM and YARN, just replace `npm` with `pnpm` or `yarn` in the command above.

## Usage

### With only one preprocessor

#### svelte.config.js

```js
import brefPreprocess from "bref-preprocessor";

const config = {
	preprocess: brefPreprocess(),
};
export default config;
```

### With multiple preprocessors

#### svelte.config.js

```js
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import brefPreprocess from "bref-preprocessor";

const config = {
	preprocess: [vitePreprocess(), ...brefPreprocess()],
};
export default config;
```

## What is it?

Bref is a Svelte preprocessor to shorten the new Svelte 5 syntax for handling reactivity (hence the name "Bref", meaning "Brief" in French).

## Why?

What was your reaction when Rich Harris announced that Svelte 4's reactivity, which was as concise as a JS framework reactivity syntax could be, would be abandoned in favor of ~~Vue~~ Runes syntax?
If you were delighted, Bref is probably not for you. Personally, I didn't want to write `$state` and `$derived` everytime I defined a new reactive variable. That's the reason I created this preprocessor.

## Ok but... What is the Bref syntax?

With Bref, I opted for a more straightforward syntax:

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

#### With Bref

```svelte
<script>
  let $count = 0;
  let $double = $count * 2;
</script>

<button on:click={() => $count++}>
  clicks: {count}
  double: {double}
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

#### With Bref

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

If you really hate the `$` prefix, you can change it to something else (like `_` or `myOwnPrefix_` for example) by passing the `prefix` option to the preprocessor:

```js
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import BrefPreprocess from "bref-preprocessor";

const config = {
	preprocess: [vitePreprocess(), ...BrefPreprocess({ prefix: "_" })],
};
export default config;
```

## Typescript

Bref also works with Typescript. In fact, it's an array containing svelte's `typescript()` preprocessor before the real Bref preprocessor.
This is why you have to use the spread operator (`...`) when using Bref with other preprocessors.

## Pros and cons

### Pros

- More concise than Svelte 5's syntax
- Easier to keep track of reactive variables (they all have the same prefix)
- Works with Typescript
- Easy to integrate
- It's a preprocessor, so you can still use Svelte 5's syntax if you want to

### Cons

- You have to use a preprocessor
- Svelte's checker will probably complain about the `$` prefix being reserved (any possibility to disable it?)
- It's harder and more verbose to use Svelte stores (not really a problem as they're kind of deprecated in Svelte 5)

## Contribute

If you like the concept and want to contribute, feel free to open an issue or a pull request.
Also, if you have any idea to improve or extend the syntax, I'm all ears!
