

module.exports = io => {
    io.on('connection', socket => {
        console.log('New socket connection');

        let currentCode = null;
        var users = [];
        socket.on('move', function(move) {
            console.log('move detected')

            io.to(currentCode).emit('newMove', move);
        });
        
        socket.on('joinGame', function(data) {

            currentCode = data.code;
            socket.join(currentCode);
            if (!games[currentCode]) {
                games[currentCode] = true;
                return;
            }
            
            io.to(currentCode).emit('startGame');
        });

        

        socket.on('setusername', (data) => {
            console.log(data.name + ' Connected or Registered');
        
            // Check if username is already taken
            if (users.includes(data.name)) {
              console.log('Error: Username already taken');
              socket.emit('username_error', 'Username already taken');
            } else {
              users.push(data.name);
              socket.username = data.name;
              io.emit('user', data);
              console.log('Username set: ' + data.name); 
            }
          });

        socket.on('chatMessage', function(message) {
            console.log('Chat message received:', message);
            io.to(currentCode).emit('chatMessage', message);
        });
        
        socket.on('msg',function(data){
            console.log('Chat message received:', JSON.stringify(data));
            io.sockets.emit('newmsg',data);
        });
        
        
        socket.on('disconnect', function() {
            console.log('socket disconnected');

            if (currentCode) {
                io.to(currentCode).emit('gameOverDisconnect');
                delete games[currentCode];
            }
        });

    });
};