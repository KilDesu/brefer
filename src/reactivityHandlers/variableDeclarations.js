import {
	handleArrayDestructuring,
	handleIdentifier,
} from "../reactivityUtils/index.js";
import { isArrayExpression, isArrayPattern, isIdentifier } from "../utils.js";

/**
 * Handles variable declarations.
 * To encourage clean code, only `let` declarations are handled.
 *
 * @export
 * @param {Bref.VariableDeclaration} node - The variable declaration node
 * @param {Bref.Options} options - Bref options, containing the prefix and the arrays which store the reactive and derived values
 */
export function handleVariableDeclarations(node, options) {
	if (node.kind !== "let") return;

	node.declarations.forEach((declarator) => {
		if (isArrayPattern(declarator.id) && isArrayExpression(declarator.init)) {
			handleArrayDestructuring(declarator.id, declarator.init, options);
		} else if (isIdentifier(declarator.id)) {
			handleIdentifier(
				declarator.id,
				/** @type {Bref.Expression | null | undefined} */ (declarator.init),
				options
			);
		}
	});
}
