import { describe, it, expect } from "vitest";
import { brefer } from "./src/index.js";
import fs from "node:fs/promises";
import { format } from "prettier";

const fixtures = "./__tests__/fixtures";
const languages = await fs.readdir(fixtures);

for (const language of languages) {
	const features = await fs.readdir(`${fixtures}/${language}`);

	for (const feature of features) {
		describe(feature, async () => {
			const testTypes = await fs.readdir(`${fixtures}/${language}/${feature}`);

			for (const testType of testTypes) {
				const path = `${fixtures}/${language}/${feature}/${testType}`;
				const read = async (type) =>
					await fs.readFile(`${path}/${type}.${language}`, "utf-8");

				const input = await read("input");
				const output = await read("output");

				it(testType, async () => {
					const result = await brefer().transform(
						input,
						`${path}/input.${language}`
					);

					const parser = language === "svelte" ? "html" : "typescript";

					const got = await format(result.code, { parser });
					const expected = await format(output, { parser });

					expect(got).toEqual(expected);
				});
			}
		});
	}
}
