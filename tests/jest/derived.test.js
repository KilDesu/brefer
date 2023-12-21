import fs from "fs";
import { preprocess } from "svelte/compiler";
import BrefPreprocessor from "../../src/index.js";

const path = "tests/fixtures/derived";

describe("Derived", () => {
	test("Function with parameter", async () => {
		const file = "functionWithParam.svelte";
		const content = fs.readFileSync(`${path}/${file}`, "utf8");

		const preprocessed = await preprocess(content, BrefPreprocessor(), {
			filename: file,
		});

		const expectedCode = `<script>\r\n\tfunction double(count) {\r\n\t\treturn count * 2;\r\n\t}\r\n\r\n\tlet $count = $state(0);\r\n\tlet $double = $derived(double($count));\r\n</script>\r\n`;

		expect(preprocessed.code).toStrictEqual(expectedCode);
	});

	test("Literal expression", async () => {
		const file = "literalExpression.svelte";
		const content = fs.readFileSync(`${path}/${file}`, "utf8");

		const preprocessed = await preprocess(content, BrefPreprocessor(), {
			filename: file,
		});

		const expectedCode = `<script>\r\n\tlet $count = $state(0);\r\n\r\n\tlet $double = $derived($count * 2);\r\n</script>\r\n`;

		expect(preprocessed.code).toStrictEqual(expectedCode);
	});

	test("Array destructuring", async () => {
		const file = "arrayDestructuring.svelte";
		const content = fs.readFileSync(`${path}/${file}`, "utf8");

		const preprocessed = await preprocess(content, BrefPreprocessor(), {
			filename: file,
		});

		const expectedCode = `<script>\r\n\tfunction pow2(x) {\r\n\t\treturn x * x;\r\n\t}\r\n\r\n\tlet [$foo, $bar] = [$state(1), $state(2)];\r\n\r\n\tlet [[$doubleFoo, $tripleFoo], $powBar] = [\r\n\t\t[$derived($count * 2), $derived($count * 3)],\r\n\t\t$derived(pow2($bar)),\r\n\t];\r\n</script>\r\n`;

		expect(preprocessed.code).toStrictEqual(expectedCode);
	});

	test("Class property declaration", async () => {
		const file = "classProperty.svelte";
		const content = fs.readFileSync(`${path}/${file}`, "utf8");

		const preprocessed = await preprocess(content, BrefPreprocessor(), {
			filename: file,
		});

		const expectedCode = `<script>\r\n\tclass Foo {\r\n\t\t$count = $state(0);\r\n\t\t$double = $derived(this.$count * 2);\r\n\t}\r\n</script>\r\n`;

		expect(preprocessed.code).toStrictEqual(expectedCode);
	});
});
