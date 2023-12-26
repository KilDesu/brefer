import { promises as fs } from "fs";
import { preprocess } from "svelte/compiler";
import brefPreprocessor from "../../src/index.js";
import { getCodes } from "../index.js";

const path = "tests/fixtures/derived";

describe("Derived", () => {
	test("Function with parameter", async () => {
		const { got, expected } = await getCodes("functionWithParam", "derived");

		expect(got).toStrictEqual(expected);
	});

	test("Literal expression", async () => {
		const { got, expected } = await getCodes("literalExpression", "derived");

		expect(got).toStrictEqual(expected);
	});

	test("Class property declaration", async () => {
		const { got, expected } = await getCodes("classProperty", "derived");

		expect(got).toStrictEqual(expected);
	});
});
