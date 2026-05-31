const express = require('express');
const app = express();
const PORT = 4000;

const http = require('http').Server(app);
const cors = require('cors');
const handleRoomEvents = require('./controllers/roomHandlers');
const roomsController = require('./controllers/roomsController');
const RoomRoutes = require('./routes/RoomRoutes');

app.use(cors());
app.use(express.json());
app.use('/api', RoomRoutes);

const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:5173"
    }
});

io.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    handleRoomEvents(socket, io)
    socket.on('disconnect', () => {
      console.log('🔥: A user disconnected');
    });
});

// Obtiene una room por nombre
app.get('/api/rooms/:room', (req, res) => {
  const room = roomsController.getRoom(req.params.room)
  if (!room) return res.status(404).json({ error: 'not_found' })
  res.json(room)
})


// Renombrar room
app.put('/api/rooms/:room', (req, res) => {
  const { newName } = req.body
  const result = roomsController.renameRoom(req.params.room, newName)
  if (!result.ok) return res.status(409).json({ error: result.error })
  res.json({ ok: true })
})

// Eliminar room
app.delete('/api/rooms/:room', (req, res) => {
  const result = roomsController.removeRoom(req.params.room)
  if (!result.ok) return res.status(404).json({ error: result.error })
  // notificar via sockets que la room fue eliminada
  io.to(req.params.room).emit('room_deleted')
  res.json({ ok: true })
})

// Eliminar usuario por nombre
app.delete('/api/rooms/:room/users/:username', (req, res) => {
  const result = roomsController.removeUserByName(req.params.room, req.params.username)
  if (!result.ok) return res.status(404).json({ error: result.error })
  // emitir estado actualizado
  const room = roomsController.getRoom(req.params.room)
  io.to(req.params.room).emit('updateRoom', room ? room.users : [])
  res.json({ ok: true, removed: result.removed })
})

// Actualizar usuario por nombre
app.put('/api/rooms/:room/users/:username', (req, res) => {
  const result = roomsController.updateUserByName(req.params.room, req.params.username, req.body)
  if (!result.ok) return res.status(404).json({ error: result.error })
  const room = roomsController.getRoom(req.params.room)
  io.to(req.params.room).emit('updateRoom', room ? room.users : [])
  res.json({ ok: true, user: result.user })
})

//Eliminar todas las rooms (para testing)
app.delete('/api/rooms/', (req, res) => {  const { roomName } = req.body
  const rooms = roomsController.getAll()
  Object.keys(rooms).forEach((room) => {
    roomsController.removeRoom(room)
    io.to(room).emit('room_deleted')
  })
  res.json({ ok: true, removed: Object.keys(rooms).length })
})

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
