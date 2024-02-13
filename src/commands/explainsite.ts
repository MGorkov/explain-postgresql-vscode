import * as vscode from 'vscode';
import createView from '../view/explainview';

export const EXPLAINSITE_COMMAND = 'explain-postgresql.explainsite';

export async function explainsiteCommand(): Promise<void> {

    const apiUrl = <string>vscode.workspace.getConfiguration('explain-postgresql').get('url');

    createView(apiUrl);
}