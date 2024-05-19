import { types } from "recast";
import { handleInitialisation, replaceInitalisation } from "./initialisation.js";

const { VariableDeclarator } = types.namedTypes;

/**
 *
 * @param { import("recast").types.namedTypes.VariableDeclaration } node
 */
export function handleVariableDeclaration(node) {
	if (node.kind === "var") {
		node.kind = "let";

		return;
	}

	for (const declaration of node.declarations) {
		if (!VariableDeclarator.check(declaration)) return;

		handleDeclarator(declaration, node.kind);
	}
}

/**
 * @param { import("recast").types.namedTypes.VariableDeclarator | import("recast").types.namedTypes.ClassProperty } declaration
 * @param { "let" | "const" | null } kind
 */
export function handleDeclarator(declaration, kind) {
	const initType = VariableDeclarator.check(declaration) ? "init" : "value";

	/** @type {import("recast").types.namedTypes.ClassProperty["value"]} */
	const init = /** @type {any} */ (declaration)[initType];

	if (!init && kind === "let") {
		/** @type {any} */ (declaration)[initType] = replaceInitalisation("state", []);
	} else {
		handleInitialisation(init, kind, (newVal, arg) => {
			/** @type {any} */ (declaration)[initType] = replaceInitalisation(newVal, arg);
		});
	}
}
