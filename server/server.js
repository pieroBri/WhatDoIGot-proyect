const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const handleRoomEvents = require('./controllers/roomHandlers');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
    console.log('New client connected');
    
    handleRoomEvents(socket, io);
    // Aquí es donde gestionarás eventos como "join room", "start game", etc.
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
