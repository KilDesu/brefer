/// <reference path="./types.d.ts" />

import typescript from "svelte-preprocess";
import { walk } from "estree-walker";
import { parse } from "acorn";
import MagicString from "magic-string";
import {
	handleClassDeclarations,
	handleVariableDeclarations,
} from "./reactivityHandlers/index.js";

/**
 * Preprocessor for Bref syntax, using `$` as prefix for reactive variables.
 * It avoids the need to call `$state` and `$derived` runes every time.
 *
 * @param { Bref.PreprocessorOptions } [options = {}]
 * @returns { import("svelte/compiler").PreprocessorGroup }
 */
const preprocessor = (options) => ({
	name: "bref",
	async script({ content, filename, attributes, markup }) {
		const prefix = options?.prefix || "$";
		/** @type { Bref.ReactiveValue[] } */
		const REACTIVE_VALUES = [];
		/** @type { Bref.DerivedValue[] } */
		const DERIVED_VALUES = [];

		const source = new MagicString(content);

		const ast = /** @type { Bref.Node } */ (
			parse(content, {
				ecmaVersion: "latest",
			})
		);

		const brefOptions = {
			prefix,
			REACTIVE_VALUES,
			DERIVED_VALUES,
		};

		walk(ast, {
			enter(node) {
				if (node.type === "ClassBody") {
					handleClassDeclarations(
						/** @type {Bref.ClassBody} */ (node),
						brefOptions
					);
				} else if (node.type === "VariableDeclaration") {
					handleVariableDeclarations(
						/** @type { Bref.VariableDeclaration } */ (node),
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
 * @param { Bref.PreprocessorOptions } [options = {}] - The options for the preprocessor
 * @returns { import("svelte/compiler").PreprocessorGroup[] } - The Svelte preprocessor
 */
export default (options) => [typescript(), preprocessor(options)];
