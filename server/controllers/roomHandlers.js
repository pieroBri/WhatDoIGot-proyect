const roomsController = require('./roomsController')

/*
    Socket es el cable y io la caja, cualquier acutialización o proceso aplicado sobre io afectara a todas las instacias.
*/
function handleRoomEvents(socket, io) {
    socket.on('createRoom', (roomName, userName) => {
        const result = roomsController.createRoom(roomName, { name: userName, isReady: false, isMaster: true })
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
            roomsController.addUser(roomName, { name: userName, isReady: false, isMaster: false })
            socket.join(roomName)
            io.to(roomName).emit('updateRoom', roomsController.getRoom(roomName).users)
        } else {
            socket.emit('room_noexiste')
        }
    });

    socket.on('leaveRoom', (roomName, userName) => {
        const room = roomsController.getRoom(roomName)
        if(room){
            roomsController.removeUserByName(roomName, userName)
            asignarMaster(roomName)
            socket.leave(roomName)
            io.to(roomName).emit('updateRoom', roomsController.getRoom(roomName).users)
            if(roomsController.getRoom(roomName).users.length === 0){
                roomsController.removeRoom(roomName)
                console.log(`El room ${roomName} se ha eliminado por estar vacio`)
            }
        }else{
           socket.emit('room_noexiste') 
        }
    });

}

function asignarMaster(roomName) {
    const room = roomsController.getRoom(roomName)
    if (room) {
        const masterUser = room.users.find(user => user.master)
        if (!masterUser && room.users.length > 0) {
            room.users[0].master = true
            console.log(`El usuario ${room.users[0].name} ha sido asignado como master del room ${roomName}`)
        }
    }
}

module.exports = handleRoomEvents;