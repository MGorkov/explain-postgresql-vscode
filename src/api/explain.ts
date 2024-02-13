import * as vscode from 'vscode';
import * as https from 'node:https';

const explain_url = "/explain";

export default function explain(plan: string, query: string):Thenable<string> {

	return new Promise((resolve, reject) => {
		const postData = JSON.stringify({plan, query});
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': Buffer.byteLength(postData),
			},
			timeout: 30000,
		};

		const url = vscode.workspace.getConfiguration('explain-postgresql').get('url');

		const req = https.request(`${url}${explain_url}`, options, (res) => {
			let data = '';
			res.setEncoding('utf8');
			res.on('data', (chunk) => {
				data += chunk;
			});
			res.on('end', () => {
				if (/Found. Redirecting to (\S+)$/.test(data)) {
					resolve(RegExp.$1);
				} else {
					reject("Unknown response: " + data);
				}
			});
		});
		
		req.on('error', (e) => {
			console.error(`problem with request: ${e.message}`);
			reject(e);
		});
		
		req.write(postData);
		req.end();	

	});

};
