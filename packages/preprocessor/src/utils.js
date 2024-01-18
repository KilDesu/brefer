/**
 * @template T
 * @typedef {import("@brefer/shared").BreferNode<T>} BreferNode
 */
/**
 * @typedef {BreferNode<import("estree").Identifier>} Identifier
 * @typedef {BreferNode<import("estree").Expression>} Expression
 * @typedef {import("@brefer/shared").BreferContext} BreferContext
 */

import { isCallExpression, isIdentifier, isReactive } from "@brefer/shared";

/**
 * Adds reactive variables to either `REACTIVE_VALUES` or `DERIVED_VALUES`
 * depending on whether or not the identifier depends on other reactive
 * variables. If the identifier is not reactive, it is ignored.
 *
 * @export
 * @param {Identifier} identifier - The identifier node
 * @param {Expression | null | undefined} initialization - The initialization expression of the identifier
 * @param {BreferContext} ctx - Brefer context, containing the prefix and the arrays which store the reactive and derived values
 */
export function handleIdentifier(identifier, initialization, ctx) {
	if (!isReactive(identifier, ctx)) return;

	// `let s$foo;`
	if (!initialization) {
		const [_, identifierEnd] = identifier.range;

		ctx.REACTIVE_VALUES.push({
			name: identifier.name,
			range: [identifierEnd, identifierEnd]
		});
		return;
	}

	// Ignore the variable if it's already defined with runes
	if (
		isCallExpression(initialization) &&
		isIdentifier(initialization.callee) &&
		["$state", "$derived"].includes(initialization.callee.name)
	)
		return;

	ctx.REACTIVE_VALUES.push({
		name: identifier.name,
		range: initialization.range
	});
}
