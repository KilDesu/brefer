declare namespace Brefer {
	interface PreprocessorOptions {
		prefix?: string;
	}

	interface Position {
		start: number;
		end: number;
	}

	interface ReactiveValue extends Position {
		name: string;
	}

	interface DerivedValue extends ReactiveValue {
		dependencies: string[];
	}

	interface Effect extends Position {
		function: Position;
		untracked: Map<ReactiveValue, Position[]>;
	}

	interface Context {
		prefix: string;
		REACTIVE_VALUES: ReactiveValue[];
		DERIVED_VALUES: DerivedValue[];
		TO_RENAME_ONLY: ReactiveValue[];
	}

	type Node = import("estree").Node & Position;
	type Program = import("estree").Program & Position;
	type Root = import("svelte/compiler").Root & {
		html: Brefer.Node;
	};
	type VariableDeclaration = Brefer.Node & { type: "VariableDeclaration" };
	type VariableDeclarator = Brefer.Node & { type: "VariableDeclarator" };
	type Identifier = Brefer.Node & { type: "Identifier" };

	type Expression = import("estree").Expression & Position;
	type ArrowFunctionExpression = import("estree").ArrowFunctionExpression &
		Position;
	type ArrayPattern = import("estree").ArrayPattern & Position;
	type ArrayExpression = import("estree").ArrayExpression & Position;
	type ClassBody = import("estree").ClassBody & Position;
	type CallExpression = import("estree").CallExpression & Position;
	type LabeledStatement = import("estree").LabeledStatement & Position;
	type ExpressionStatement = import("estree").ExpressionStatement & Position;
	type SequenceExpression = import("estree").SequenceExpression & Position;

	export default function (
		options: PreprocessorOptions
	): import("svelte/compiler").PreprocessorGroup[];

	export function untrack<T>(val: () => T): T;
	export function untrack<T>(val: T): T;
	export function untrack<T>(val: T | (() => T)): T;
}
