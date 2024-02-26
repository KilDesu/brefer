import { parse, print, visit, types } from "recast";
import parser from "recast/parsers/typescript.js";
import { handleUntrack, importUntrack } from "./handlers/untrack.js";
import { handleDeclarator, handleVariableDeclaration } from "./handlers/declaration.js";
import { handleEffect } from "./handlers/call-expressions.js";
import { handleFrozen } from "./handlers/new-runes.js";

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
			if (content.includes("$untrack")) {
				const program = path.node;
				importUntrack(program);
			}

			return this.traverse(path);
		},
		visitClassProperty(path) {
			const classDeclaration = path.node;
			handleDeclarator(classDeclaration);

			return this.traverse(path);
		},
		visitVariableDeclaration(path) {
			const varDeclaration = path.node;
			handleVariableDeclaration(varDeclaration);

			return this.traverse(path);
		},
		visitCallExpression(path) {
			const { Identifier } = types.namedTypes;
			const callExpression = path.node;
			handleEffect(callExpression);

			if (Identifier.check(callExpression.callee)) {
				if (callExpression.callee.name === "$untrack") handleUntrack(callExpression);
				else if (callExpression.callee.name === "$frozen") handleFrozen(callExpression);
			}

			return this.traverse(path);
		}
	});

	return print(ast);
}
