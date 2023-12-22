import { promises as fs } from "fs";
import { preprocess } from "svelte/compiler";
import brefPreprocessor from "../../src/index.js";

const path = "tests/fixtures/state";

describe("State", () => {
	test("No initial value", async () => {
		const file = "noInitialValue.svelte";
		const content = await fs.readFile(`${path}/${file}`, { encoding: "utf8" });

		const preprocessed = await preprocess(content, brefPreprocessor(), {
			filename: file,
		});

		const expectedCode = `<script>\r\n\tlet $count = $state();\r\n</script>\r\n`;

		expect(preprocessed.code).toStrictEqual(expectedCode);
	});

	test("With initial value", async () => {
		const file = "initialValue.svelte";
		const content = await fs.readFile(`${path}/${file}`, { encoding: "utf8" });

		const preprocessed = await preprocess(content, brefPreprocessor(), {
			filename: file,
		});

		const expectedCode = `<script>\r\n\tlet notReactive = true;\r\n\r\n\tlet $foo = $state("bar");\r\n\r\n\tlet $count = $state(0);\r\n\r\n\tlet $object = $state({\r\n\t\tfoo: "bar",\r\n\t\tbaz: "qux",\r\n\t});\r\n\r\n\tlet $array = $state([1, 2, 3, 4, 5]);\r\n</script>\r\n`;

		expect(preprocessed.code).toStrictEqual(expectedCode);
	});

	test("Class property declarations", async () => {
		const file = "classProperty.svelte";
		const content = await fs.readFile(`${path}/${file}`, { encoding: "utf8" });

		const preprocessed = await preprocess(content, brefPreprocessor(), {
			filename: file,
		});

		const expectedCode = `<script>\r\n\tclass Foo {\r\n\t\t$foo = $state(1);\r\n\t\tbar = 2;\r\n\t\t$baz = $state();\r\n\t}\r\n</script>\r\n`;

		expect(preprocessed.code).toStrictEqual(expectedCode);
	});

	test("Array destructuring", async () => {
		const file = "arrayDestructuring.svelte";
		const content = await fs.readFile(`${path}/${file}`, { encoding: "utf8" });

		const preprocessed = await preprocess(content, brefPreprocessor(), {
			filename: file,
		});

		const expectedCode = `<script>\r\n\tlet [$foo, bar, $baz] = [$state(1), 2, $state(3)];\r\n\r\n\tlet [[$a, b], $c] = [[$state(1), 2], $state(3)];\r\n</script>\r\n`;

		expect(preprocessed.code).toStrictEqual(expectedCode);
	});
});
