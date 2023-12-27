import { handleIdentifier } from "../reactivityUtils/index.js";
import { isIdentifier } from "../utils.js";

/**
 * Handles class property declarations.
 *
 * @export
 * @param {Brefer.ClassBody} node - The class body node.
 * @param {Brefer.Context} ctx - Brefer context, containing the prefix and the arrays which store the reactive and derived values
 * @example
 * ```js
 * class Foo {
 *   $foo = "bar";
 *   $baz;
 *   $qux = `Hello, ${$foo}!`
 * }
 * ```
 * Will result in:
 * ```js
 * class Foo {
 *   $foo = $state("bar");
 *   $baz = $state();
 *   $qux = $derived(`Hello, ${$foo}!`);
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
