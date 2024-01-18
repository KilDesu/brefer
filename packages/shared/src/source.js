/**
 * Wraps state values (`s$` prefix) in Svelte's `$state` rune.
 *
 * If the variable has no initialization (e.g. `let s$foo;`), it will be initialized to an empty `$state()`.
 *
 * @param {import("./private.d.ts").ReactiveValue} node - The node to wrap
 * @param {import("magic-string").default} source - The magic string representation of the script content
 */
export function wrapInState(node, source) {
	const [start, end] = node.range;
	const equal = start === end ? " = " : "";
	source.appendLeft(start, `${equal}$state(`);
	source.appendRight(end, ")");
}

/**
 * Wraps derived values (`d$` prefix) in Svelte's `$derived` rune.
 *
 * @param {import("./private.d.ts").ReactiveValue} node - The node to wrap
 * @param {import("magic-string").default} source - The magic string representation of the script content
 */
export function wrapInDerived(node, source) {
	const [start, end] = node.range;
	source.appendLeft(start, `$derived(`);
	source.appendRight(end, ")");
}

/**
 * Wraps effects (`e$` prefix) in Svelte's `$effect` rune.
 *
 * @param {import("./private.d.ts").Effect} node - The node to wrap
 * @param {import("magic-string").default} source - The magic string representation of the script content
 */
export function wrapInEffect(node, source) {
	const start = node.range[0];
	const {
		range: [blockStart, blockEnd],
		type
	} = node.block;

	if (type === "arrow") {
		source.update(start, blockStart, "$effect(");
	} else {
		source.update(start, blockStart, "$effect(() => ");
	}

	source.appendRight(blockEnd, ")");
}

/**
 * Wraps untracked values in Svelte's `$effect` blocks.
 *
 * @param {import("./private.d.ts").ReactiveValue} untrackedValue - The untracked value to wrap
 * @param {import("magic-string").default} source - The magic string representation of the script content
 */
export function wrapUntrackedValue(untrackedValue, source) {
	const [start, end] = untrackedValue.range;

	source.appendLeft(start, "untrack(() => ");
	source.appendRight(end, ")");
}

/**
 * Adds an import from "svelte" of the `untrack` function.
 *
 * @param {import("magic-string").default} source - The magic string representation of the script content
 * @param {import("./public.d.ts").BreferContext} ctx
 * @param {string} [filename] - The name of the preprocessed file
 */
export function addUntrackImport(source, ctx, filename) {
	if (ctx.svelteImports.named.some((namedImport) => namedImport.imported.name === "untrack"))
		return;

	const lastNamedImport = ctx.svelteImports.named.at(-1);

	if (lastNamedImport) {
		source.appendRight(lastNamedImport.range[1], ", untrack");
	} else {
		if (ctx.svelteImports.default) {
			source.appendRight(ctx.svelteImports.default.range[1], ", { untrack }");
		} else {
			// Add a tab for svelte files because the code is inside <script> tags
			const tab = filename?.endsWith(".svelte") ? "\t" : "";

			source.prepend(`\r\n${tab}import { untrack } from "svelte";\r\n`);
		}
	}
}
