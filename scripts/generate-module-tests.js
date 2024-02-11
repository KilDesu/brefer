import fs from "fs";
import path from "path";
import { format } from "prettier";

const fixtures = path.resolve(process.cwd(), "__tests__/fixtures");

function generateModuleTests() {
	const base = `${fixtures}/svelte`;

	for (const feature of fs.readdirSync(base)) {
		const lang = feature.endsWith("ts") ? "ts" : "js";

		const moduleDir = `${base}.${lang}`;

		const featurePath = `${base}/${feature}`;
		const moduleFeaturePath = `${moduleDir}/${feature.replace("-ts", "")}`;

		for (const testType of fs.readdirSync(featurePath)) {
			const testPath = `${featurePath}/${testType}`;
			const moduleTestPath = `${moduleFeaturePath}/${testType}`;

			for (const file of fs.readdirSync(testPath)) {
				const filePath = `${testPath}/${file}`;
				const moduleFilePath = `${moduleTestPath}/${file}.${lang}`;

				const content = fs.readFileSync(filePath, "utf8");
				const moduleContent = content.replace(
					/<script[^>]*>([\s\S]*?)<\/script>/,
					"$1"
				);

				format(moduleContent, {
					tabWidth: 2,
					parser: lang === "ts" ? "typescript" : "espree",
				}).then((result) => fs.writeFileSync(moduleFilePath, result));
			}
		}
	}
}

generateModuleTests();
