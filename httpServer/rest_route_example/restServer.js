const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const _header_text_html = { 'Content-Type': 'text/html; charset=utf-8' };
const _header_text_plain = { 'Content-Type': 'text/plain; charset-utf-8' }
const _header_app_json = { 'Content-Type': 'application/json; charset=utf-8' }

const PORT = 8082;
const users = {};
const statusMessageOK =
	http.createServer(async (req, res) => {
		try {
			console.log(req.method, req.url);
			if (req.method === 'GET') {
				if (req.url === '/') {
					const data = await fs.readFile(path.join(__dirname, 'restFront.html'));
					res.writeHead(200, _header_text_html);

					return res.end(data);
				} else if (req.url === '/about') {
					const data = await fs.readFile(path.join(__dirname, 'about.html'));
					res.writeHead(200, _header_text_html);

					return res.end(data);
				} else if (req.url === '/users') {
					res.writeHead(200, _header_app_json);

					return res.end(JSON.stringify(users));
				}
				// 주소가 /도 /about도 아니면
				try {
					const data = await fs.readFile(path.join(__dirname, req.url));

					return res.end(data);
				} catch (err) {
					// 주소에 해당하는 라우트를 찾지 못했다는 404 Not found error 발생.
				}
			} else if (req.method === 'POST') {
				if (req.url === '/user') {
					let body = '';
					// 요청의 body를 stream 형식으로 받음.
					req.on('data', (data) => {
						body += data;
					});
					// 요청의 body를 다 받은 후 실행됨.
					return req.on('end', () => {
						console.log('POST 본문(Body):', body);

						const { name } = JSON.parse(body);
						const id = Date.now();

						users[id] = name;

						res.writeHead(201, _header_text_plain);
						res.end('등록 성공');
					});
				}
			} else if (req.method === 'PUT') {
				if (req.url.startsWith('/user/')) {
					const key = req.url.split('/')[2];
					let body = '';
					req.on('data', (data) => {
						body += data;
					});
					return req.on('end', () => {
						console.log('PUT 본문(Body):', body);
						users[key] = JSON.parse(body).name;
						res.writeHead(200, _header_app_json);
						return res.end(JSON.stringify(users));
					});
				}
			} else if (req.method === 'DELETE') {
				if (req.url.startsWith('/user/')) {
					const key = req.url.split('/')[2];

					delete users[key];

					res.writeHead(200, _header_app_json);
					return res.end(JSON.stringify(users));
				}
			}
			res.writeHead(404);
			res.end('NOT FOUND');
		} catch (err) {
			console.error(err);
			res.writeHead(500);
			res.writeHead(500, _header_text_plain);
			res.end(err);
		}
	})
		.listen(PORT, () => {
			console.log(PORT + '번 포트에서 서버 대기 중입니다.');
		});