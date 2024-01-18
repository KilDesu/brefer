/**
 * @template T
 * @typedef {import("@brefer/shared").BreferNode<T>} BreferNode
 */
/**
 * @typedef {import("@brefer/shared").BreferContext} BreferContext
 * @typedef {import("@brefer/shared").Effect} Effect
 * @typedef {import("@brefer/shared").ReactiveValue} ReactiveValue
 * @typedef {BreferNode<import("estree").LabeledStatement>} LabeledStatement
 */

import {
	isArrowFunctionExpression,
	isBlockStatement,
	isExpressionStatement,
	isIdentifier,
	isSequenceExpression
} from "@brefer/shared";
import { walk } from "estree-walker";

/**
 * Handles preprocessing for `$effect` runes.
 *
 * @param {LabeledStatement} node
 * @param {BreferContext} ctx
 * @example
 * ```js
 * let s$count = 0;
 * let d$double = s$count * 2;
 *
 * // Block statement
 * e$: {
 *  console.log(s$count, d$double)
 * }
 *
 * // Arrow function
 * e$: () => {
 *  console.log(s$count, d$double)
 * }
 *
 * // Untracked values
 * e$: d$double, // d$double is untracked
 *  () => {
 *    console.log(s$count, d$double)
 *  }
 * ```
 */
export function handleLabel(node, ctx) {
	if (node.label.name !== ctx.config.prefixes.effect) return;

	const { body } = node;

	if (isBlockStatement(body)) {
		ctx.EFFECTS.push({
			range: node.range,
			block: {
				type: "scope",
				range: body.range
			}
		});
	} else if (isExpressionStatement(body)) {
		const { expression } = body;

		if (isArrowFunctionExpression(expression)) {
			ctx.EFFECTS.push({
				range: node.range,
				block: {
					type: "arrow",
					range: expression.range
				}
			});
		} else if (isSequenceExpression(expression)) {
			const { expressions } = expression;

			const effectStatement = expressions.pop();
			if (!isArrowFunctionExpression(effectStatement)) return;

			/** @type {Effect} */
			const effect = {
				range: node.range,
				block: {
					type: "arrow",
					range: effectStatement.range
				},
				untracked: []
			};

			expressions.forEach((expr) => {
				if (isIdentifier(expr)) {
					const untrackedVal = expr.name;

					walk(effectStatement, {
						enter(bodyNode) {
							if (isIdentifier(bodyNode) && bodyNode.name === untrackedVal) {
								/** @type {ReactiveValue[]} */ (effect.untracked).push({
									name: untrackedVal,
									range: bodyNode.range
								});
							}
						}
					});
				}
			});

			ctx.EFFECTS.push(effect);
		}
	}
}
