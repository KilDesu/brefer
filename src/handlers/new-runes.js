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
 * @param {import("recast").types.namedTypes.Identifier} callee
 * @returns {boolean}
 */
export function handleStateSubrunes(callee) {
	let hasChanges = false;

	const subrunes = /** @type {const} */ (["$raw", "$snapshot"]);

	for (const subrune of subrunes) {
		if (callee.name !== subrune) continue;

		hasChanges = true;
		callee.name = `$state.${subrune.slice(1)}`;
	}

	return hasChanges;
}
