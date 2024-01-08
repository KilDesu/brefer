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
		type,
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
 * If the `untrack` function is not imported, it also adds the import statement.
 *
 * @param {import("./private.d.ts").ReactiveValue} untrackedValue - The untracked value to wrap
 * @param {import("magic-string").default} source - The magic string representation of the script content
 * @param {string} [filename] - The name of the preprocessed file
 */
export function wrapUntrackedValue(untrackedValue, source, filename) {
	const tab = filename?.endsWith(".svelte") ? "\t" : "";
	const importToAdd = `import { untrack } from "svelte"`;

	if (!source.toString().includes(importToAdd)) {
		source.prepend(`\r\n${tab}${importToAdd};\r\n`);
	}

	const [start, end] = untrackedValue.range;

	source.appendLeft(start, "untrack(() => ");
	source.appendRight(end, ")");
}
