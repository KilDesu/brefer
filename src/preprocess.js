import { parse, print, visit } from "recast";
import parser from "recast/parsers/typescript.js";
import {
	callExpressionVisitor,
	classPropertyVisitor,
	programVisitor,
	variableDeclarationVisitor
} from "./handlers/visitors.js";

/**
 * Preprocesses the content of the script tag in .svelte files.
 * @param {string} content - The content of the script tag
 * @param {string} [filename] - The name of the file
 */
export function preprocessScript(content, filename) {
	const ast = parse(content, {
		sourceFileName: filename,
		parser
	});

	visit(ast, {
		visitProgram(path) {
			programVisitor.call(this, path, content);
		},
		visitClassProperty(path) {
			classPropertyVisitor.call(this, path);
		},
		visitVariableDeclaration(path) {
			variableDeclarationVisitor.call(this, path);
		},
		visitCallExpression(path) {
			callExpressionVisitor.call(this, path);
		}
	});

	return print(ast);
}
