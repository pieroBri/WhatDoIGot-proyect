const roomsController = require('./roomsController')
const gamesController = require('./gamesController')

/*
    Socket es el cable y io la caja, cualquier acutialización o proceso aplicado sobre io afectara a todas las instacias.
*/
function handleRoomEvents(socket, io) {
    socket.on('createRoom', (roomName, userName) => {
        const result = roomsController.createRoom(roomName, { id: socket.id, name: userName, isReady: false, isMaster: true, isTurnoActivo: true })
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
            roomsController.addUser(roomName, { id: socket.id, name: userName, isReady: false, isMaster: false, isTurnoActivo: false })
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

    socket.on('pasarTurno', (roomName, userName) => {
        const room = roomsController.getRoom(roomName)
        if(room){
            const user = room.users.find(user => user.name === userName)
            if(user){
                pasarTurno(roomName, userName)
                io.to(roomName).emit('updateRoom', roomsController.getRoom(roomName).users)
            }else{
                socket.emit('user_noexiste')
            }
        }else{
           socket.emit('room_noexiste') 
        }
    });

    socket.on('startGame', (roomName) => {
        const games = gamesController.getGamesFromJson();
        const room = roomsController.getRoom(roomName)

        if (room) {
            room.users.forEach((user, index) => {
                const game = games[Math.floor(Math.random() * games.length)];
                user.game = {
                    id: game.id,
                    name: game.name,
                    avatar: game.background_image
                }
            })
            io.to(roomName).emit('updateRoom', roomsController.getRoom(roomName).users)
            io.to(roomName).emit('startGame')
        } else {
            socket.emit('room_noexiste')
        }
    });

    socket.on('responder', (roomName, userName, respuesta) => {
        const room = roomsController.getRoom(roomName)

        if (room) {
            const user = room.users.find(u => u.name === userName)
            if (user) {
                if (respuesta === user.game.name) {
                    console.log(`El usuario ${userName} ha respondido correctamente!`)
                    io.to(roomName).emit('respuesta_correcta', userName)
                } else {
                    console.log(`El usuario ${userName} ha respondido incorrectamente!`)
                    pasarTurno(roomName, userName)
                    io.to(roomName).emit('respuesta_incorrecta', userName)
                    io.to(roomName).emit('updateRoom', roomsController.getRoom(roomName).users)
                }
            }
        }
    });

    // socket.on('endGame', (roomName) => {
    //     const room = roomsController.getRoom(roomName)

    //     if (room) {
    //         room.users.forEach((user) => {
    //             delete user.game
    //             user.isReady = false
    //             user.isMaster === true ? user.isTurnoActivo = true : false
    //         })
    //         io.to(roomName).emit('updateRoom', roomsController.getRoom(roomName).users)
    //         io.to(roomName).emit('endGame')
    //     } else {
    //         socket.emit('room_noexiste')
    //     }
    // });

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

function pasarTurno(roomName, userName) {
    const room = roomsController.getRoom(roomName)
    const currentUser = room.users.find(user => user.name === userName)
    if (currentUser) {
        currentUser.isTurnoActivo = false
        const currentIndex = room.users.indexOf(currentUser)
        const nextIndex = (currentIndex + 1) % room.users.length
        const nextUser = room.users[nextIndex]
        nextUser.isTurnoActivo = true
    }
}

function asignarMaster(roomName) {
    const room = roomsController.getRoom(roomName)
    if (room) {
        const masterUser = room.users.find(user => user.isMaster)
        if (!masterUser && room.users.length > 0) {
            room.users[0].isMaster = true
            // Si nadie tiene el turno activo, asignarlo al nuevo master
            const someoneHasTurn = room.users.some(u => u.isTurnoActivo)
            if (!someoneHasTurn) {
                room.users[0].isTurnoActivo = true
            }
            console.log(`El usuario ${room.users[0].name} ha sido asignado como master del room ${roomName}`)
        }
    }
}

module.exports = handleRoomEvents;