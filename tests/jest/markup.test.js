import { getCodes } from "../index.js";

describe("State", () => {
	test("Basic markup", async () => {
		const { got, expected } = await getCodes("html", "markup");

		expect(got).toStrictEqual(expected);
	});

	test("Markup with store", async () => {
		const { got, expected } = await getCodes("store", "markup");

		expect(got).toStrictEqual(expected);
	});
});
