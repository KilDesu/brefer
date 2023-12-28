import { promises as fs } from "fs";
import { preprocess } from "svelte/compiler";
import brefPreprocessor from "../src/index.js";
import { format } from "prettier";

/**
 * Prepares the preprocessed code and the expected code for comparison.
 *
 * @export
 * @param {string} fileName
 * @param {"state" | "derived" | "markup"} type
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

	const prettyExpected = await format(expected, {
		tabWidth: 2,
		parser: "html",
	});
	const prettyGot = await format(preprocessed.code, {
		tabWidth: 2,
		parser: "html",
	});

	return { expected: prettyExpected, got: prettyGot };
}
