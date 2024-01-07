import { BreferConfig as BreferSharedConfig } from "@brefer/shared";

export interface BreferConfig extends BreferSharedConfig {
	include?: string[];
	exclude?: string[];
}

export * from "./index.js";
