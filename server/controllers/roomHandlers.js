const rooms = {};


/*
    Socket es el cable y io la caja, cualquier acutialización o proceso aplicado sobre io afectara a todas las instacias.
*/
function handleRoomEvents(socket, io) {
    socket.on('createRoom', (roomName, userName) => {

        if(rooms[roomName]) 
        {
            console.log(`El room ${roomName} ya existe`)
            socket.emit('roomYaExistente');
        }
        else
        {
            console.log(`El room ${roomName} no existe, se crea`)
            rooms[roomName] = { users: [] };
            const nuevoUsuario = {
                name : userName,
                isReady : false
            };
            socket.join(roomName);
            rooms[roomName].users.push(nuevoUsuario);
            io.to(roomName).emit('updateRoom', rooms[roomName].users);
            console.log(`${userName} created room ${roomName}`);
        }
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
            socket.emit('room_noexiste');
        }
    });

    //socket.on('updateRoom', )
}

module.exports = handleRoomEvents;