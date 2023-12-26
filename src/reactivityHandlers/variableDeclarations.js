import { handleIdentifier } from "../reactivityUtils/index.js";
import { isArrayExpression, isArrayPattern, isIdentifier } from "../utils.js";

/**
 * Handles variable declarations.
 * To encourage clean code, only `let` and `const` declarations are handled.
 *
 * @export
 * @param {Brefer.VariableDeclaration} node - The variable declaration node
 * @param {Brefer.Context} ctx - Brefer context, containing the prefix and the arrays which store the reactive and derived values as well as the untrack calls
 */
export function handleVariableDeclarations(node, ctx) {
	if (node.kind === "var") return;

	node.declarations.forEach((declarator) => {
		if (isIdentifier(declarator.id)) {
			handleIdentifier(
				declarator.id,
				/** @type {Brefer.Expression | null | undefined} */ (declarator.init),
				ctx
			);
		}
	});
}
