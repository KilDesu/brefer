/** STATE RELATED */

type Primitive = string | number | boolean | null | undefined;

type TypedArray =
	| Int8Array
	| Uint8Array
	| Uint8ClampedArray
	| Int16Array
	| Uint16Array
	| Int32Array
	| Uint32Array
	| Float32Array
	| Float64Array
	| BigInt64Array
	| BigUint64Array;

/** The things that `structuredClone` can handle — https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm */
type Cloneable =
	| ArrayBuffer
	| DataView
	| Date
	| Error
	| Map<any, any>
	| RegExp
	| Set<any>
	| TypedArray
	// web APIs
	| Blob
	| CryptoKey
	| DOMException
	| DOMMatrix
	| DOMMatrixReadOnly
	| DOMPoint
	| DOMPointReadOnly
	| DOMQuad
	| DOMRect
	| DOMRectReadOnly
	| File
	| FileList
	| FileSystemDirectoryHandle
	| FileSystemFileHandle
	| FileSystemHandle
	| ImageBitmap
	| ImageData
	| RTCCertificate
	| VideoFrame;

/** Turn `SvelteDate`, `SvelteMap` and `SvelteSet` into their non-reactive counterparts. (`URL` is uncloneable.) */
type NonReactive<T> = T extends Date
	? Date
	: T extends Map<infer K, infer V>
		? Map<K, V>
		: T extends Set<infer K>
			? Set<K>
			: T;

type Snapshot<T> = T extends Primitive
	? T
	: T extends Cloneable
		? NonReactive<T>
		: T extends { toJSON(): infer R }
			? R
			: T extends Array<infer U>
				? Array<Snapshot<U>>
				: T extends object
					? T extends { [key: string]: any }
						? { [K in keyof T]: Snapshot<T[K]> }
						: never
					: never;

/**
 * Use `$static` to define non-reactive variables, i.e that shouldn't be considered `$state` variables.
 *
 * You can also define your variables with the `var` keyword, which will be considered non-reactive but will still be preprocessed to use the `let` keyword in the final code.
 */
declare function $static<T>(value: T): T;

/**
 * Corresponds to Svelte 5's `$state.raw` rune.
 *
 * Declares state that is _not_ made deeply reactive — instead of mutating it,
 * you must reassign it.
 *
 * Example:
 * ```ts
 * <script>
 *   let items = $raw([0]);
 *
 *   const addItem = () => {
 *     items = [...items, items.length];
 *   };
 * </script>
 *
 * <button on:click={addItem}>
 *   {items.join(', ')}
 * </button>
 * ```
 *
 * https://svelte-5-preview.vercel.app/docs/runes#$state-raw
 *
 * @param initial The initial value
 */
declare function $raw<T>(initial: T): T;
declare function $raw<T>(): T | undefined;

/**
 * Corresponds to Svelte 5's `$state.snapshot` rune.
 *
 * To take a static snapshot of a deeply reactive `$state` proxy, use `$state.snapshot`:
 *
 * Example:
 * ```ts
 * <script>
 *   let counter = { count: 0 };
 *
 *   function onclick() {
 *     // Will log `{ count: ... }` rather than `Proxy { ... }`
 *     console.log($snapshot(counter));
 *   };
 * </script>
 * ```
 *
 * https://svelte-5-preview.vercel.app/docs/runes#$state.snapshot
 *
 * @param state The value to snapshot
 */
declare function $snapshot<T>(state: T): Snapshot<T>;

/** DERIVED RELATED */

/**
 * Corresponds to Svelte 5's `$derived` rune. If a function is passed as an argument, `$derived.by` will be used instead.
 *
 * Declares derived state, i.e. one that depends on other state variables.
 * The expression inside `$(...)` should be free of side-effects.
 *
 * Example:
 * ```ts
 * let double = $(count * 2);
 * ```
 *
 * https://svelte-5-preview.vercel.app/docs/runes#$derived
 *
 * @param expression The derived state expression
 */
declare function $<T>(expression: T): T;
/**
 * Corresponds to Svelte 5's `$derived` rune. If a function is passed as an argument, `$derived.by` will be used instead.
 *
 * Declares derived state, i.e. one that depends on other state variables.
 * The expression inside `$(...)` should be free of side-effects.
 *
 * Example:
 * ```ts
 * let double = $(() => {
 *   // complicated code here
 *   return count * 2
 * });
 * ```
 *
 * https://svelte-5-preview.vercel.app/docs/runes#$derived
 *
 * @param expression The derived state function
 */
declare function $<T>(fn: () => T): T;

/** EFFECT RELATED */

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
	 * Corresponds to Svelte 5's `$effect.tracking` rune.
	 *
	 * The `$$.tracking` rune is an advanced feature that tells you whether or not the code is running inside a tracking context, such as an effect or inside your template.
	 *
	 * Example:
	 * ```svelte
	 * <script>
	 *   console.log('in component setup:', $$.tracking()); // false
	 *
	 *   $effect(() => {
	 *     console.log('in effect:', $$.tracking()); // true
	 *   });
	 * </script>
	 *
	 * <p>in template: {$$.tracking()}</p> <!-- true -->
	 * ```
	 *
	 * This allows you to (for example) add things like subscriptions without causing memory leaks, by putting them in child effects.
	 *
	 * https://svelte-5-preview.vercel.app/docs/runes#$effect-tracking
	 */
	export function tracking(): boolean;

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
/**
 * Use `$untrack` to prevent something from being treated as an `$effect`/`$derived` dependency.
 *
 * https://svelte-5-preview.vercel.app/docs/functions#untrack
 */
declare function $untrack<T>(fn: () => T): T;
