export interface Position {
	/* start: number;
	end: number; */
	range: [number, number];
}

/**
 * A `$state` or `$derived` value.
 */
export interface ReactiveValue extends Position {
	name: string;
}

/**
 * An `$effect` value. `block` can be a scope block or an arrow function.
 */
export interface Effect extends Position {
	block: { type: "arrow" | "scope" } & Position;
	untracked?: ReactiveValue[];
}
