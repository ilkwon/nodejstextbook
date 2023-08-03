const SocketIO = require('socket.io');

module.exports = (server, app) => {
	const io = SocketIO(server, { path: '/socket.io' });
	app.set('io', io);

	const room = io.of('/room');
	const chat = io.of('/chat');

	room.on('connect', (socket) => {
		console.log('room 네임스페이스 접속');
		socket.on('disconnect', () => {
			console.log('room 네임스페이스 접속 해제.');
		});
	});

	

	io.on('connection', (socket) => {
		const req = socket.request;
		const ip  = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
		console.log('새로운 클라이언트 접속!', ip, socket.id, req.ip);
		//-----------------------------------------------------------------------
		socket.on('disconnect', () => {
			console.log('클라이언트 접속 해제.', ip, socket.id);
			clearInterval(socket.Interval);
		});
		//-----------------------------------------------------------------------
		socket.on('error', (err) => {
			console.error(err);
		});
		//-----------------------------------------------------------------------
		socket.on('reply', (data) => {
			console.log(data);
		});
		//-----------------------------------------------------------------------
		socket.interval = setInterval(() => {
			socket.emit('news', 'Hello Socket.IO');
		}, 3000);
	});
};