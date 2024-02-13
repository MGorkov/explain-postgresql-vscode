import * as vscode from 'vscode';
import { IExplainSettings, IResult } from '../index';
import explain from '../api/explain';
import createView from '../view/explainview';

export const EXPLAINANALYZE_COMMAND = 'explain-postgresql.explainanalyze';

let executeQuery = async (query: string): Promise<IResult[]> => {
	return vscode.commands.executeCommand(`sqltools.executeQuery`, query);
}

function getPlan(result: IResult[]): string {
	let res = result[0];
	let colname = res.cols[0];
	return res.results.reduce((rv: string, line: any) => `${rv}${line[colname]}\n`, '');
}

export async function explainCommand(): Promise<void> {

    let editor = vscode.window.activeTextEditor;
    if (!editor) return;
    let selection = editor.selection;
    let query = editor.document.getText(selection);
    if (!query) {
        query = editor.document.getText();
    }			

    const explainSettings = <IExplainSettings>vscode.workspace.getConfiguration('explain-postgresql').get('explain');
    let options = Object.keys(explainSettings).filter(key => explainSettings[key as keyof typeof explainSettings]).join(',');
    let res = await executeQuery(`EXPLAIN (${options}) ${query}`);
    vscode.window.tabGroups.all.forEach((g) => {
        g.tabs.forEach((t) => {
            if (t.label === "SQLTools Results" ||
                (t.isActive && t.input instanceof vscode.TabInputWebview && (<vscode.TabInputWebview>t.input).viewType === 'mainThreadWebview-Results'))
            {
                vscode.window.tabGroups.close(t);
            }
        })
    });	

    let plan = getPlan(res);

    try {
        let url = await explain(plan, query);
        const apiUrl = vscode.workspace.getConfiguration('explain-postgresql').get('url');
        createView(`${apiUrl}${url}`);
    } catch(e) {
        vscode.window.showErrorMessage(`${e}`, {modal: true});
    }
}