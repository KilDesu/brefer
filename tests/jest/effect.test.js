import { getCodes } from "../index.js";

describe("Effect", () => {
	test("Effect without untracked values", async () => {
		const { got, expected } = await getCodes("withoutUntracked", "effect");

		expect(got).toStrictEqual(expected);
	});

	test("Effect with untracked values", async () => {
		const { got, expected } = await getCodes("withUntracked", "effect");

		expect(got).toStrictEqual(expected);
	});
});
