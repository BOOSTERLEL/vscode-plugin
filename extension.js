// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
var path = require('path');

var highlightLocations;
var taintedLines = [];
var lnclfl = [];

const decorationType = vscode.window.createTextEditorDecorationType({
	backgroundColor: "green",
	border: "0.5px outset white"
});

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-plugin" is now active!');

	let timeout = undefined;

	let folder = vscode.workspace.workspaceFolders[0].uri.path;

	let workSpacePath = `${path.resolve(
		folder.slice(3,folder.length)
	)}\\`
	const text = fs.readFileSync(`${workSpacePath}ICFGPaths.txt`);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('vscode-plugin.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from vscode-plugin!');
	});

	let basicHighlight = vscode.commands.registerCommand('vscode-plugin.showFlow',function () {
		decorate(text);
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(basicHighlight);
}

function updateLines() {
	let activeEditor = vscode.window.activeTextEditor;

	const flowLines = [];
	taintedLines.sort(function(a,b) {
		return a - b;
	});
	let min = taintedLines[0];
	let max = taintedLines[taintedLines.length - 1];
	let i = min + 1;
	while (i < max) {
		const found = taintedLines.find(element => element == i);
		if (found == undefined) {
			const startPosition = new vscode.Position(i, 0);
			const endPosition = new vscode.Position(i, 0);
			let decoration = new vscode.Range(startPosition, endPosition);
			highlightLocations.push(decoration);
		}
		i++;
	}
	activeEditor.setDecorations(decorationType, highlightLocations);
}

function decorate(text) {
	let activeEditor = vscode.window.activeTextEditor;
	if (!activeEditor) {
		return;
	}

	let regExp = new RegExp(/\{[\s]ln\:[\s][0-9]+[\s]+cl\:[\s][0-9]+[\s]+fl\:[\s][a-z]+[0-9]+\.c[\s]\}/g);
	let match;

	while (match = regExp.exec(text)) {
		let matchStr = match.toString();
		let lnStr = matchStr.split("  ")[0];
		let ln = lnStr.substring(6, lnStr.length);
		let clStr = matchStr.split("  ")[1];
		let cl = clStr.substring(4, clStr.length);
		let fileStr = matchStr.split("  ")[2];
		let file = fileStr.substring(4, fileStr.length - 2);

		let currentFilePath = activeEditor.document.fileName;
		let fileName = currentFilePath.split("\\");

		if (file == fileName[fileName.length - 1]) {
			const startPosition = new vscode.Position(parseInt(ln) - 1, parseInt(cl) - 1);
			const endPosition = new vscode.Position(parseInt(ln) - 1, parseInt(cl) + 200);
			taintedLines.push(parseInt(ln) - 1);
			let decoration = new vscode.Range(startPosition, endPosition);
			lnclfl.push(decoration);
		}
	}

	highlightLocations = lnclfl;
	vscode.window.showInformationMessage('FLow saved.');
	activeEditor.setDecorations(decorationType, highlightLocations);
	updateLines();
	lnclfl = [];
	taintedLines = [];
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
