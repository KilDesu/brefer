import { getReactiveDependencies, isReactive } from "../utils.js";

/**
 * Adds reactive variables to either `REACTIVE_VALUES` or `DERIVED_VALUES`
 * depending on whether or not the identifier depends on other reactive
 * variables. If the identifier is not reactive, it is ignored.
 *
 * @export
 * @param {Bref.Identifier} identifier - The identifier node
 * @param {Bref.Expression | null | undefined} initialization - The initialization expression of the identifier
 * @param {Bref.Options} options - Bref options, containing the prefix and the arrays which store the reactive and derived values
 */
export function handleIdentifier(identifier, initialization, options) {
	if (!isReactive(identifier, options.prefix)) return;

	if (!initialization) {
		options.REACTIVE_VALUES.push({
			name: identifier.name,
			start: identifier.end,
			end: identifier.end,
		});

		return;
	}

	const dependencies = getReactiveDependencies(initialization, options.prefix);

	if (dependencies.length) {
		options.DERIVED_VALUES.push({
			name: identifier.name,
			dependencies,
			start: initialization.start,
			end: initialization.end,
		});
	} else {
		options.REACTIVE_VALUES.push({
			name: identifier.name,
			start: initialization.start,
			end: initialization.end,
		});
	}
}
