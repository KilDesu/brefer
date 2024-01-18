import type MagicString from "magic-string";
import { Effect, Position, ReactiveValue } from "./private.js";

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
	svelteImports: SvelteImports;
	REACTIVE_VALUES: ReactiveValue[];
	EFFECTS: Effect[];
}

export interface SvelteImports {
	default?: import("./public.d.ts").BreferNode<import("estree").ImportDefaultSpecifier>;
	named: import("./public.d.ts").BreferNode<import("estree").ImportSpecifier>[];
}

export type BreferNode<T> = T & Position;

export * from "./estree.js";
export * from "./source.js";

export const DEFAULT_CONFIG: BreferConfig;
