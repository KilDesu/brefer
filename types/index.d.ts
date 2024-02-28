declare module 'brefer' {
	export interface BreferConfig {
		include?: string[];
		exclude?: string[];
	}
	/**
	 * Preprocessor for Brefer syntax, using variable prefixes to handle reactivity.
	 * It avoids the need to call `$state`, `$derived` or `$effect` runes every time.
	 *
	 * If you also want to preprocess .svelte.js files, use `brefer` instead.
	 *
	 * */
	export function breferPreprocess(): import("svelte/compiler").PreprocessorGroup;
	/**
	 * Brefer vite plugin for svelte. It allows to preprocess .svelte.js files as well as .svelte files.
	 *
	 * Prefer the use of `breferPreprocess` if you want to preprocess .svelte files only.
	 *
	 * */
	export function brefer(config?: BreferConfig): import("vite").Plugin;
}/**
 * Corresponds to Svelte 5's `$derived` rune. If a function is passed as an argument, `$derived.by` will be used instead.
 *
 * Declares derived state, i.e. one that depends on other state variables.
 * The expression inside `$(...)` should be free of side-effects.
 *
 * Example:
 * ```ts
 * let double = $derived(count * 2);
 * ```
 *
 * https://svelte-5-preview.vercel.app/docs/runes#$derived
 *
 * @param expression The derived state expression
 */
declare function $<T>(expression: T): T;
declare function $<T>(fn: () => T): T;

/**
 * Corresponds to Svelte 5's `$effect` rune.
 *
 * Runs code when a component is mounted to the DOM, and then whenever its dependencies change, i.e. `$state` or `$derived` values.
 * The timing of the execution is after the DOM has been updated.
 *
 * Example:
 * ```ts
 * $$(() => console.log('The count is now ' + count));
 * ```
 *
 * If you return a function from the effect, it will be called right before the effect is run again, or when the component is unmounted.
 *
 * Does not run during server side rendering.
 *
 * https://svelte-5-preview.vercel.app/docs/runes#$effect
 * @param fn The function to execute
 */
declare function $$(fn: () => void | (() => void)): void;

declare namespace $$ {
	/**
	 * Corresponds to Svelte 5's `$effect.pre` rune.
	 *
	 * Runs code right before a component is mounted to the DOM, and then whenever its dependencies change, i.e. `$state` or `$derived` values.
	 * The timing of the execution is right before the DOM is updated.
	 *
	 * Example:
	 * ```ts
	 * $$.pre(() => console.log('The count is now ' + count));
	 * ```
	 *
	 * If you return a function from the effect, it will be called right before the effect is run again, or when the component is unmounted.
	 *
	 * Does not run during server side rendering.
	 *
	 * https://svelte-5-preview.vercel.app/docs/runes#$effect-pre
	 * @param fn The function to execute
	 */
	export function pre(fn: () => void | (() => void)): void;

	/**
	 * Corresponds to Svelte 5's `$effect.active` rune.
	 *
	 * The `$$.active` rune is an advanced feature that tells you whether or not the code is running inside an effect or inside your template.
	 *
	 * Example:
	 * ```svelte
	 * <script>
	 *   console.log('in component setup:', $$.active()); // false
	 *
	 *   $$(() => {
	 *     console.log('in effect:', $$.active()); // true
	 *   });
	 * </script>
	 *
	 * <p>in template: {$$.active()}</p> <!-- true -->
	 * ```
	 *
	 * This allows you to (for example) add things like subscriptions without causing memory leaks, by putting them in child effects.
	 *
	 * https://svelte-5-preview.vercel.app/docs/runes#$effect-active
	 */
	export function active(): boolean;

	/**
	 * Corresponds to Svelte 5's `$effect.root` rune.
	 *
	 * The `$$.root` rune is an advanced feature that creates a non-tracked scope that doesn't auto-cleanup. This is useful for
	 * nested effects that you want to manually control. This rune also allows for creation of effects outside of the component
	 * initialisation phase.
	 *
	 * Example:
	 * ```svelte
	 * <script>
	 *   let count = $state(0);
	 *
	 *   const cleanup = $$.root(() => {
	 *	    $$(() => {
	 *				console.log(count);
	 *			})
	 *
	 *      return () => {
	 *        console.log('effect root cleanup');
	 * 			}
	 *   });
	 * </script>
	 *
	 * <button onclick={() => cleanup()}>cleanup</button>
	 * ```
	 *
	 * https://svelte-5-preview.vercel.app/docs/runes#$effect-root
	 */
	export function root(fn: () => void | (() => void)): () => void;
}

/**
 * Use `$untrack` to prevent something from being treated as an `$effect`/`$derived` dependency.
 *
 * https://svelte-5-preview.vercel.app/docs/functions#untrack
 */
declare function $untrack<T>(value: T): T;
declare function $untrack<T>(fn: () => T): T;

/**
 * Use `$static` to define non-reactive variables, i.e that shouldn't be considered `$state` variables.
 *
 * You can also define your variables with the `var` keyword, which will be considered non-reactive but will still be preprocessed to use the `let` keyword in the final code.
 */
declare function $static<T>(value: T): T;

/**
 * Corresponds to Svelte 5's `$state.frozen` rune.
 *
 * Declares reactive read-only state that is shallowly immutable.
 *
 * Example:
 * ```ts
 * <script>
 *   let items = $frozen([0]);
 *
 *   const addItem = () => {
 *     items = [...items, items.length];
 *   };
 * </script>
 *
 * <button onclick={addItem}>
 *   {items.join(', ')}
 * </button>
 * ```
 *
 * https://svelte-5-preview.vercel.app/docs/runes#$state-raw
 *
 * @param initial The initial value
 */
declare function $frozen<T>(initial: T): Readonly<T>;
declare function $frozen<T>(): Readonly<T> | undefined;

//# sourceMappingURL=index.d.ts.map