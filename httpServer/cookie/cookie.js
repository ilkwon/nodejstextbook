const http = require('http');
const PORT = 8083;

http.createServer((req,res) => {
	console.log(req.url, req.headers.cookie);
	res.writeHead(200, {'Set-Cookie': 'mycookie=test'});
	res.end('Hello Cookie');
})
	.listen(PORT, () => {
		console.log(PORT+'번 포트에서 서버 대기중입니다.')
	});

	