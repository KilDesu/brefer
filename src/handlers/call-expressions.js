import { types } from "recast";
import { isFunctionArg } from "./utils.js";

const { Identifier, MemberExpression } = types.namedTypes;

/**
 *
 * @param {import("recast").types.namedTypes.Identifier} callee
 * @param {import("recast").types.namedTypes.CallExpression["arguments"]} args
 */
export function handleDerived(callee, args) {
	if (args.length !== 1) {
		throw new Error("Derived values must have at least, and at most, 1 argument.");
	}

	if (isFunctionArg(args[0]) || Identifier.check(args[0])) {
		callee.name = "$derived.by";
	} else {
		callee.name = "$derived";
	}
}

/**
 *
 * @param {import("recast").types.namedTypes.CallExpression} node
 */
export function handleEffect(node) {
	let callee;
	if (MemberExpression.check(node.callee)) {
		callee = node.callee.object;
	} else {
		callee = node.callee;
	}

	if (Identifier.check(callee) && callee.name === "$$") {
		callee.name = "$effect";
	}
}

/**
 *
 * @param {import("recast").types.namedTypes.CallExpression} init
 * @param {({handleStatic: () => void, handleState: () => void})} callbacks
 */
export function handleCallExpression(init, callbacks) {
	const toIgnore = "$state, $derived, $effect".split(", ");
	const { callee, arguments: args } = init;

	if (Identifier.check(callee)) {
		if (toIgnore.includes(callee.name)) return;
		const { name } = callee;

		if (name === "$static") {
			callbacks.handleStatic();
			return;
		} else if (name === "$") {
			handleDerived(callee, args);
			return;
		} else if (name === "$$") {
			return;
		} else if (name === "$frozen") {
			callee.name = "$state.frozen";
			return;
		}
	} else if (
		MemberExpression.check(callee) &&
		Identifier.check(callee.object) &&
		callee.object.name === "$$"
	) {
		return;
	}

	callbacks.handleState();
}
