import { walk } from "estree-walker";
import {
	isArrowFunctionExpression,
	isExpressionStatement,
	isIdentifier,
	isReactiveIdentifier,
	isSequenceExpression,
} from "../utils.js";
import MagicString from "magic-string";

/**
 * Handles effects.
 *
 * @param {Brefer.LabeledStatement} node - The node containing the effect
 * @param {MagicString} source - The MagicString representation of content of the script
 * @param {Brefer.Context} ctx - Brefer context, containing the prefix and the arrays which store the reactive and derived values
 */
export function handleEffect(node, source, ctx) {
	if (node.label.name !== "$" || !isExpressionStatement(node.body)) return;

	const { expression } = node.body;

	if (isArrowFunctionExpression(expression)) {
		source.update(node.start, expression.start, `$effect(`);
		source.appendRight(expression.end, `)`);
	} else if (isSequenceExpression(expression)) {
		const { expressions } = expression;

		const effectFunction = expressions.pop();
		if (!isArrowFunctionExpression(effectFunction)) return;

		const importToAdd = `import { untrack } from "svelte";\r\n`;

		if (source.slice(0, importToAdd.length) !== importToAdd) {
			source.prepend(importToAdd);
		}

		source.update(node.start, effectFunction.start, `$effect(`);
		source.appendRight(effectFunction.end, `)`);

		expressions.forEach((expr) => {
			if (isIdentifier(expr)) {
				const untrackedVal = expr.name;

				walk(effectFunction.body, {
					enter(bodyNode) {
						if (isIdentifier(bodyNode)) {
							const toAdd = ctx.prefix === "$" ? "r" : "";
							if (bodyNode.name === untrackedVal) {
								source.appendLeft(bodyNode.start, `untrack(() => ${toAdd}`);
								source.appendRight(bodyNode.end, `)`);
							} else if (isReactiveIdentifier(bodyNode, ctx)) {
								source.appendLeft(bodyNode.start, `${toAdd}`);
							}
						}
					},
				});
			}
		});
	}
}
