import { validateArgs } from "./utils.js";

/**
 *
 * @param {import("recast").types.namedTypes.CallExpression} init
 */
export function handleStatic(init) {
	const args = init.arguments;

	validateArgs("static", args);

	return /** @type { import("recast").types.namedTypes.ExpressionStatement["expression"] | null } */ (
		args.length ? args[0] : null
	);
}

/**
 *
 * @param {import("recast").types.namedTypes.CallExpression} node
 */
export function handleFrozen(node) {
	/** @type {import("recast").types.namedTypes.Identifier} */ (
		node.callee
	).name = "$state.frozen";
}
