import { describe, it, expect } from "vitest";
import { preprocess } from "svelte/compiler";
import { breferPreprocess } from "./src/index.js";
import fs from "node:fs/promises";
import { format } from "prettier";

const svelteFixturesDir = "./__tests__/fixtures/svelte";
const features = await fs.readdir(svelteFixturesDir);

for (const feature of features) {
	describe(feature, async () => {
		const testTypes = await fs.readdir(`${svelteFixturesDir}/${feature}`);

		for (const testType of testTypes) {
			const path = `${svelteFixturesDir}/${feature}/${testType}`;

			const input = await fs.readFile(`${path}/input.svelte`, "utf-8");
			const output = await fs.readFile(`${path}/output.svelte`, "utf-8");

			it(testType, async () => {
				const result = await preprocess(input, breferPreprocess(), {
					filename: "input.svelte",
				});

				const got = await format(result.code, { parser: "html" });
				const expected = await format(output, { parser: "html" });

				expect(got).toEqual(expected);
			});
		}
	});
}
