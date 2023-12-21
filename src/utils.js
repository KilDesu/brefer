import { walk } from "estree-walker";

/**
 * Checks wether a node is a reactive variable or not.
 *
 * @export
 * @param {any} node - The node to check
 * @param {string} prefix
 * @return {node is Bref.Identifier} - Wether the node is a reactive variable or not
 */
export function isReactive(node, prefix) {
	return node.type === "Identifier" && node.name.startsWith(prefix);
}

/**
 * Checks if a given node is an array expression.
 *
 * @export
 * @param {any} node - The node to check.
 * @returns {node is Bref.ArrayExpression} Returns wether the node is an array expression or not.
 */
export function isArrayExpression(node) {
	return node.type === "ArrayExpression";
}

/**
 * Checks if a given node is an array pattern.
 *
 * @export
 * @param {any} node - The node to check.
 * @returns {node is Bref.ArrayPattern} Returns wether the node is an array pattern or not.
 */
export function isArrayPattern(node) {
	return node.type === "ArrayPattern";
}

/**
 * Checks if a given node is an identifier.
 *
 * @export
 * @param {any} node - The node to check.
 * @returns {node is Bref.Identifier} Returns wether the node is an identifier or not.
 */
export function isIdentifier(node) {
	return node.type === "Identifier";
}

/**
 * Checks if a given expression expression depends on reactive variables.
 *
 * @export
 * @param {Bref.Expression} expression - The expression to check.
 * @param {string} prefix - The prefix to use for reactive variables.
 * @param {string[]} dependencies - The dependencies to check.
 * @return {string[]} - The dependencies of the expression.
 */
export function getReactiveDependencies(expression, prefix, dependencies = []) {
	walk(expression, {
		enter(expression) {
			if (isReactive(expression, prefix)) {
				dependencies.push(expression.name);
			}
		},
	});

	return dependencies;
}
