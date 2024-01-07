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
	REACTIVE_VALUES: ReactiveValue[];
	EFFECTS: Effect[];
}

export type BreferNode<T> = T & Position;

export * from "./estree.js";
export * from "./source.js";

export const DEFAULT_CONFIG: BreferConfig;
