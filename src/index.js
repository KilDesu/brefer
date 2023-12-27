/// <reference path="./types.d.ts" />

import typescript from "svelte-preprocess";
import { walk } from "estree-walker";
import { parse } from "acorn";
import MagicString from "magic-string";
import {
	handleClassDeclarations,
	handleVariableDeclarations,
} from "./reactivityHandlers/index.js";
import { cleanup } from "./reactivityUtils/cleanup.js";
import { untrack as untrackSvelte } from "svelte";
import { isArrowFunction } from "./utils.js";

/**
 * Preprocessor for Bref syntax, using `r$` as prefix for reactive variables.
 * It avoids the need to call `$state` and `$derived` runes every time.
 *
 * @param { Brefer.PreprocessorOptions } [options = {}]
 * @returns { import("svelte/compiler").PreprocessorGroup }
 */
const preprocessor = (options) => ({
	name: "brefer",
	async script({ content, filename }) {
		const prefix = options?.prefix || "r$";
		/** @type { Brefer.ReactiveValue[] } */
		const REACTIVE_VALUES = [];
		/** @type { Brefer.DerivedValue[] } */
		const DERIVED_VALUES = [];

		const source = new MagicString(content);

		const ast = /** @type { Brefer.Node } */ (
			parse(content, {
				ecmaVersion: "latest",
				sourceType: "module",
			})
		);

		/** @type {Brefer.Context} */
		const brefOptions = {
			prefix,
			REACTIVE_VALUES,
			DERIVED_VALUES,
		};

		walk(ast, {
			enter(node) {
				if (node.type === "ClassBody") {
					handleClassDeclarations(
						/** @type {Brefer.ClassBody} */ (node),
						brefOptions
					);
				} else if (node.type === "VariableDeclaration") {
					handleVariableDeclarations(
						/** @type { Brefer.VariableDeclaration } */ (node),
						brefOptions
					);
				}
			},
		});

		REACTIVE_VALUES.forEach((val) => {
			const equal = val.start === val.end ? " = " : "";
			source.appendLeft(val.start, `${equal}$state(`);
			source.appendRight(val.end, `)`);
		});

		DERIVED_VALUES.forEach((val) => {
			source.appendLeft(val.start, `$derived(`);
			source.appendRight(val.end, `)`);
		});

		cleanup(ast, source, brefOptions);

		return {
			code: source.toString(),
			map: source.generateMap({ hires: true }),
			filename,
		};
	},
});

/**
 * Preprocessor for Bref syntax, using `$` as prefix for reactive variables.
 * It avoids the need to call `$state` and `$derived` runes every time.
 *
 * @export
 * @param { Brefer.PreprocessorOptions } [options = {}] - The options for the preprocessor
 * @returns { import("svelte/compiler").PreprocessorGroup[] } - The Svelte preprocessor
 */
export default (options) => [typescript(), preprocessor(options)];

/**
 * Use untrack to prevent something from being treated as an $effect/$derived dependency.
 *
 * This version wraps Svelte's [untrack](https://svelte-5-preview.vercel.app/docs/functions#untrack) function to allow raw states to be passed as a parameter.
 *
 * @template T
 * @overload
 * @param { () => T } value - The function to untrack
 * @returns { T } - The value returned by the function
 */
/**
 * @template T
 * @overload
 * @param { T } value - The value to untrack
 * @returns { T } - The value
 */
/**
 * @export
 * @template T
 * @param { T | (() => T) } value - The value to untrack
 * @returns { T } - The value
 */
export function untrack(value) {
	return isArrowFunction(value)
		? untrackSvelte(value)
		: untrackSvelte(() => value);
}
