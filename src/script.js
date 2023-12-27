import { parse } from "acorn";
import { walk } from "estree-walker";
import {
	handleClassDeclarations,
	handleVariableDeclarations,
} from "./reactivityHandlers/index.js";
import { cleanup } from "./reactivityUtils/index.js";
import MagicString from "magic-string";

/**
 * Handles the script content of the Svelte file.
 *
 * @export
 * @param {string} content - The script content
 * @param {Brefer.Context} ctx - Brefer context, containing the prefix and the arrays which store the reactive and derived values
 * @returns {Promise<string>} - The new code
 */
export async function handleScript(content, ctx) {
	const source = new MagicString(content);

	const ast = /** @type { Brefer.Node } */ (
		parse(content, {
			ecmaVersion: "latest",
			sourceType: "module",
		})
	);

	walk(ast, {
		enter(node) {
			if (node.type === "ClassBody") {
				handleClassDeclarations(/** @type {Brefer.ClassBody} */ (node), ctx);
			} else if (node.type === "VariableDeclaration") {
				handleVariableDeclarations(
					/** @type { Brefer.VariableDeclaration } */ (node),
					ctx
				);
			}
		},
	});

	ctx.REACTIVE_VALUES.forEach((val) => {
		const equal = val.start === val.end ? " = " : "";
		source.appendLeft(val.start, `${equal}$state(`);
		source.appendRight(val.end, `)`);
	});

	ctx.DERIVED_VALUES.forEach((val) => {
		source.appendLeft(val.start, `$derived(`);
		source.appendRight(val.end, `)`);
	});

	cleanup(ast, source, ctx);

	return source.toString();
}
