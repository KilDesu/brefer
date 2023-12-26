declare namespace Bref {
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

	interface Context {
		prefix: string;
		REACTIVE_VALUES: Bref.ReactiveValue[];
		DERIVED_VALUES: Bref.DerivedValue[];
	}

	type Node = import("estree-walker").Node & Position;
	type VariableDeclaration = Bref.Node & { type: "VariableDeclaration" };
	type VariableDeclarator = Bref.Node & { type: "VariableDeclarator" };
	type Identifier = Bref.Node & { type: "Identifier" };

	type Expression = import("estree").Expression & Position;
	type ArrayPattern = import("estree").ArrayPattern & Position;
	type ArrayExpression = import("estree").ArrayExpression & Position;
	type ClassBody = import("estree").ClassBody & Position;
	type CallExpression = import("estree").CallExpression & Position;
}
