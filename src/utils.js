import { walk } from "estree-walker";

/**
 * Checks wether a node is a reactive variable or not.
 *
 * @export
 * @param {any} node - The node to check
 * @param {string} prefix
 * @return {node is Brefer.Identifier} - Wether the node is a reactive variable or not
 */
export function isReactive(node, prefix) {
	return node.type === "Identifier" && node.name.startsWith(prefix);
}

/**
 * Checks if a given node is an array expression.
 *
 * @export
 * @param {any} node - The node to check.
 * @returns {node is Brefer.ArrayExpression} Returns wether the node is an array expression or not.
 */
export function isArrayExpression(node) {
	return node.type === "ArrayExpression";
}

/**
 * Checks if a given node is an array pattern.
 *
 * @export
 * @param {any} node - The node to check.
 * @returns {node is Brefer.ArrayPattern} Returns wether the node is an array pattern or not.
 */
export function isArrayPattern(node) {
	return node.type === "ArrayPattern";
}

/**
 * Checks if a given node is an object expression.
 *
 * @export
 * @param {any} node - The node to check.
 * @returns {node is Brefer.ObjectExpression} Returns wether the node is an object expression or not.
 */
export function isCallExpression(node) {
	return node.type === "CallExpression";
}

/**
 * Checks if a given node is an identifier.
 *
 * @export
 * @param {any} node - The node to check.
 * @returns {node is Brefer.Identifier} Returns wether the node is an identifier or not.
 */
export function isIdentifier(node) {
	return node.type === "Identifier";
}

/**
 * Checks if a given expression expression depends on reactive variables.
 *
 * @export
 * @param {Brefer.Expression} expression - The expression to check.
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

/**
 * Checks if a given variable is an arrow expression.
 *
 * @export
 * @template T
 * @param {any} variable - The variable to check.
 * @return {variable is () => T} - Wether the variable is an arrow function or not.
 */
export function isArrowFunction(variable) {
	if (typeof variable === "function") {
		const source = variable.toString();
		return /^\([^)]*\)\s*=>/.test(source);
	}

	return false;
}
