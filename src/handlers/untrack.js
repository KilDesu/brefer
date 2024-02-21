import { types } from "recast";
import { isFunctionArg, validateArgs } from "./utils.js";

const { ImportDeclaration, ImportSpecifier } = types.namedTypes;

const {
	importDeclaration,
	importSpecifier,
	identifier,
	stringLiteral,
	arrowFunctionExpression,
} = types.builders;

/**
 *
 * @param {import("recast").types.namedTypes.Program} program
 */
export function importUntrack(program) {
	let isUntrackAlreadyImported;

	for (const progBody of program.body) {
		if (!ImportDeclaration.check(progBody)) continue;

		if (progBody.source.value === "svelte") {
			isUntrackAlreadyImported = progBody.specifiers?.some(
				(spec) =>
					ImportSpecifier.check(spec) && spec.imported.name === "untrack"
			);
		}
	}

	if (!isUntrackAlreadyImported) {
		program.body.unshift(
			importDeclaration(
				[importSpecifier(identifier("untrack"))],
				stringLiteral("svelte")
			)
		);
	}
}

/**
 *
 * @param {import("recast").types.namedTypes.CallExpression} node
 */
export function handleUntrack(node) {
	const { arguments: args, callee } = node;
	/** @type {import("recast").types.namedTypes.Identifier} */ (callee).name =
		"untrack";

	validateArgs("untrack", args);

	if (!isFunctionArg(args[0])) {
		args[0] = arrowFunctionExpression(
			[],
			/** @type {import("recast").types.namedTypes.ExpressionStatement["expression"]} */ (
				args[0]
			)
		);
	}
}
