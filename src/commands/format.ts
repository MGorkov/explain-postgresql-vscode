import * as vscode from 'vscode';
import beautifier from '../api/format';

export const FORMATSQL_COMMAND = 'explain-postgresql.formatsql';

export async function formatCommand(): Promise<void> {
    let editor = vscode.window.activeTextEditor;
    if (editor) {
        let validFullRange: vscode.Range;
        let selection = editor.selection;
        let text = editor.document.getText(selection);
        if (!text) {
            text = editor.document.getText();
            let invalidRange = new vscode.Range(0, 0, editor.document.lineCount, 0);
            validFullRange = editor.document.validateRange(invalidRange);
        }
        try {
            let formatted = await beautifier(text);
            editor.edit(editBuilder => {
                editBuilder.replace(validFullRange || selection, formatted);
            })
        } catch (e) {
            vscode.window.showErrorMessage(`${e}`, {modal: true});
        }
    }
}

export async function formatProvider(document: vscode.TextDocument, range: vscode.Range, options: vscode.FormattingOptions, token: vscode.CancellationToken) {
    let formatted = await beautifier(document.getText(range));
    return [
        vscode.TextEdit.replace(range, formatted)
    ];
}