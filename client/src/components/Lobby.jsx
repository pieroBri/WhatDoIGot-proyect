import { useState, useEffect} from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000', {autoConnect: false});

function Lobby() {

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('updateRoom', (users) => {
            // Actualiza la lista de usuarios en la interfaz
            console.log('Usuarios en la sala:', users);
            // Aquí podrías actualizar el estado de React para mostrar los usuarios en la UI
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const [roomName, setRoomName] = useState('');
    const [userName, setUserName] = useState('');

    const createRoom = () => {
        socket.connect();
        socket.emit('createRoom', roomName, userName);
    };

    const joinRoom = () => {
        socket.connect();
        socket.emit('joinRoom', roomName, userName);
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Room Name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Your Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
            />
            <button onClick={createRoom}>Create Room</button>
            <button onClick={joinRoom}>Join Room</button>
        </div>
    );
}

export default Lobby;