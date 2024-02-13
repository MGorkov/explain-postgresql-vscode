import * as vscode from 'vscode';
import * as https from 'node:https';
import {BeatifierResponse} from "../index";

const beautifier_url = "/beautifier-api";

export default function beautifier(query: string):Thenable<string> {

	return new Promise((resolve, reject) => {
		const postData = JSON.stringify({query_src: query});
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': Buffer.byteLength(postData),
			},
			timeout: 30000,
		};

		const url = vscode.workspace.getConfiguration('explain-postgresql').get('url');

		const req = https.request(`${url}${beautifier_url}`, options, (res) => {
			let json = '';
			res.setEncoding('utf8');
			res.on('data', (chunk) => {
				json += chunk;
			});
			res.on('end', () => {
				try {
					let {btf_query, btf_query_text} = <BeatifierResponse>JSON.parse(json);
					if (btf_query === btf_query_text) {
						return reject(btf_query_text);
					}
					resolve(btf_query_text);
				} catch (e) {
					reject(e);
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
