const roomsController = require('./roomsController')

/*
    Socket es el cable y io la caja, cualquier acutialización o proceso aplicado sobre io afectara a todas las instacias.
*/
function handleRoomEvents(socket, io) {
    socket.on('createRoom', (roomName, userName) => {
        const result = roomsController.createRoom(roomName, { name: userName, isReady: false })
        if (!result.ok) {
            if (result.error === 'room_exists') {
                console.log(`El room ${roomName} ya existe`)
                socket.emit('roomYaExistente')
            } else {
                console.log('createRoom error', result)
            }
        } else {
            console.log(`El room ${roomName} no existe, se crea`)
            socket.join(roomName)
            io.to(roomName).emit('updateRoom', roomsController.getRoom(roomName).users)
            console.log(`${userName} created room ${roomName}`)
        }
    });

    socket.on('joinRoom', (roomName, userName) => {
        const room = roomsController.getRoom(roomName)
        if (room) {
            roomsController.addUser(roomName, { name: userName, isReady: false })
            socket.join(roomName)
            io.to(roomName).emit('updateRoom', roomsController.getRoom(roomName).users)
        } else {
            socket.emit('room_noexiste')
        }
    });

    //socket.on('updateRoom', )
}

module.exports = handleRoomEvents;