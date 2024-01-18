import { parse } from "@typescript-eslint/parser";
import { walk } from "estree-walker";
import MagicString from "magic-string";
import { handleReactivity } from "./handlers/index.js";
import {
	wrapInDerived,
	wrapInEffect,
	wrapInState,
	wrapUntrackedValue,
	DEFAULT_CONFIG,
	addUntrackImport
} from "@brefer/shared";

/**
 *
 * Preprocesses the content of the script tag in .svelte files.
 *
 * @param {string} content
 * @param {string} [filename]
 * @param {Partial<import("@brefer/shared").BreferConfig>} config
 * @returns
 */
export function preprocessScript(config, content, filename) {
	const breferConfig = { ...DEFAULT_CONFIG, ...config };

	if (breferConfig.prefixes.state === breferConfig.prefixes.derived) {
		throw new Error(
			"Brefer error: Can't use the same prefix for both state and derived variables."
		);
	}

	const source = new MagicString(content);

	/** @type {import("@brefer/shared").BreferContext} */
	const context = {
		source,
		config: breferConfig,
		svelteImports: {
			default: undefined,
			named: []
		},
		REACTIVE_VALUES: [],
		EFFECTS: []
	};

	const ast = /** @type {import("@brefer/shared").BreferNode<import("estree").Node>} */ (
		parse(content, {
			ecmaVersion: "latest",
			sourceType: "module",
			range: true
		})
	);

	walk(ast, {
		enter(node) {
			handleReactivity(
				/** @type {import("@brefer/shared").BreferNode<import("estree").Node>} */ (node),
				context
			);
		}
	});

	context.REACTIVE_VALUES.forEach((value) => {
		if (value.name.startsWith(breferConfig.prefixes.state)) {
			wrapInState(value, source);
		} else {
			wrapInDerived(value, source);
		}
	});

	context.EFFECTS.forEach((effect) => {
		wrapInEffect(effect, source);

		if (effect.untracked?.length) {
			addUntrackImport(source, context, filename);

			effect.untracked.forEach((value) => wrapUntrackedValue(value, source));
		}
	});

	return {
		code: source.toString(),
		map: source.generateMap({ hires: true }),
		filename
	};
}

/**
 * Preprocessor for Brefer syntax, using variable prefixes to handle reactivity.
 * It avoids the need to call `$state`, `$derived` or `$effect` runes every time.
 *
 * If you also want to preprocess .svelte.js files, use `@brefer/vite-plugin-svelte` instead.
 *
 * @param { Partial<import("@brefer/shared").BreferConfig> } [config = {}]
 * @returns { import("svelte/compiler").PreprocessorGroup }
 */
export function breferPreprocess(config = {}) {
	return {
		name: "brefer-preprocessor",
		async script({ content, filename }) {
			return preprocessScript(config, content, filename);
		}
	};
}
