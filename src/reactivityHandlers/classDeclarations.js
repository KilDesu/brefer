import { handleIdentifier } from "../reactivityUtils/index.js";
import { isIdentifier } from "../utils.js";

/**
 * Handles class property declarations.
 *
 * @export
 * @param {Bref.ClassBody} node - The class body node.
 * @param {Bref.Options} options - Bref options, containing the prefix and the arrays which store the reactive and derived values
 * @example
 * ```js
 * class Foo {
 *   $foo = "bar";
 *   $baz;
 * }
 * ```
 * Will result in:
 * ```js
 * class Foo {
 *  $foo = $state("bar");
 *  $baz = $state();
 * }
 */
export function handleClassDeclarations(node, options) {
	for (const property of node.body) {
		if (property.type !== "PropertyDefinition") continue;

		if (isIdentifier(property.key)) {
			handleIdentifier(
				property.key,
				/** @type {Bref.Expression | null | undefined} */ (property.value),
				options
			);
		}
	}
}
