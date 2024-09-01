const rooms = {};

function handleRoomEvents(socket, io) {
    // Crear sala
    socket.on('createRoom', (roomName, userName) => {
        if (!rooms[roomName]) {
            rooms[roomName] = { users: [] };
            const nuevoUsuario = {
                id: socket.id,
                name: userName,
                isReady: true,
                isOwner: true
            };
            socket.join(roomName);
            rooms[roomName].users.push(nuevoUsuario);
            io.to(roomName).emit('updateRoom', rooms[roomName].users);
            console.log(`${userName} creó la sala ${roomName}`);
        } else {
            socket.emit('error', 'Room already exists.');
        }
    });

    // Unirse a una sala existente
    socket.on('joinRoom', (roomName, userName) => {
        if (rooms[roomName]) {
            const existingUser = rooms[roomName].users.find(user => user.name === userName);
            if (existingUser) {
                socket.emit('error', 'Username already taken in this room.');
                return;
            }
    
            const nuevoUsuario = {
                id: socket.id,
                name: userName,
                isReady: false,
                isOwner: false
            };
            socket.join(roomName);
            rooms[roomName].users.push(nuevoUsuario);
            io.to(roomName).emit('updateRoom', rooms[roomName].users);
            socket.emit('room_exists');  // Confirmar que la sala existe
            console.log(`${userName} se unió a la sala ${roomName}`);
        } else {
            socket.emit('room_noexiste');
        }
    });
    

    // Manejar desconexión
    socket.on('disconnect', () => {
        for (const roomName in rooms) {
            const userIndex = rooms[roomName].users.findIndex(user => user.id === socket.id);
            if (userIndex !== -1) {
                const [disconnectedUser] = rooms[roomName].users.splice(userIndex, 1);
                console.log(`${disconnectedUser.name} se desconectó de la sala ${roomName}`);
                io.to(roomName).emit('updateRoom', rooms[roomName].users);
                
                // Emitir un evento específico para la desconexión
                io.to(roomName).emit('playerDisconnected', disconnectedUser.name);

                // Si la sala se queda vacía, eliminarla
                if (rooms[roomName].users.length === 0) {
                    delete rooms[roomName];
                    console.log(`La sala ${roomName} fue eliminada.`);
                }
                break;
            }
        }
    });

    // Marcar a un usuario como listo
    socket.on('ready', (roomName, userName) => {
        if (rooms[roomName]) {
            const user = rooms[roomName].users.find(user => user.name === userName);
            if (user) {
                user.isReady = true;
                io.to(roomName).emit('updateRoom', rooms[roomName].users);
            } else {
                socket.emit('error', 'User not found in this room.');
            }
        } else {
            socket.emit('error', 'Room does not exist.');
        }
    });

    // Marcar a un usuario como no listo
    socket.on('notReady', (roomName, userName) => {
        if (rooms[roomName]) {
            const user = rooms[roomName].users.find(user => user.name === userName);
            if (user) {
                user.isReady = false;
                io.to(roomName).emit('updateRoom', rooms[roomName].users);
            } else {
                socket.emit('error', 'User not found in this room.');
            }
        } else {
            socket.emit('error', 'Room does not exist.');
        }
    });
}

module.exports = handleRoomEvents;
