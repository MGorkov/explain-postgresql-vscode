import * as vscode from 'vscode';
import Context from '../context';

function getHtml (url: string) {
	return `<!DOCTYPE html>
		<html>
        <head>
        </head>
		<body style="margin:0px;padding:0px;overflow:hidden">
		<div>
			<iframe sandbox="allow-scripts allow-forms allow-same-origin allow-downloads" src=${url} style="width:100vw;height:100vh;border: none;display: block;"></iframe>
		</div>
		</body>
		</html>`;
}

export default function createView(url: string) {
    let whereToShow;
    let location = <vscode.ViewColumn | string>vscode.workspace.getConfiguration('explain-postgresql').get('location');
    switch (location) {
        case 'current':
            whereToShow = vscode.ViewColumn.Active;
            break;
        case 'next':
            whereToShow = vscode.ViewColumn.Beside;
            break;
        default:
            whereToShow = <vscode.ViewColumn>location;
    }

    let panel = vscode.window.createWebviewPanel(
        'explainAnalyze',
        'Explain Analyze',
        whereToShow,
            {
            enableScripts: true,
            retainContextWhenHidden: true,
        }
    );
    panel.webview.html = getHtml(url);
    
    panel.iconPath = vscode.Uri.joinPath(Context.extensionUri, "icons/EP.png");
}