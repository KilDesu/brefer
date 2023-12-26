import { promises as fs } from "fs";
import { preprocess } from "svelte/compiler";
import brefPreprocessor from "../src/index.js";

/**
 * Prepares the preprocessed code and the expected code for comparison.
 *
 * @export
 * @param {string} fileName
 * @param {"state" | "derived"} type
 * @return {{ expected: string, got: string }}
 */
export async function getCodes(fileName, type) {
	const path = `tests/fixtures/${type}/${fileName}`;

	const expected = await fs.readFile(`${path}.result.svelte`, {
		encoding: "utf8",
	});

	const content = await fs.readFile(`${path}.svelte`, {
		encoding: "utf8",
	});
	const preprocessed = await preprocess(content, brefPreprocessor(), {
		filename: `${fileName}.svelte`,
	});

	return { expected, got: preprocessed.code };
}
