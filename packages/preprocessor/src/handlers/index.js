import {
	isVariableDeclaration,
	isClassBody,
	isLabeledStatement,
} from "@brefer/shared";
import * as reactivity from "./reactive.js";
import * as effect from "./effect.js";

/**
 * @template T
 * @typedef {import("@brefer/shared").BreferNode<T>} BreferNode
 */
/**
 * @typedef {import("@brefer/shared").BreferContext} BreferContext
 * @typedef {BreferNode<import("estree").Node>} Node
 */

/**
 * Handles `$state` and `$derived` runes.
 *
 * @param {Node} node - The node to handle
 * @param {BreferContext} ctx
 */
export function handleReactivity(node, ctx) {
	if (isVariableDeclaration(node)) {
		reactivity.handleVariableDeclaration(node, ctx);
	} else if (isClassBody(node)) {
		reactivity.handleClassDeclaration(node, ctx);
	} else if (isLabeledStatement(node)) {
		effect.handleLabel(node, ctx);
	}
}
