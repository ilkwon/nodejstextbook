const http = require('http');
const fs = require('fs').promises;

const PORT = 8080;

const server = http.createServer((req, res) => {
	try{
		res.writeHead(200, { 'Content-Type':'text/html; charset=utf-8'});
		res.write('<h1>Hello Node!</h1>');
		res.end('<p>Hello Server!</p>')		
	} catch (err) {
		console.error(err);
		res.writeHead(500, {'Content-Type':'text/plain; charset=utf-8'});
		res.end(err.message);
	}
});
server.listen(PORT);
