/**
 * Checks wether the given node is an identifier.
 *
 * @param {any} node - The node to check
 * @returns {node is import("./public.d.ts").BreferNode<import("estree").Identifier>}
 */
export function isIdentifier(node) {
	return node.type === "Identifier";
}

/**
 * Checks wether the given node is a variable declaration.
 *
 * @param {any} node - The node to check
 * @returns {node is import("./public.d.ts").BreferNode<import("estree").VariableDeclaration>}
 */
export function isVariableDeclaration(node) {
	return node.type === "VariableDeclaration";
}

/**
 * Checks wether the given node is a variable declarator.
 *
 * @param {any} node - The node to check
 * @returns {node is import("./public.d.ts").BreferNode<import("estree").VariableDeclarator>}
 */
export function isVariableDeclarator(node) {
	return node.type === "VariableDeclarator";
}

/**
 * Checks wether the given node is a class body.
 *
 * @param {any} node - The node to check
 * @returns {node is import("./public.d.ts").BreferNode<import("estree").ClassBody>}
 */
export function isClassBody(node) {
	return node.type === "ClassBody";
}

/**
 * Checks wether the given node is a label statement.
 *
 * @param {any} node - The node to check
 * @returns {node is import("./public.d.ts").BreferNode<import("estree").LabeledStatement>}
 */
export function isLabeledStatement(node) {
	return node.type === "LabeledStatement";
}

/**
 * Checks wether the given node is an expression statement.
 *
 * @param {any} node - The node to check
 * @returns {node is import("./public.d.ts").BreferNode<import("estree").ExpressionStatement>}
 */
export function isExpressionStatement(node) {
	return node.type === "ExpressionStatement";
}

/**
 * Checks wether the given node is a sequence expression.
 *
 * @param {any} node - The node to check
 * @returns {node is import("./public.d.ts").BreferNode<import("estree").SequenceExpression>}
 */
export function isSequenceExpression(node) {
	return node.type === "SequenceExpression";
}

/**
 * Checks wether the given node is an array expression.
 *
 * @param {any} node - The node to check
 * @returns {node is import("./public.d.ts").BreferNode<import("estree").ArrayExpression>}
 */
export function isArrayExpression(node) {
	return node.type === "ArrayExpression";
}

/**
 * Checks wether the given node is a function call expression.
 *
 * @param {any} node - The node to check
 * @returns {node is import("./public.d.ts").BreferNode<import("estree").CallExpression>}
 */
export function isCallExpression(node) {
	return node.type === "CallExpression";
}

/**
 * Checks wether the given node is an arrow function expression.
 *
 * @param {any} node - The node to check
 * @returns {node is import("./public.d.ts").BreferNode<import("estree").ArrowFunctionExpression>}
 */
export function isArrowFunctionExpression(node) {
	return node.type === "ArrowFunctionExpression";
}

/**
 * Checks wether the given node is a block statement.
 *
 * @param {any} node - The node to check
 * @returns {node is import("./public.d.ts").BreferNode<import("estree").BlockStatement>}
 */
export function isBlockStatement(node) {
	return node.type === "BlockStatement";
}

/**
 * Checks wether the given node is an import declaration.
 *
 * @param {any} node - The node to check
 * @returns {node is import("./public.d.ts").BreferNode<import("estree").ImportDeclaration>}
 */
export function isImportDeclaration(node) {
	return node.type === "ImportDeclaration";
}

/**
 * Checks wether the given node is an import specifier.
 *
 * @param {any} node - The node to check
 * @returns {node is import("./public.d.ts").BreferNode<import("estree").ImportSpecifier>}
 */
export function isImportSpecifier(node) {
	return node.type === "ImportSpecifier";
}

/**
 * Checks wether the given node is a default import specifier.
 *
 * @param {any} node - The node to check
 * @returns {node is import("./public.d.ts").BreferNode<import("estree").ImportDefaultSpecifier>}
 */
export function isImportDefaultSpecifier(node) {
	return node.type === "ImportDefaultSpecifier";
}

/**
 * Checks if the given node is reactive.
 *
 * @param {any} node
 * @param {import("./public.d.ts").BreferContext} ctx
 * @return {node is import("./public.d.ts").ReactiveValue}
 */
export function isReactive(node, ctx) {
	return (
		isIdentifier(node) &&
		[ctx.config.prefixes.state, ctx.config.prefixes.derived].some((prefix) =>
			node.name.startsWith(prefix)
		)
	);
}

/**
 * Returns the items imported from "svelte".
 * This function is used to check if the current file has already imported "untrack" or not.
 *
 * @param {import("./public.d.ts").BreferNode<import("estree").ImportDeclaration>} node
 * @param {import("./public.d.ts").BreferContext} ctx
 */
export function getSvelteImports(node, ctx) {
	if (node.source.value !== "svelte") return;

	/**
	 * @type {import("./public.d.ts").SvelteImports}
	 */
	const svelteImports = {
		default: undefined,
		named: []
	};

	for (let i = 0; i < node.specifiers.length; i++) {
		const specifier = node.specifiers[i];

		if (isImportDefaultSpecifier(specifier)) {
			svelteImports.default = specifier;
		} else if (isImportSpecifier(specifier)) {
			svelteImports.named.push(specifier);
		}
	}

	ctx.svelteImports = svelteImports;
}
