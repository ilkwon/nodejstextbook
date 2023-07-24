const http = require('http');

const PORT = 8080;
http.createServer((req, res) => {
	res.writeHead(200, { 'Content-Type':'text/html; charset=utf-8'});
	res.write('<h1>Hello Node!</h1>');
	res.end('<p>Hello Server!</p>')
})
	.listen(PORT, () => {
		console.log(PORT +'번 포트에서 서버 대기 중입니다.');
	});