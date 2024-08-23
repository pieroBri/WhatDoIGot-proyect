const rooms = {};

function handleRoomEvents(socket, io) {
    socket.on('createRoom', (roomName, userName) => {
        rooms[roomName] = { users: [] };
        rooms[roomName].users.push(userName);
        socket.join(roomName);
        console.log(`${userName} created room ${roomName}`);
    });

    socket.on('joinRoom', (roomName, userName) => {
        if (rooms[roomName]) {
            console.log(`---------------------actualmente hay ${rooms[roomName].users}`);
            rooms[roomName].users.push(userName);
            socket.join(roomName);
            io.to(roomName).emit('updateRoom', rooms[roomName].users);
            console.log(`${userName} joined room ${roomName}`);
            console.log(`actualmente hay ${rooms[roomName].users}`);
        }
    });

    //socket.on('updateRoom', )
}

module.exports = handleRoomEvents;