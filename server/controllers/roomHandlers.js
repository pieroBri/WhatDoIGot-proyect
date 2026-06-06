const roomsController = require('./roomsController')

/*
    Socket es el cable y io la caja, cualquier acutialización o proceso aplicado sobre io afectara a todas las instacias.
*/
function handleRoomEvents(socket, io) {
    socket.on('createRoom', (roomName, userName) => {
        const result = roomsController.createRoom(roomName, { id: socket.id, name: userName, isReady: false, isMaster: true })
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
            roomsController.addUser(roomName, { id: socket.id, name: userName, isReady: false, isMaster: false })
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

    socket.on('toggleReady', (roomName, userName) => {
        const room = roomsController.getRoom(roomName)
        if(room){
            const user = room.users.find(user => user.name === userName)
            if(user){
                user.isReady = !user.isReady
                io.to(roomName).emit('updateRoom', roomsController.getRoom(roomName).users)
            }else{
                socket.emit('user_noexiste')
            }
        }else{
           socket.emit('room_noexiste') 
        }
    });

    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected', socket.id)
        const result = roomsController.removeUserById(socket.id)
        if (result.ok && result.roomName) {
            const roomName = result.roomName
            const room = roomsController.getRoom(roomName)
            if (room) {
                asignarMaster(roomName)
                if (room.users.length === 0) {
                    roomsController.removeRoom(roomName)
                    io.to(roomName).emit('room_deleted')
                    console.log(`El room ${roomName} se ha eliminado por estar vacio`)
                } else {
                    io.to(roomName).emit('updateRoom', room.users)
                }
            } else {
                io.to(roomName).emit('room_deleted')
            }
        }
    });

}

function asignarMaster(roomName) {
    const room = roomsController.getRoom(roomName)
    if (room) {
        const masterUser = room.users.find(user => user.isMaster)
        if (!masterUser && room.users.length > 0) {
            room.users[0].isMaster = true
            console.log(`El usuario ${room.users[0].name} ha sido asignado como master del room ${roomName}`)
        }
    }
}

module.exports = handleRoomEvents;