const http = require('http');
const fs = require('fs').promises;

const PORT = 8080;

const server = http.createServer(async (req, res) => {
	try{
		const data = await fs.readFile('./server2.html');
		res.writeHead(200, { 'Content-Type':'text/html; charset=utf-8'});		
		res.end(data)
	} catch(err){
		console.error(err);
		res.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8'});
		res.end(err.message);
	}
	
});
server.listen(PORT, () => {
	console.log(PORT +'번 포트에서 서버 대기 중입니다.');
});