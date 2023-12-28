/// <reference path="./types.d.ts" />

import typescript from "svelte-preprocess";
import { walk } from "estree-walker";
import { parse as parseSvelte } from "svelte/compiler";
import MagicString from "magic-string";
import { isIdentifier, isReactiveIdentifier } from "./utils.js";
import { handleScript } from "./script.js";

/**
 * Preprocessor for Bref syntax, using `$` as prefix for reactive variables.
 * It avoids the need to call `$state` and `$derived` runes every time.
 *
 * @param { Brefer.PreprocessorOptions } [options = {}]
 * @returns { import("svelte/compiler").PreprocessorGroup }
 */
const preprocessor = (options) => ({
	name: "brefer",
	async markup({ content, filename }) {
		/** @type {Brefer.Context} */
		const ctx = {
			prefix: options?.prefix || "$",
			REACTIVE_VALUES: [],
			DERIVED_VALUES: [],
			TO_RENAME_ONLY: [],
		};

		const source = new MagicString(content);

		const ast = /** @type { Brefer.Root }} */ (
			await parseSvelte(content, { filename })
		);

		if (!ast.instance) {
			return {
				code: content,
				dependencies: [],
			};
		}

		const scriptContent = /** @type {Brefer.Program} */ (ast.instance.content);
		let scriptString = content.slice(scriptContent.start, scriptContent.end);

		const newScript = await handleScript(scriptString, ctx);
		source.update(scriptContent.start, scriptContent.end, newScript);

		const html = ast.html;

		walk(html, {
			enter(node) {
				if (isIdentifier(node)) {
					if (isReactiveIdentifier(node, ctx) && ctx.prefix === "$") {
						source.update(
							node.start,
							node.end,
							node.name.replace(ctx.prefix, "r$")
						);
					}
				}
			},
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
 * @param { Brefer.PreprocessorOptions } [options = {}] - The options for the preprocessor
 * @returns { import("svelte/compiler").PreprocessorGroup[] } - The Svelte preprocessor
 */
export default (options) => [typescript(), preprocessor(options)];
