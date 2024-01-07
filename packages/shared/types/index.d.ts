declare module '@brefer/shared' {
	import type { default as MagicString } from 'magic-string';
	export interface BreferConfig {
		prefixes: {
			state: string;
			derived: string;
			effect: string;
		};
	}

	export interface BreferContext {
		config: BreferConfig;
		source: MagicString;
		REACTIVE_VALUES: ReactiveValue[];
		EFFECTS: Effect[];
	}

	export type BreferNode<T> = T & Position;

	export const DEFAULT_CONFIG: BreferConfig;
	interface Position {
		/* start: number;
		end: number; */
		range: [number, number];
	}

	/**
	 * A `$state` or `$derived` value.
	 */
	interface ReactiveValue extends Position {
		name: string;
	}

	/**
	 * An `$effect` value. `block` can be a scope block or an arrow function.
	 */
	interface Effect extends Position {
		block: { type: "arrow" | "scope" } & Position;
		untracked?: ReactiveValue[];
	}
	/**
	 * Checks wether the given node is an identifier.
	 *
	 * @param node - The node to check
	 * */
	export function isIdentifier(node: any): node is BreferNode<import("estree").Identifier>;
	/**
	 * Checks wether the given node is a variable declaration.
	 *
	 * @param node - The node to check
	 * */
	export function isVariableDeclaration(node: any): node is BreferNode<import("estree").VariableDeclaration>;
	/**
	 * Checks wether the given node is a variable declarator.
	 *
	 * @param node - The node to check
	 * */
	export function isVariableDeclarator(node: any): node is BreferNode<import("estree").VariableDeclarator>;
	/**
	 * Checks wether the given node is a class body.
	 *
	 * @param node - The node to check
	 * */
	export function isClassBody(node: any): node is BreferNode<import("estree").ClassBody>;
	/**
	 * Checks wether the given node is a label statement.
	 *
	 * @param node - The node to check
	 * */
	export function isLabeledStatement(node: any): node is BreferNode<import("estree").LabeledStatement>;
	/**
	 * Checks wether the given node is an expression statement.
	 *
	 * @param node - The node to check
	 * */
	export function isExpressionStatement(node: any): node is BreferNode<import("estree").ExpressionStatement>;
	/**
	 * Checks wether the given node is a sequence expression.
	 *
	 * @param node - The node to check
	 * */
	export function isSequenceExpression(node: any): node is BreferNode<import("estree").SequenceExpression>;
	/**
	 * Checks wether the given node is an array expression.
	 *
	 * @param node - The node to check
	 * */
	export function isArrayExpression(node: any): node is BreferNode<import("estree").ArrayExpression>;
	/**
	 * Checks wether the given node is a function call expression.
	 *
	 * @param node - The node to check
	 * */
	export function isCallExpression(node: any): node is BreferNode<import("estree").CallExpression>;
	/**
	 * Checks wether the given node is an arrow function expression.
	 *
	 * @param node - The node to check
	 * */
	export function isArrowFunctionExpression(node: any): node is BreferNode<import("estree").ArrowFunctionExpression>;
	/**
	 * Checks wether the given node is a block statement.
	 *
	 * @param node - The node to check
	 * */
	export function isBlockStatement(node: any): node is BreferNode<import("estree").BlockStatement>;
	/**
	 * Checks if the given node is reactive.
	 *
	 * */
	export function isReactive(node: any, ctx: BreferContext): node is any;
	/**
	 * Wraps state values (`s$` prefix) in Svelte's `$state` rune.
	 *
	 * If the variable has no initialization (e.g. `let s$foo;`), it will be initialized to an empty `$state()`.
	 *
	 * @param node - The node to wrap
	 * @param source - The magic string representation of the script content
	 */
	export function wrapInState(node: ReactiveValue, source: import("magic-string").default): void;
	/**
	 * Wraps derived values (`d$` prefix) in Svelte's `$derived` rune.
	 *
	 * @param node - The node to wrap
	 * @param source - The magic string representation of the script content
	 */
	export function wrapInDerived(node: ReactiveValue, source: import("magic-string").default): void;
	/**
	 * Wraps effects (`e$` prefix) in Svelte's `$effect` rune.
	 *
	 * @param node - The node to wrap
	 * @param source - The magic string representation of the script content
	 */
	export function wrapInEffect(node: Effect, source: import("magic-string").default): void;
	/**
	 * Wraps untracked values in Svelte's `$effect` blocks.
	 *
	 * If the `untrack` function is not imported, it also adds the import statement.
	 *
	 * @param untrackedValue - The untracked value to wrap
	 * @param source - The magic string representation of the script content
	 * @param filename - The name of the preprocessed file
	 */
	export function wrapUntrackedValue(untrackedValue: ReactiveValue, source: import("magic-string").default, filename?: string | undefined): void;
}

//# sourceMappingURL=index.d.ts.map