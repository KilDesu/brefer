import { walk } from "estree-walker";
import MagicString from "magic-string";
import { isIdentifier } from "../utils.js";

/**
 * Replaces all the prefixes in front of the state and derived variables by the default prefix `r$`.
 *
 * This is important in case the user wants to use `$` as the prefix, because Svelte uses `$` to subscribe to stores.
 *
 * @export
 * @param {Brefer.Node} ast - The AST of the source code
 * @param {MagicString} source - The source code as a MagicString instance
 * @param {Brefer.Context} ctx - Brefer context, containing the prefix and the arrays which store the reactive and derived values as well as the untrack calls
 */
export function cleanup(ast, source, ctx) {
	walk(ast, {
		enter(node) {
			if (isIdentifier(node)) {
				const isReactiveIdentifier = ctx.REACTIVE_VALUES.concat(
					ctx.DERIVED_VALUES
				).some((value) => value.name === node.name);

				if (isReactiveIdentifier && ctx.prefix === "$") {
					source.update(
						node.start,
						node.end,
						node.name.replace(ctx.prefix, "r$")
					);
				}
			}
		},
	});
}
