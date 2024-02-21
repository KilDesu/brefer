import { types } from "recast";

const {
	SpreadElement,
	ArrowFunctionExpression,
	CallExpression,
	FunctionExpression,
} = types.namedTypes;

/**
 *
 * @param {"untrack" | "static"} rune
 * @param {import("recast").types.namedTypes.CallExpression["arguments"]} args
 * @return {args is (import("recast").types.namedTypes.ExpressionStatement["expression"])[]}
 */
export function validateArgs(rune, args) {
	if (args.length !== 1)
		throw new Error(
			`The \`$${rune}\` rune must take at least, and at most, 1 argument.`
		);

	if (SpreadElement.check(args[0]))
		throw new Error(`The \`$${rune}\` rune doesn't accept spread arguments.`);

	return true;
}

/**
 * Checks wether the given argument is a function expression or not.
 *
 * @param {unknown} arg - The argument passed to the function
 * @return { arg is import("recast").types.namedTypes.ArrowFunctionExpression | import("recast").types.namedTypes.CallExpression | import("recast").types.namedTypes.FunctionExpression }
 */
export function isFunctionArg(arg) {
	const fnChecks = [ArrowFunctionExpression, FunctionExpression];

	return fnChecks.some((fn) => fn.check(arg));
}
