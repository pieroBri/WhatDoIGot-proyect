const rooms = {};

function handleRoomEvents(socket, io) {
    // Crear sala
    socket.on('createRoom', (roomName, userName) => {
        if (!rooms[roomName]) {
            rooms[roomName] = { users: [] };
            const nuevoUsuario = {
                id: socket.id,  // Guardar ID del socket
                name: userName,
                isReady: false,
                isOwner: true   // El creador es el dueño de la sala
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
            const nuevoUsuario = {
                id: socket.id,  // Guardar ID del socket
                name: userName,
                isReady: false,
                isOwner: false  // No es el dueño si solo se une
            };
            socket.join(roomName);
            rooms[roomName].users.push(nuevoUsuario);
            io.to(roomName).emit('updateRoom', rooms[roomName].users);
            console.log(`${userName} se unió a la sala ${roomName}`);
        } else {
            socket.emit('error', 'Room does not exist.');
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
            }
        }
    });

    // Marcar a un usuario como no listo
    socket.on('notReady', (roomName, userName) => {
        if (rooms[roomName]) {
            const user = rooms[roomName].users.find(user => user.name === userName);
            if (user) {
                user.isReady = false;
                io.to(roomName).emit('updateRoom', rooms[roomName].users);
            }
        }
    });
}

module.exports = handleRoomEvents;
