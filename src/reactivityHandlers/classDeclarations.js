import { handleIdentifier } from "../reactivityUtils/index.js";
import { isIdentifier } from "../utils.js";

/**
 * Handles class property declarations.
 *
 * @export
 * @param {Brefer.ClassBody} node - The class body node.
 * @param {Brefer.Context} ctx - Brefer context, containing the prefix and the arrays which store the reactive and derived values as well as the untrack calls
 * @example
 * ```js
 * class Foo {
 *   r$foo = "bar";
 *   r$baz;
 *   r$qux = `Hello, ${r$foo}!`
 * }
 * ```
 * Will result in:
 * ```js
 * class Foo {
 *   r$foo = $state("bar");
 *   r$baz = $state();
 *   r$qux = $derived(`Hello, ${r$foo}!`);
 * }
 * ```
 */
export function handleClassDeclarations(node, ctx) {
	for (const property of node.body) {
		if (property.type !== "PropertyDefinition") continue;

		if (isIdentifier(property.key)) {
			handleIdentifier(
				property.key,
				/** @type {Brefer.Expression | null | undefined} */ (property.value),
				ctx
			);
		}
	}
}
