import { types } from "recast";
import { handleDeclarator, handleVariableDeclaration } from "./declaration.js";
import { handleUntrack, importUntrack } from "./untrack.js";
import { handleEffect } from "./call-expressions.js";
import { handleStateSubrunes } from "./new-runes.js";

/**
 * @typedef {import("recast").types.Visitor} Visitor
 **/

/**
 * @template {keyof Visitor} T
 * @typedef {Parameters<NonNullable<Visitor[T]>>[0]} VisitorParam
 */

/**
 * @this {({traverse: (path: VisitorParam<"visitProgram">) => any})}
 * @param {VisitorParam<"visitProgram">} path
 * @param {string} content
 */
export function programVisitor(path, content) {
	if (content.includes("$untrack")) {
		const program = path.node;
		importUntrack(program);
	}

	return this.traverse(path);
}

/**
 * @this {({traverse: (path: VisitorParam<"visitClassProperty">) => any})}
 * @param {VisitorParam<"visitClassProperty">} path
 */
export function classPropertyVisitor(path) {
	const classDeclaration = path.node;
	handleDeclarator(classDeclaration, null);

	return this.traverse(path);
}

/**
 * @this {({traverse: (path: VisitorParam<"visitVariableDeclaration">) => any})}
 * @param {VisitorParam<"visitVariableDeclaration">} path
 */
export function variableDeclarationVisitor(path) {
	const varDeclaration = path.node;
	handleVariableDeclaration(varDeclaration);

	return this.traverse(path);
}

/**
 * @this {({traverse: (path: VisitorParam<"visitCallExpression">) => any})}
 * @param {VisitorParam<"visitCallExpression">} path
 */
export function callExpressionVisitor(path) {
	const { Identifier } = types.namedTypes;
	const callExpression = path.node;

	handleEffect(callExpression);

	if (Identifier.check(callExpression.callee)) {
		if (callExpression.callee.name === "$untrack") {
			handleUntrack(callExpression);
		} else {
			handleStateSubrunes(callExpression.callee);
		}
	}

	return this.traverse(path);
}
