import { promises as fs } from "fs";
import { preprocess } from "svelte/compiler";
import brefPreprocessor from "../../src/index.js";
import { getCodes } from "../index.js";

const path = "tests/fixtures/state";

describe("State", () => {
	test("No initial value", async () => {
		const { got, expected } = await getCodes("noInitialValue", "state");

		expect(got).toStrictEqual(expected);
	});

	test("With initial value", async () => {
		const { got, expected } = await getCodes("initialValue", "state");

		expect(got).toStrictEqual(expected);
	});

	test("Class property declarations", async () => {
		const { got, expected } = await getCodes("classProperty", "state");

		expect(got).toStrictEqual(expected);
	});
});
