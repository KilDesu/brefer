import { types } from "recast";
import { handleCallExpression } from "./call-expressions.js";
import { handleStatic } from "./new-runes.js";

const { callExpression, identifier } = types.builders;
const { CallExpression } = types.namedTypes;

/**
 *
 * @param {import("recast").types.namedTypes.ClassProperty["value"]} init
 * @param { (newVal: any, arg?: any) => void } cb
 */
export function handleInitialisation(init, cb) {
	if (CallExpression.check(init)) {
		handleCallExpression(init, {
			handleStatic: () => cb(handleStatic(init)),
			handleState: () => cb("state", init ? [init] : []),
		});
	} else {
		cb("state", [init]);
	}
}

/**
 * @template T
 * @param { any } newVal
 * @param { any[] } [arg]
 * @return { T }
 */
export function replaceInitalisation(newVal, arg) {
	return /** @type {T} */ (
		arg ? callExpression(identifier(`$${newVal}`), arg) : newVal
	);
}
