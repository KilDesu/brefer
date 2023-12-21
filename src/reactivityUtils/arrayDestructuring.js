import { handleIdentifier } from "./identifier.js";
import { isArrayExpression, isArrayPattern, isReactive } from "../utils.js";

/**
 * Handles array destructuring declarations,.
 *
 * Only works if the initialization is an array expression with a similar
 * pattern to the identifier array pattern.
 *
 * @param {Bref.ArrayPattern} identifier - The identifier array pattern
 * @param {Bref.ArrayExpression} initialization - The initialization array expression
 * @param {Bref.Options} options - Bref options, containing the prefix and the arrays which store the reactive and derived values
 * @example
 * ```js
 * let [$foo, $bar] = [1, 2];
 * let [[$baz, qux], $fizz] = [[3, 4], $foo * 2];
 * ```
 * Would be transformed to:
 * ```js
 * let [$foo, $bar] = [$state(1), $state(2)];
 * let [[$baz, qux], $fizz] = [[$state(3), 4], $derived($foo * 2)];
 * ```
 */
export function handleArrayDestructuring(identifier, initialization, options) {
	for (let index = 0; index < identifier.elements.length; index++) {
		const element = identifier.elements[index];
		const value = initialization.elements[index];

		if (isArrayPattern(element)) {
			if (!isArrayExpression(value)) {
				throw new Error("Invalid array destructuring pattern.");
			}
			handleArrayDestructuring(element, value, options);
		} else if (isReactive(element, options.prefix)) {
			handleIdentifier(
				element,
				/** @type {Bref.Expression | null} */ (value),
				options
			);
		}
	}
}
