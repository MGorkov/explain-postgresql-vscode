import * as vscode from 'vscode';
import { EXPLAINANALYZE_COMMAND } from '../commands/explain';
import { FORMATSQL_COMMAND } from '../commands/format';

export class Actions implements vscode.CodeActionProvider {

	public static readonly providedCodeActionKinds = [
		vscode.CodeActionKind.Refactor,
		// vscode.CodeActionKind.QuickFix,
	];

	provideCodeActions(document: vscode.TextDocument, range: vscode.Range | vscode.Selection, context: vscode.CodeActionContext, token: vscode.CancellationToken): vscode.ProviderResult<(vscode.CodeAction | vscode.Command)[]> {
		const commandFormatSQL = this.createCommand(FORMATSQL_COMMAND, "Format SQL", "Formatting SQL text");
		const commandExplainAnalyze = this.createCommand(EXPLAINANALYZE_COMMAND, "Explain Analyze", "Explain query plan");
		// const replaceSQL = this.createFix(document, range, 'Formatted SQL');

		return [
			// replaceSQL,
			commandFormatSQL,
			commandExplainAnalyze,
		];
	}

/*
	private createFix(document: vscode.TextDocument, range: vscode.Range, formatted: string): vscode.CodeAction {
		const fix = new vscode.CodeAction('Format SQL', vscode.CodeActionKind.QuickFix);
		fix.edit = new vscode.WorkspaceEdit();
		fix.edit.replace(document.uri, new vscode.Range(range.start, range.end), formatted);
		return fix;
	}
*/
	private createCommand(command: string, title: string, tooltip: string): vscode.CodeAction {
		const action = new vscode.CodeAction(title, vscode.CodeActionKind.Refactor);
		action.command = {command, title, tooltip};
		return action;
	}

}
