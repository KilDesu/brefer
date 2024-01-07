/**
 * @template T
 * @typedef {import("@brefer/shared").BreferNode<T>} BreferNode
 */
/**
 * @typedef {import("@brefer/shared").BreferContext} BreferContext
 * @typedef {BreferNode<import("estree").ClassBody>} ClassBody
 * @typedef {BreferNode<import("estree").Expression>} Expression
 * @typedef {BreferNode<import("estree").VariableDeclaration>} VariableDeclaration
 */

import { isIdentifier } from "@brefer/shared";
import { handleIdentifier } from "../utils.js";

/**
 * Handles class property declarations.
 *
 * @export
 * @param {ClassBody} node - The class body node.
 * @param {BreferContext} ctx - Brefer context, containing the prefix and the arrays which store the reactive and derived values
 * @example
 * ```js
 * class Foo {
 *   s$foo = "bar";
 *   s$baz;
 *   d$qux = `Hello, ${s$foo}!`
 * }
 * ```
 * Will result in:
 * ```js
 * class Foo {
 *   s$foo = $state("bar");
 *   s$baz = $state();
 *   d$qux = $derived(`Hello, ${s$foo}!`);
 * }
 * ```
 */
export function handleClassDeclaration(node, ctx) {
	for (const property of node.body) {
		if (property.type !== "PropertyDefinition") continue;

		if (isIdentifier(property.key)) {
			handleIdentifier(
				property.key,
				/** @type {Expression | null | undefined} */ (property.value),
				ctx
			);
		}
	}
}

/**
 * Handles variable declarations.
 * To encourage clean code, only `let` and `const` declarations are handled.
 *
 * @export
 * @param {VariableDeclaration} node - The variable declaration node
 * @param {BreferContext} ctx - Brefer context, containing the prefix and the arrays which store the reactive and derived values
 */
export function handleVariableDeclaration(node, ctx) {
	if (node.kind === "var") return;

	node.declarations.forEach((declaration) => {
		if (isIdentifier(declaration.id)) {
			handleIdentifier(
				declaration.id,
				/** @type {Expression | null | undefined} */ (declaration.init),
				ctx
			);
		}
	});
}
