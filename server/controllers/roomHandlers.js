const rooms = {};

function handleRoomEvents(socket, io) {
    socket.on('createRoom', (roomName, userName) => {
        rooms[roomName] = { users: [] };
        const nuevoUsuario = {
            name : userName,
            isReady : false
        };
        socket.join(roomName);
        rooms[roomName].users.push(nuevoUsuario);
        io.to(roomName).emit('updateRoom', rooms[roomName].users);
        console.log(`${userName} created room ${roomName}`);
    });

    socket.on('joinRoom', (roomName, userName) => {
        if (rooms[roomName]) {
            const nuevoUsuario = {
                name : userName,
                isReady : false
            };
            //console.log(`---------------------actualmente hay ${rooms[roomName].users}`);
            rooms[roomName].users.push(nuevoUsuario);
            socket.join(roomName);
            io.to(roomName).emit('updateRoom', rooms[roomName].users);
            //console.log(`${userName} joined room ${roomName}`);
            //console.log(`actualmente hay ${rooms[roomName].users}`);
        } else {
            io.emit('room_noexiste');
        }
    });

    //socket.on('updateRoom', )
}

module.exports = handleRoomEvents;