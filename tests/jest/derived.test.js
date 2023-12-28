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

	test("Ignore variables that are already $derived", async () => {
		const { got, expected } = await getCodes("ignoreDerived", "derived");

		expect(got).toStrictEqual(expected);
	});
});
