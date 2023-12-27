import { getReactiveDependencies, isReactive } from "../utils.js";

/**
 * Adds reactive variables to either `REACTIVE_VALUES` or `DERIVED_VALUES`
 * depending on whether or not the identifier depends on other reactive
 * variables. If the identifier is not reactive, it is ignored.
 *
 * @export
 * @param {Brefer.Identifier} identifier - The identifier node
 * @param {Brefer.Expression | null | undefined} initialization - The initialization expression of the identifier
 * @param {Brefer.Context} ctx - Brefer context, containing the prefix and the arrays which store the reactive and derived values
 */
export function handleIdentifier(identifier, initialization, ctx) {
	if (!isReactive(identifier, ctx.prefix)) return;

	if (!initialization) {
		ctx.REACTIVE_VALUES.push({
			name: identifier.name,
			start: identifier.end,
			end: identifier.end,
		});

		return;
	}

	const dependencies = getReactiveDependencies(initialization, ctx.prefix);

	if (dependencies.length) {
		ctx.DERIVED_VALUES.push({
			name: identifier.name,
			dependencies,
			start: initialization.start,
			end: initialization.end,
		});
	} else {
		ctx.REACTIVE_VALUES.push({
			name: identifier.name,
			start: initialization.start,
			end: initialization.end,
		});
	}
}
