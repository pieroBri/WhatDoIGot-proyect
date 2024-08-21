const rooms = {};

function handleRoomEvents(socket, io) {
    socket.on('createRoom', (roomName) => {
        rooms[roomName] = { users: [] };
        socket.join(roomName);
        console.log(`${socket.id} created room ${roomName}`);
    });

    socket.on('joinRoom', (roomName, userName) => {
        if (rooms[roomName]) {
            rooms[roomName].users.push(userName);
            socket.join(roomName);
            io.to(roomName).emit('updateRoom', rooms[roomName].users);
        }
    });
}

module.exports = handleRoomEvents;