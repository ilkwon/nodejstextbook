const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const parseCookies = (cookie = '') =>
	cookie.split(';')
		.map(val => val.split('='))
		.reduce((acc, [key, val]) => {
			acc[key.trim()] = decodeURIComponent(val);
			return acc;
		}, {});

const session = {};

http.createServer(async (req, res) => {
	const cookies = parseCookies(req.headers.cookie);

	// 주소가 /login으로 시작되는 경우
	if (req.url.startsWith('/login')) {
		const url = new URL(req.url, 'http://localhost:8805');
		const name = url.searchParams.get('name');
		const expires = new Date();
		
		expires.setMinutes(expires.getMinutes() + 5);
		
		const uniqueInt = Date.now();
		session[uniqueInt] = { name, expires };
		
		res.writeHead(302,
			{
				Location: '/',
				'Set-Cookie': `session=${uniqueInt}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`,
			});
		res.end();
	} else if (cookies.session && session[cookies.session].expires > new Date()) {
		res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf8' });
		res.end(`${session[cookies.session].name}님 안녕하세요`);
	} else {
		try {
			const data = await fs.readFile(path.join(__dirname,
				'cookie2.html'));
			res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
			res.end(data);
		} catch (err) {
			res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
			res.end(err.message);
		}
	}
})
	.listen(8085, () => {
		console.log('8085번 포트에서 서버 대기 중입니다.');
	});

