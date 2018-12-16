let channelsList = [];
let userDetailsList = [];

function bootstrapSocketServer(io) {
	io.on('connection', (socket) => {

		socket.on('register', data => {
			console.log('Registeration Received ', data);
			if(data.username !== 'Anonymous') {
				userDetailsList.push({
					socketId: socket.id,
					userId: data.username
				});

				socket.emit('welcomeMessage', 'Welcome ' + data.username + ' !!');

				data.channels.forEach(channel => {
					socket.join(channel);
					socket.emit('addedToChannel', { channel: channel });
				});
			}
		});

		socket.on('message', data => {
			console.log('Message Received ', data);
			let userDetails = userDetailsList.filter(user => user.socketId === socket.id);
			socket.broadcast.emit('newMessage', { username: userDetails[0].userId, message: data.message });
		});

		socket.on('joinChannel', data => {
			console.log('Join Channel Request Received ', data);
			if(data.channel) {
				channelsList.push(data);
				socket.join(data.channel);
				io.sockets.emit('addedToChannel', { channel: data.channel });
			}
		});
			
		socket.on('leaveChannel', data => {
			console.log('Leave Channel Request Received ', data);
			if(data.channel) {
				socket.leave(data.channel);
				io.sockets.emit('removedFromChannel', 'User has left the channel ' + data.channel + ' !!');
			}
		});
				
	});
}

module.exports = bootstrapSocketServer;