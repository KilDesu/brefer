import { getCodes } from "../index.js";

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

	test("Ignore variables that are already a $state", async () => {
		const { got, expected } = await getCodes("ignoreState", "state");

		expect(got).toStrictEqual(expected);
	});
});
