import * as vscode from 'vscode';

import Context from './context';

import { EXPLAINANALYZE_COMMAND, explainCommand } from './commands/explain';
import { EXPLAINSITE_COMMAND, explainsiteCommand } from './commands/explainsite';
import { FORMATSQL_COMMAND, formatCommand, formatProvider } from './commands/format';
import { Actions } from './actions/actions';

export function activate(context: vscode.ExtensionContext) {
	Context.set(context);

	vscode.languages.registerDocumentRangeFormattingEditProvider('sql', {
		provideDocumentRangeFormattingEdits: formatProvider
	});

 	vscode.languages.registerCodeActionsProvider('sql', new Actions(), {
		providedCodeActionKinds: Actions.providedCodeActionKinds
	});

	vscode.commands.registerCommand(FORMATSQL_COMMAND, formatCommand);
	vscode.commands.registerCommand(EXPLAINANALYZE_COMMAND, explainCommand);
	vscode.commands.registerCommand(EXPLAINSITE_COMMAND, explainsiteCommand);

	const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 10);
    statusBarItem.command = EXPLAINANALYZE_COMMAND;
    statusBarItem.text = 'Explain Analyze';
    statusBarItem.show();
	
}

export function deactivate() {}
